import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-content',
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.css']
})
export class AdminContentComponent implements OnInit {

  constructor() { }

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
