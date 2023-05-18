import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@nestjs-plus/discovery';
import SqsService from './sqs.service';
import {
  SqsModuleAsyncOptions,
  SqsModuleOptionsFactory,
  SqsOptions,
} from './sqs.types';
import { SQS_OPTIONS } from './sqs.constants';

/**
 * @desc This module is used to register the SqsService as a global provider.
 * @tutorial before use check configuration in `src/config/sqs.config.ts`
 * and initialize the module in `src/app.module.ts`
 * @example:
 * ```typescript
 * // app.module.ts
 *
 * SqsModule.registerAsync({
 *       inject: [ConfigService],
 *       useFactory: async (configService: ConfigService) => {
 *         const sqsConsumerConfig = configService.get('sqs.consumer');
 *         const sqsProducerConfig = configService.get('sqs.producer');
 *
 *         return {
 *           consumers: [{
 *             name: sqsConsumerConfig.queues.aggregate,
 *             queueUrl: sqsConsumerConfig.queues.aggregateQueueUrl,
 *             region: sqsConsumerConfig.region,
 *             sqs: new SQSClient({
 *               region: sqsConsumerConfig.region,
 *               credentials: {
 *                 accessKeyId: sqsConsumerConfig.credentials.accessKeyId,
 *                 secretAccessKey: sqsConsumerConfig.credentials.secretAccessKey,
 *               },
 *             }),
 *           }],
 *           producers: [{
 *             name: sqsProducerConfig.queues.aggregate,
 *             queueUrl: sqsProducerConfig.queues.aggregateQueueUrl,
 *             region: sqsProducerConfig.region,
 *             sqs: new SQSClient({
 *               region: sqsProducerConfig.region,
 *               credentials: {
 *                 accessKeyId: sqsProducerConfig.credentials.accessKeyId,
 *                 secretAccessKey: sqsProducerConfig.credentials.secretAccessKey,
 *               },
 *             }),
 *           }],
 *         };
 *       },
 *     })
 * ```
 *
 * ```typescript
 *  await this.sqsService.send('example-queue', {
 *     id: 'id',
 *     body: { test: 'yay' },
 *     delaySeconds: 6,
 *  });
 *```
 *
 * ```typescript
 * @SqsMessageHandler('example-queue', false)
 * public async handleMessage(message: Message) {
 *   const _message = CustomMessage.toJSON(message);
 *    console.log('message', message);
 * }
 * ```
 */
@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [SqsService],
  exports: [SqsService],
})
export default class SqsModule {
  public static register(options: SqsOptions): DynamicModule {
    const sqsOptions: Provider = {
      provide: SQS_OPTIONS,
      useValue: options,
    };
    const sqsProvider: Provider = {
      provide: SqsService,
      useFactory: (opt: SqsOptions, discover: DiscoveryService) =>
        new SqsService(options, discover),
      inject: [SQS_OPTIONS, DiscoveryService],
    };

    return {
      global: true,
      module: SqsModule,
      imports: [DiscoveryModule],
      providers: [sqsOptions, sqsProvider],
      exports: [sqsProvider],
    };
  }

  public static registerAsync(options: SqsModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);
    const sqsProvider: Provider = {
      provide: SqsService,
      useFactory: (opt: SqsOptions, discover: DiscoveryService) =>
        new SqsService(opt, discover),
      inject: [SQS_OPTIONS, DiscoveryService],
    };

    return {
      global: true,
      module: SqsModule,
      imports: [DiscoveryModule, ...(options.imports ?? [])],
      providers: [...asyncProviders, sqsProvider],
      exports: [sqsProvider],
    };
  }

  private static createAsyncProviders(
    options: SqsModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<SqsModuleOptionsFactory>;

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: SqsModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: SQS_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<SqsModuleOptionsFactory>,
    ];

    return {
      provide: SQS_OPTIONS,
      useFactory: async (optionsFactory: SqsModuleOptionsFactory) => {
        await optionsFactory.createOptions();
      },
      inject,
    };
  }
}
