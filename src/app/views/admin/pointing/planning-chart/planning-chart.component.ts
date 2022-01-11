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
  inPlaceLabel: string = 'Présenciel'
  remoteLabel: string = 'Distanciel'
  subjectRemoteData: any = []
  subjectRemoteDataDone: any = []
  subjectRemoteDataNotDone: any = []
  chartsBarHorizontalStackedReady: Promise<boolean>
  pieChartReady: Promise<boolean>
  borderColorInPlace: string = '#D6E9C6'
  backgroundColorInPlace: string = '#D6E9C6'
  borderColorRemote: string = '#b0cce9'
  backgroundColorRemote: string = '#b0cce9'
  canvasHeight: number = 300

  async ngOnInit() {
    this.spinnerService.show('chart-spinner')
    await this.fetchApiData()
    this.spinnerService.hide('chart-spinner')
    this.initCharts()
  }

  async fetchApiData() {
    try {
      const data = await Promise.all([
        this.resourceService.getPromise(this.resourceService.findAll('charts/subject/remote/' + this.planning.subject_id)),
        this.resourceService.getPromise(this.resourceService.findAll('charts/subject/remote/' + this.planning.subject_id + '/0')),
        this.resourceService.getPromise(this.resourceService.findAll('charts/subject/remote/' + this.planning.subject_id + '/2')),
      ])
      this.subjectRemoteData = await data[0].map((item: any) => ({
        name: item.is_remote ? this.remoteLabel : this.inPlaceLabel,
        value: item.hours
      } as ChartData))
      this.subjectRemoteDataNotDone = await data[1].map((item: any) => ({
        name: item.is_remote ? this.remoteLabel : this.inPlaceLabel,
        value: item.hours
      } as ChartData))
      this.subjectRemoteDataDone = await data[2].map((item: any) => ({
        name: item.is_remote ? this.remoteLabel : this.inPlaceLabel,
        value: item.hours
      } as ChartData))
      this.pieChartReady = Promise.resolve(true)
    } catch (error) {
      this.errorService.handleError(error, "chart-spinner")
    }
  }

  initCharts() {
    this.initChart(this.subjectRemoteData, "subjectRemoteChart", "Répartition totale des cours")
    this.initChart(this.subjectRemoteDataNotDone, "subjectRemoteNotDoneChart", "Cours à venir")
    this.initChart(this.subjectRemoteDataDone, "subjectRemoteDoneChart", "Cours terminé")
    this.assiduityChart()
  }

  initChart(data: any, canvasId: string, title: string) {
    if (data.length < 1) {
      $('#' + canvasId).hide()
      return
    }
    const footer = (tooltipItems: any) => {
      var sum = 0
      tooltipItems.forEach((tooltipItem: any) => {
        tooltipItem.dataset.data.forEach((value: number) => {
          sum = (+sum + +value)
        })
      })
      return 'Heures total: ' + sum + 'h'
    }

    return new Chart(canvasId, {
      type: 'pie',
      data: {
        labels: data.map((item: any) => item.name + ' ' + item.value + 'h'),
        datasets: [{
          data: data.map((item: any) => item.value),
          backgroundColor: data.map((item: any) => {
            if (item.name == this.inPlaceLabel)
              return this.backgroundColorInPlace
            else return this.backgroundColorRemote
          }),
          borderColor: data.map((item: any) => {
            if (item.name == this.inPlaceLabel)
              return this.borderColorInPlace
            else return this.borderColorRemote
          }),
          borderWidth: 1
        }]
      },
      options: {
        // responsive: false,
        plugins: {
          title: {
            display: true,
            text: title
          },
          tooltip: {
            callbacks: {
              footer: footer
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
        labels: ['Risk Level'], datasets: [
          {
            label: 'Low',
            data: [67.8],
            backgroundColor: '#D6E9C6' // green
          },
          {
            label: 'Moderate',
            data: [20.7],
            backgroundColor: '#FAEBCC' // yellow
          },
          {
            label: 'High',
            data: [11.4],
            backgroundColor: '#EBCCD1' // red
          }
        ]
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      }
    })
  }

}
