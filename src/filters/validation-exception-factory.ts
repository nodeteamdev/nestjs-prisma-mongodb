import { ValidationError } from '@nestjs/common';
import { ValidationException } from '@filters/validation.exception';

export interface TransformedErrors {
  [key: string]: string[];
}

function transformErrors(errors: ValidationError[]): TransformedErrors[] {
  return errors.reduce((acc: TransformedErrors[], error: ValidationError) => {
    if (error.children?.length && error.children.length !== 0) {
      const childrenErrors = error.children as ValidationError[];

      return [...acc, ...transformErrors(childrenErrors)];
    }

    acc.push({
      [error.property]: error.constraints
        ? Object.values(error.constraints)
        : [],
    });

    return acc;
  }, []);
}

function validationExceptionFactory(validationErrors: ValidationError[]) {
  return new ValidationException(transformErrors(validationErrors));
}

export default validationExceptionFactory;
