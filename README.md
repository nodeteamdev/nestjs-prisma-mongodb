# General
This is starter of a Nest.js 10 application with a MongoDB replica set + Prisma ODM.

# Features
- JWT Authentication
- CASL Integration
- Simple query builder
- Data Pagination
- Data Sorting
- Data Filtering
- Exception Filters
- Validation Pipes
- Swagger Documentation
- Docker Compose
- MongoDB Replica Set
- Serializers
- Health Check

# Providers implemented
- Prisma
- Twilio
- AWS S3
- AWS SQS

# Requirements
- Nest.js 10
- Docker
- Docker Compose
- MongoDB
- Node.js
- NPM

# Development

## MongoDB Replica Set
1. Create volume for each MongoDB node
```bash
docker volume create --name mongodb_repl_data1 -d local
docker volume create --name mongodb_repl_data2 -d local
docker volume create --name mongodb_repl_data3 -d local
```

2. Start the Docker containers using docker-compose
```bash
docker-compose up -d
```

3. Start an interactive MongoDb shell session on the primary node
```bash
docker exec -it mongo0 mongo --port 30000

# in the shell
config={"_id":"rs0","members":[{"_id":0,"host":"mongo0:30000"},{"_id":1,"host":"mongo1:30001"},{"_id":2,"host":"mongo2:30002"}]}
rs.initiate(config);
```

4 Update hosts file
```bash
sudo nano  /etc/hosts

# write in the file
127.0.0.1 mongo0 mongo1 mongo2
```

5. Connect to MongoDB and check the status of the replica set
```
mongo "mongodb://localhost:30000,localhost:30001,localhost:30002/?replicaSet=rs0"
```

## Migration

1. Run migrations

```bash
npm run db:migration:up
```
> Need to apply migration `token-ttl-indexes` to database
This migration create TTL indexes for `refreshToken` and `accessToken` fields in `TokenWhiteList` model.
Token will automatically deleted from database when token expriration date will come.


## Start
1. Install dependencies

```
npm install
```

2. Generate Prisma Types
    
```
npm run db:generate
```

3. Push MongoDB Schema 

```
npm run db:push
```


4. Start the application

```
npm run start:dev
```

