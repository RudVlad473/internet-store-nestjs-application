import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isAlphaNumeric', async: false })
export class IsUnicodeAlpha implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const alphabeticRegExp = /^[a-zA-Z\u0400-\u04FF ]+$/;
    return alphabeticRegExp.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'The string contains symbols or non-English letters';
  }
}
