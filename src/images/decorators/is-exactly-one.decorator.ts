import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsExactlyOneTrue(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isExactlyOneTrue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(_value: any, args: ValidationArguments) {
          const obj = args.object as any;
          const grayscale = obj.grayscale;
          const sepia = obj.sepia;

          return (grayscale && !sepia) || (!grayscale && sepia);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Exactly one filter (grayscale or sepia must be enabled)';
        },
      },
    });
  };
}
