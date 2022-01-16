import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class PageUtil {
  public scroll(id: string) {
    const el = document.getElementById(id)
    if (el)
      el.scrollIntoView({ behavior: 'smooth' });
  }
}
