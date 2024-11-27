import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumValue',
  standalone: true
})
export class EnumValuePipe implements PipeTransform {

  transform(value: any, enumeration: object): unknown {
    if(typeof(value) === 'string' && this.isInStringEnum(value, enumeration))
      return Object.keys(enumeration)[Object.values(enumeration).indexOf(value)];
    
    if(typeof(value) === 'number' && this.isInNumericEnum(value, enumeration))
      return Object.keys(enumeration)[Object.values(enumeration).indexOf(value)];
    
    return null;
  }

 isInNumericEnum(value: number, enumeration: any): boolean {
    return value in enumeration;
  }

  isInStringEnum(value: string, enumeration: any): boolean {
    return Object.values(enumeration).includes(value);
  }

}
