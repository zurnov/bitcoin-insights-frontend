import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  showError(message: string, title: string = '[Error]') {
    this.toastr.error(message, title, {
      positionClass: 'toast-err',
    });
  }

  showWarning(message: string, title: string = '[Warning]') {
    this.toastr.warning(message, title, {
      positionClass: 'toast-warn',
    });
  }
}
