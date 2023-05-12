import { Catch, HttpStatus, NotFoundException } from '@nestjs/common';
import { NOT_FOUND } from '@constants/errors.constants';
import BaseExceptionFilter from './base-exception.filter';

@Catch(NotFoundException)
export default class NotFoundExceptionFilter extends BaseExceptionFilter {
  constructor() {
    super(NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}
