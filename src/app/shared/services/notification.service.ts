import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  success(title: string, message: string) {
    Swal.fire(title, message, 'success');
  }

  error(title: string, message: string) {
    Swal.fire(title, message, 'error');
  }

  warning(title: string, message: string) {
    Swal.fire(title, message, 'warning');
  }

  info(title: string, message: string) {
    Swal.fire(title, message, 'info');
  }
}
