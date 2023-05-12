import { Catch, HttpStatus, BadRequestException } from '@nestjs/common';
import { BAD_REQUEST } from '@constants/errors.constants';
import BaseExceptionFilter from './base-exception.filter';

@Catch(BadRequestException)
export class BadRequestExceptionFilter extends BaseExceptionFilter {
  constructor() {
    super(BAD_REQUEST, HttpStatus.BAD_REQUEST);
  }
}
