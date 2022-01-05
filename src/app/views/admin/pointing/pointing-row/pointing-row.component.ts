import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
	selector: '[app-pointing-row]',
	templateUrl: './pointing-row.component.html',
	styleUrls: ['./pointing-row.component.css']
})
export class PointingRowComponent implements OnInit, AfterViewInit {

	constructor() { }

	@Input() student: any;
  @Input() index: number;

	ngOnInit(): void {
	}

	ngAfterViewInit(): void {
		$("input:checkbox").change(function () {
			console.log("change")
			var ischecked = $(this).is(':checked');
			const id = $(this).attr("id");
			if (id != undefined) {
				const num = id.substring(1);
				if (ischecked) {
					if (id[0] == 'a') {
						$("#b" + num).prop('checked', true)
					}
					if (id[0] == 'c') {
						$("#b" + num).prop('checked', true)
					}
				}
				if (!ischecked) {
					if (id[0] == 'b') {
						$("#a" + num).prop('checked', false)
						$("#c" + num).prop('checked', false)
					}
				}
			}
		});
	}

	formatFullName(student: any) {
		return student.first_name + ' ' + student.last_name;
	}

}
