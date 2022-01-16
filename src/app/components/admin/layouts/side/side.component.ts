import { Component, OnInit, AfterViewInit } from '@angular/core'
import * as $ from 'jquery'

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})
export class SideComponent implements OnInit, AfterViewInit {

  constructor() { }

  username: string
  isExtended: boolean = true
  readonly largeLogo: string = "/assets/img/logo/logo-orange-250.png"
  readonly tinyLogo: string = "/assets/img/logo/logo-tiny-orange-250.png"

  ngOnInit(): void {
    this.username = localStorage.getItem('user') as string
  }

  ngAfterViewInit(): void {

    function changeLogo(image: string) {
      $("#nav-logo").fadeTo(100, .3, function () {
        $("#nav-logo").attr('src', image)
      }).fadeTo(300, 1)
    }

    $("#hamburger").click(() => {
      this.isExtended = !this.isExtended
      var image = this.largeLogo
      if (!$("body").hasClass("sidebar-collapse")) {
        image = this.tinyLogo
      }
      changeLogo(image)
    })

    $("aside").hover(() => {
      if (!this.isExtended) {
        var image = this.largeLogo
        changeLogo(image)
      }
    }, () => {
      if (!this.isExtended) {
        var image = this.tinyLogo
        changeLogo(image)
      }
    }
    )
  }

}
