import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, isEmail, isNumberString, isPhoneNumber } from 'class-validator';

// BINGO: create custom validator
@ValidatorConstraint({ name: 'EmailOrPhone', async: false })
export class EmailOrPhoneConstraint implements ValidatorConstraintInterface
{
    validate(value: unknown, args?: ValidationArguments): boolean
    {
        if (typeof value === 'string')
        {
            if (isEmail(value))
            {
                return true;
            }

            if (isPhoneNumber(value, 'UZ') && isNumberString(value, { no_symbols: true }))
            {
                return true;
            }
        }

        return false;
    }

    defaultMessage(args?: ValidationArguments)
    {
        return `${args.property} must be an email or phone number`;
    }
}