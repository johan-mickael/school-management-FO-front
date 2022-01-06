import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'concatPipe'})
export class ConcatPipe implements PipeTransform {
  transform(value: any[]): any {
    var res = ''
    value.forEach(element => {
      res += element + ' '
    });
    return res;
  }
}
