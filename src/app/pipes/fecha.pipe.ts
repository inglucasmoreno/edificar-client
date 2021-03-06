import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'fecha'
})

export class FechaPipe implements PipeTransform {
  transform(fecha: Date): string {
    return moment(fecha).format('DD/MM/YYYY');
  }
}
