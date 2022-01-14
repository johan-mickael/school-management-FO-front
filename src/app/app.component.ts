import { Component, OnInit } from '@angular/core';
import { PageUtils } from 'src/app/utils/pageUtils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'my estiam';

  constructor(
    public pageUtils: PageUtils
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

  topFunction() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

}
