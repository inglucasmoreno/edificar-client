import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({
  name: 'fecha'
})

export class FechaPipe implements PipeTransform {
  transform(fecha: Date): string {
    return format(new Date(fecha), 'dd/MM/yyyy');
  }
}
