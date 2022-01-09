import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastService: ToastrService) { }

  show(title: string, text: string, type: string, options: IndividualConfig | undefined = undefined) {
    switch (type) {
      case 'success':
        return this.toastService.success(text, title, options)
      case 'warning':
        return this.toastService.warning(text, title, options)
      case 'info':
        return this.toastService.info(text, title, options)
      case 'error':
        return this.toastService.error(text, title, options)
      default:
        return this.toastService.success(text, title, options)
    }
  }
}