## Pagination
Pagination is available for all endpoints that return an array of objects. The default page size is 10. You can change the default page size by setting the `DEFAULT_PAGE_SIZE` environment variable.
We are using the [nestjs-prisma-pagination](https://www.npmjs.com/package/@nodeteam/nestjs-prisma-pagination) library for pagination.

Example of a paginated response:

```typescript
{
    data: T[],
    meta: {
        total: number,
        lastPage: number,
        currentPage: number,
        perPage: number,
        prev: number | null,
        next: number | null,
  },
}
```

## Query Builder
The query builder is available for all endpoints that return an array of objects. You can use the query builder to filter, sort, and paginate the results.
We are using the [nestjs-pipes](https://www.npmjs.com/package/@nodeteam/nestjs-pipes) library for the query builder.

Example of a query builder request:

```
GET /user/?where=firstName:John
```

```typescript
    @Get()
    @ApiQuery({ name: 'where', required: false, type: 'string' })
    @ApiQuery({ name: 'orderBy', required: false, type: 'string' })
    @UseGuards(AccessGuard)
    @Serialize(UserBaseEntity)
    @UseAbility(Actions.read, TokensEntity)
    findAll(
        @Query('where', WherePipe) where?: Prisma.UserWhereInput,
        @Query('orderBy', OrderByPipe) orderBy?: Prisma.UserOrderByWithRelationInput,
    ): Promise<PaginatorTypes.PaginatedResult<User>> {
        return this.userService.findAll(where, orderBy);
    }
```

## Swagger
Swagger documentation is available at http://localhost:3000/docs

## JWT

### AuthGuard
By default, `AuthGuard` will look for a JWT in the `Authorization` header with the scheme `Bearer`. You can customize this behavior by passing an options object to the `AuthGuard` decorator.
All routes that are protected by the `AuthGuard` decorator will require a valid JWT token in the `Authorization` header of the incoming request.
    
```typescript
// app.module.ts

providers: [
    {
        provide: APP_GUARD,
        useClass: AuthGuard,
    },
]
```

### SkipAuth
You can skip authentication for a route by using the `SkipAuth` decorator.

```typescript
// app.controller.ts

@SkipAuth()
@Get()
async findAll() {
    return await this.appService.findAll();
}
```

## CASL

### Roles configuration

Define roles for app:

```typescript
// app.roles.ts

export enum Roles {
  admin = 'admin',
  customer = 'customer',
}
```

## Permissions definition

`nest-casl` comes with a set of default actions, aligned with [Nestjs Query](https://doug-martin.github.io/nestjs-query/docs/graphql/authorization).
`manage` has a special meaning of any action.
DefaultActions aliased to `Actions` for convenicence.

```typescript
export enum DefaultActions {
  read = 'read',
  aggregate = 'aggregate',
  create = 'create',
  update = 'update',
  delete = 'delete',
  manage = 'manage',
}
```

In case you need custom actions either [extend DefaultActions](#custom-actions) or just copy and update, if extending typescript enum looks too tricky.

Permissions defined per module. `everyone` permissions applied to every user, it has `every` alias for `every({ user, can })` be more readable. Roles can be extended with previously defined roles.

```typescript
// post.permissions.ts

import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';

import { Roles } from '../app.roles';
import { Post } from './dtos/post.dto';
import { Comment } from './dtos/comment.dto';

export type Subjects = InferSubjects<typeof Post, typeof Comment>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ can }) {
    can(Actions.read, Post);
    can(Actions.create, Post);
  },

  customer({ user, can }) {
    can(Actions.update, Post, { userId: user.id });
  },

  operator({ can, cannot, extend }) {
    extend(Roles.customer);

    can(Actions.manage, PostCategory);
    can(Actions.manage, Post);
    cannot(Actions.delete, Post);
  },
};
```

```typescript
// post.module.ts

import { Module } from '@nestjs/common';
import { CaslModule } from 'nest-cast';

import { permissions } from './post.permissions';

@Module({
  imports: [CaslModule.forFeature({ permissions })],
})
export class PostModule {}
```

## CaslUser decorator
CaslUser decorator provides access to lazy loaded user, obtained from request or user hook and cached on request object.

```typescript
    @UseGuards(AuthGuard, AccessGuard)
    @UseAbility(Actions.update, Post)
    async updatePostConditionParamNoHook(
      @Args('input') input: UpdatePostInput,
      @CaslUser() userProxy: UserProxy<User>
    ) {
    const user = await userProxy.get();
    }
```

## User Hook

Sometimes permission conditions require more info on user than exists on `request.user` User hook called after `getUserFromRequest` only for abilities with conditions. Similar to subject hook, it can be class or tuple.
Despite UserHook is configured on application level, it is executed in context of modules under authorization. To avoid importing user service to each module, consider making user module global.

```typescript
// user.hook.ts

import { Injectable } from '@nestjs/common';

import { UserBeforeFilterHook } from 'nest-casl';
import { UserService } from './user.service';
import { User } from './dtos/user.dto';

@Injectable()
export class UserHook implements UserBeforeFilterHook<User> {
  constructor(readonly userService: UserService) {}

  async run(user: User) {
    return {
      ...user,
      ...(await this.userService.findById(user.id)),
    };
  }
}
```

```typescript
//app.module.ts

import { Module } from '@nestjs/common';
import { CaslModule } from 'nest-casl';

@Module({
  imports: [
    CaslModule.forRoot({
      getUserFromRequest: (request) => request.user,
      getUserHook: UserHook,
    }),
  ],
})
export class AppModule {}
```

or with dynamic module initialization

```typescript
//app.module.ts

import { Module } from '@nestjs/common';
import { CaslModule } from 'nest-casl';

@Module({
  imports: [
    CaslModule.forRootAsync({
      useFactory: async (service: SomeCoolService) => {
        const isOk = await service.doSomething();

        return {
          getUserFromRequest: () => {
            if (isOk) {
              return request.user;
            }
          },
        };
      },
      inject: [SomeCoolService],
    }),
  ],
})
export class AppModule {}
```

or with tuple hook

```typescript
//app.module.ts

import { Module } from '@nestjs/common';
import { CaslModule } from 'nest-casl';

@Module({
  imports: [
    CaslModule.forRoot({
      getUserFromRequest: (request) => request.user,
      getUserHook: [
        UserService,
        async (service: UserService, user) => {
          return service.findById(user.id);
        },
      ],
    }),
  ],
})
export class AppModule {}
```

### Custom actions

Extending enums is a bit tricky in TypeScript
There are multiple solutions described in [this issue](https://github.com/microsoft/TypeScript/issues/17592) but this one is the simplest:

```typescript
enum CustomActions {
  feature = 'feature',
}

export type Actions = DefaultActions | CustomActions;
export const Actions = { ...DefaultActions, ...CustomActions };
```

### Custom User and Request types

For example, if you have User with numeric id and current user assigned to `request.loggedInUser`

```typescript
class User implements AuthorizableUser<Roles, number> {
  id: number;
  roles: Array<Roles>;
}

interface CustomAuthorizableRequest {
  loggedInUser: User;
}

@Module({
  imports: [
    CaslModule.forRoot<Roles, User, CustomAuthorizableRequest>({
      superuserRole: Roles.admin,
      getUserFromRequest(request) {
        return request.loggedInUser;
      },
      getUserHook: [
        UserService,
        async (service: UserService, user) => {
          return service.findById(user.id);
        },
      ],
    }),
    //  ...
  ],
})
export class AppModule {}
```

## Prisma 

### Configuration

---
title: Configuration
---

`PrismaModule` provides a `forRoot(...)` and `forRootAsync(..)` method. They accept an option object of `PrismaModuleOptions` for the [PrismaService](#prismaservice-options) and [PrismaClient](#prismaclient-options).

## PrismaService options

### isGlobal

If `true`, registers `PrismaModule` as a [global](https://docs.nestjs.com/modules#global-modules) module. `PrismaService`will be available everywhere.

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

### prismaServiceOptions.explicitConnect

If `true`, `PrismaClient` explicitly creates a connection pool and your first query will respond instantly.

For most use cases the [lazy connect](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-management) behavior of `PrismaClient` will do. The first query of `PrismaClient` creates the connection pool.

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [
    PrismaModule.forRoot({
      prismaServiceOptions: {
        explicitConnect: true,
      },
    }),
  ],
})
export class AppModule {}
```

## PrismaClient options

### prismaServiceOptions.prismaOptions

Pass `PrismaClientOptions` [options](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference/#prismaclient) directly to the `PrismaClient`.

### prismaServiceOptions.middlewares

Apply Prisma [middlewares](/docs/prisma-middlewares) to perform actions before or after db queries.

## Async configuration

Additionally, `PrismaModule` provides a `forRootAsync` to pass options asynchronously.

### useFactory

One option is to use a factory function:

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: () => ({
        prismaOptions: {
          log: ['info', 'query'],
        },
        explicitConnect: false,
      }),
    }),
  ],
})
export class AppModule {}
```

You can inject dependencies such as `ConfigModule` to load options from .env files.

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return {
          prismaOptions: {
            log: [configService.get('log')],
            datasources: {
              db: {
                url: configService.get('DATABASE_URL'),
              },
            },
          },
          explicitConnect: configService.get('explicit'),
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### useClass

Alternatively, you can use a class instead of a factory:

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useClass: PrismaConfigService,
    }),
  ],
})
export class AppModule {}
```

Create the `PrismaConfigService` and extend it with the `PrismaOptionsFactory`

```ts
import { Injectable } from '@nestjs/common';
import { PrismaOptionsFactory, PrismaServiceOptions } from 'nestjs-prisma';

@Injectable()
export class PrismaConfigService implements PrismaOptionsFactory {
  constructor() {
    // TODO inject any other service here like the `ConfigService`
  }

  createPrismaOptions(): PrismaServiceOptions | Promise<PrismaServiceOptions> {
    return {
      prismaOptions: {
        log: ['info', 'query'],
      },
      explicitConnect: true,
    };
  }
}
```

### Prisma Middleware

Apply [Prisma Middlewares](https://www.prisma.io/docs/concepts/components/prisma-client/middleware) with `PrismaModule`

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [
    PrismaModule.forRoot({
      prismaServiceOptions: {
        middlewares: [
          async (params, next) => {
            // Before query: change params
            const result = await next(params);
            // After query: result
            return result;
          },
        ], // see example loggingMiddleware below
      },
    }),
  ],
})
export class AppModule {}
```

Here is an example for using a [Logging middleware](https://www.prisma.io/docs/concepts/components/prisma-client/middleware/logging-middleware).

Create your Prisma Middleware and export it as a `function`

```ts
// src/logging-middleware.ts
import { Prisma } from '@prisma/client';

export function loggingMiddleware(): Prisma.Middleware {
  return async (params, next) => {
    const before = Date.now();

    const result = await next(params);

    const after = Date.now();

    console.log(
      `Query ${params.model}.${params.action} took ${after - before}ms`
    );

    return result;
  };
}
```

Now import your middleware and add the function into the `middlewares` array.

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { loggingMiddleware } from './logging-middleware';

@Module({
  imports: [
    PrismaModule.forRoot({
      prismaServiceOptions: {
        middlewares: [loggingMiddleware()],
      },
    }),
  ],
})
export class AppModule {}
```
