import { Component, OnInit } from '@angular/core';
import { PageUtil } from './utils/page.util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'my estiam';

  constructor(
    public pageUtil: PageUtil
  ) {}

  ngOnInit(): void {
    const mybutton = document.getElementById("myBtn");

    if (mybutton) {
      window.onscroll = function () {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          mybutton.style.display = "block";
        } else {
          mybutton.style.display = "none";
        }
      };
    }
  }

}
