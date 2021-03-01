import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rol'
})
export class RolPipe implements PipeTransform {

  transform(role: string): string {
    switch (role) {
      case 'ADMIN_ROLE':
        return 'Admin'
      case 'USER_ROLE':
        return 'Consulta'    
      default:
        break;
    }
    return ;
  }

}
