import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subclass } from '../../../../services/interfaces';

@Component({
  selector: 'app-subclass',
  templateUrl: './subclass.component.html',
  styleUrls: ['./subclass.component.css']
})
export class SubclassComponent implements OnInit {

  constructor() { }

  @Input() subclass: Subclass;
  @Input() selected: boolean;

  ngOnInit(): void {
  }

}
