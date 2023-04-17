import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isAlphaNumeric', async: false })
export class IsUnicodeAlphaNumeric implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const alphaNumbericRegExp = /^[a-zA-Z\u0400-\u04FF\d\s ]+$/;
    return alphaNumbericRegExp.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `The string contains symbols or non-English letters (${args})`;
  }
}
