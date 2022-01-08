import { Component, Input, OnInit } from '@angular/core';
import { Subclass } from '../../../../services/interfaces';

@Component({
  selector: 'app-subclasses',
  templateUrl: './subclasses.component.html',
  styleUrls: ['./subclasses.component.css']
})
export class SubclassesComponent implements OnInit {

  constructor() { }

  @Input() subclass: Subclass;

  ngOnInit(): void {
  }

}
