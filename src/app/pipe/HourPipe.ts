import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'HourPipe' })
export class HourPipe implements PipeTransform {
  transform(value: number): any {
    let second = value * 3600
    let date = new Date(second * 1000).toISOString()
    console.log(date)
    if (second < 3600)
      return date.substr(14, 2) + ' mn';
    return date.substr(11, 5) + ' h';
  }
}
