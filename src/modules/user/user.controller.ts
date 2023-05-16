import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import ApiBaseResponses from '@decorators/api-base-response.decorator';
import { ApiDefaultResponse } from '@decorators/api-default-response.decorator';
import { AccessGuard, Actions, UseAbility } from '@modules/casl';
import UserEntity from '@modules/user/entities/user.entity';

@ApiTags('User')
@ApiBearerAuth()
@ApiBaseResponses()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiDefaultResponse({
    summary: 'Create user',
    type: CreateUserDto,
  })
  @ApiBody({ type: CreateUserDto })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, UserEntity)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
