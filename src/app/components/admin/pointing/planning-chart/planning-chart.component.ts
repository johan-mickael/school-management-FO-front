import { Component, Input, OnInit } from '@angular/core'
import { ResourceService } from '../../../../services/resource.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ErrorService } from '../../../../services/error.service'
import { ChartData, Planning } from '../../../../services/interfaces'
declare var Chart: any

@Component({
	selector: 'app-planning-chart',
	templateUrl: './planning-chart.component.html',
	styleUrls: ['./planning-chart.component.css']
})
export class PlanningChartComponent implements OnInit {

	constructor(
		private resourceService: ResourceService,
		private spinnerService: NgxSpinnerService,
		private errorService: ErrorService,
	) { }

	@Input() planning: Planning
	@Input() students: any
	inPlaceLabel: string = 'Présentiel'
	remoteLabel: string = 'Distanciel'
	presentLabel: string = 'Assisté'
	absentLabel: string = 'Non assisté'
	remainingLabel: string = 'Heures restantes'
	assiduityStack: string = 'sf1e8tvyd32798g1ervdfg56r8546d'
	placeStack: string = 'au87513d8fef98g1ervdfg56r8546d'
	subjectRemoteData: ChartData[] = []
	subjectRemoteDataDone: ChartData[]
	subjectRemoteDataNotDone: ChartData[]
	totalHours: number
	studentAssiduity: any
	chartsBarHorizontalStackedReady: Promise<boolean>
	pieChartReady: Promise<boolean>
	backgroundColorInPlace: string = '#b38aff'
	backgroundColorRemote: string = '#ffd65a'
	canvasHeight: number = 300
	barThickness: number = 40

	async ngOnInit() {
		this.spinnerService.show('chart-spinner')
		await this.fetchApiData()
		await this.initCharts()
		this.spinnerService.hide('chart-spinner')
	}

	async fetchApiData() {
		try {
			const data = await Promise.all([
				this.resourceService.getPromise(this.resourceService.findAll('charts/students/assisting/' + this.planning.subject_id + '/' + this.planning.schoolyear_id)),
				this.resourceService.getPromise(this.resourceService.findAll('subjects/charts/' + this.planning.subject_id + '/' + this.planning.schoolyear_id)),
			])
			this.studentAssiduity = await data[0]
			console.log(data[1])
			this.chartsBarHorizontalStackedReady = Promise.resolve(true)
			this.setSubjectHourRepartition(data[1])
			this.setSubjectRemainingHour(data[1])
			this.setSubjectFinishedHour(data[1])
			this.pieChartReady = Promise.resolve(true)
		} catch (error) {
			this.errorService.handleError(error, "chart-spinner")
		}
	}

	setSubjectHourRepartition(data: any) {
		const chartGroupedByType = new Map<number, number>()
		for (const { is_remote, hours } of data)
			chartGroupedByType.set(is_remote, (chartGroupedByType.get(is_remote) || 0) + +hours);

		[...chartGroupedByType].forEach((item: any) => {
			this.subjectRemoteData.push({
				name: item[0] ? this.remoteLabel : this.inPlaceLabel,
				value: item[1]
			} as ChartData)
		})
		this.totalHours = this.getTotalHour(this.subjectRemoteData)
	}

	setSubjectRemainingHour(data: any) {
		this.subjectRemoteDataNotDone = data.filter((item: any) => item.status < 2).map((item: any) => ({
			name: item.is_remote ? this.remoteLabel : this.inPlaceLabel,
			value: item.hours
		} as ChartData))
		this.subjectRemoteDataNotDone.push({
			name: 'Terminé',
			value: this.totalHours - this.getTotalHour(this.subjectRemoteDataNotDone)
		})
	}

	setSubjectFinishedHour(data: any) {
		this.subjectRemoteDataDone = data.filter((item: any) => item.status === 2).map((item: any) => ({
			name: item.is_remote ? this.remoteLabel : this.inPlaceLabel,
			value: item.hours
		} as ChartData))
		this.subjectRemoteDataDone.push({
			name: 'A venir',
			value: this.totalHours - this.subjectRemoteDataDone.reduce((sum, current) => +sum + +current.value, 0)
		})
	}

	getTotalHour(data: ChartData[]) {
		return data.reduce((sum, current) => +sum + +current.value, 0)
	}

	async initCharts() {
		await this.assiduityChart()
		this.initPieChart(this.subjectRemoteData, "subjectRemoteChart", "Répartition totale des cours")
		this.initPieChart(this.subjectRemoteDataNotDone, "subjectRemoteNotDoneChart", "Cours à venir")
		this.initPieChart(this.subjectRemoteDataDone, "subjectRemoteDoneChart", "Cours terminé")
	}

	async initPieChart(data: any, canvasId: string, title: string) {
		if (data.length < 1) {
			$('#' + canvasId).hide()
			return
		}

		return new Chart(canvasId, {
			type: 'doughnut',
			data: {
				labels: data.map((item: any) => item.name),
				datasets: [{
					data: data.map((item: any) => item.value),
					backgroundColor: data.map((item: any) => {
						if (item.name == this.inPlaceLabel)
							return this.backgroundColorInPlace
						else if (item.name == this.remoteLabel)
							return this.backgroundColorRemote
						else return '#cbcbcb'
					}),
					borderColor: 'white',
					borderWidth: 1
				}]
			},
			options: {
				plugins: {
					title: {
						display: true,
						text: title
					},
					tooltip: {
						callbacks: {
							label: function (tooltipItem: any, data: any) {
								return ' ' + tooltipItem.parsed + 'h ' + (tooltipItem.label as string).toLowerCase()
							}
						}
					}
				}
			},
		})
	}

	assiduityChart() {
		return new Chart("assiduityChart", {
			type: 'bar',
			data: {
				labels: this.studentAssiduity.map((assiduity: any) => {
					const student = this.students.filter((student: any) => {
						if (student.student_id == assiduity.student_id)
							return student
					})[0]
					return (student.first_name as string).charAt(0).toUpperCase() + (student.first_name as string).slice(1)
				}),
				datasets: [
					{
						label: this.presentLabel,
						data: this.studentAssiduity.map((assiduity: any) => assiduity.assisting_duration),
						backgroundColor: '#79cf70',
						stack: this.assiduityStack,
					},
					{
						label: this.absentLabel,
						data: this.studentAssiduity.map((assiduity: any) => assiduity.non_assisting_duration),
						backgroundColor: '#ff5f6e',
						stack: this.assiduityStack,
					},
					{
						label: this.remainingLabel,
						data: this.studentAssiduity.map((assiduity: any) => {
							return this.totalHours - (+assiduity.assisting_duration + +assiduity.non_assisting_duration)
						}),
						backgroundColor: '#e3e3e3',
						stack: this.assiduityStack,
					},
					{
						label: this.inPlaceLabel,
						data: this.studentAssiduity.map((assiduity: any) => assiduity.assisting_duration_class),
						backgroundColor: this.backgroundColorInPlace,
						stack: this.placeStack,
					},
					{
						label: this.remoteLabel,
						data: this.studentAssiduity.map((assiduity: any) => assiduity.assisting_duration_remote),
						backgroundColor: this.backgroundColorRemote,
						stack: this.placeStack,
					}
				]
			},
			options: {
				indexAxis: 'y',
				scales: {
					y: {
						ticks: {
							autoSkip: false
						},

					}
				}
			}
		})
	}

}
