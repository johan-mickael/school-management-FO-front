import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  disconnect() {
    if(!confirm('Veuillez confirmer pour quitter.')) return
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    this.router.navigate(['./login'])
  }

}
