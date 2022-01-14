import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class PageUtils {
  public scroll(id: string) {
    const el = document.getElementById("students")
    if (el)
      el.scrollIntoView({ behavior: 'smooth' });
  }
}
