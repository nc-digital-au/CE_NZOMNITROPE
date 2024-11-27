import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyValueInt',
  standalone: true
})
export class KeyValueIntPipe implements PipeTransform {

  transform(obj: object): any {
    return Object.entries(obj).
      filter(([key, value]) =>
        !/^\d+$/.test(key) ||         // Include keys that don't look like integers or...
        !obj.hasOwnProperty(value)).  // ...include keys whose values do not appear as keys also.
      map(([key, value]) => ({key, value}));
  }

}
