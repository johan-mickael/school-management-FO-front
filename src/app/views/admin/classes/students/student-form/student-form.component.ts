import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() student: any
  @Input() studentHours: any
  loadingCount: number

  ngOnInit(): void {
    console.log(this.studentHours)
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadingCount++
    if (this.loadingCount == 1) return
  }

}
