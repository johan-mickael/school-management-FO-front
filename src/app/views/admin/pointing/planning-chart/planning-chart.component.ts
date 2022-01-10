import { Component, Input, OnInit } from '@angular/core'
import { ResourceService } from '../../../../services/resource.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ErrorService } from '../../../../services/error.service'
import { ChartData, Planning } from '../../../../services/interfaces';
declare var Chart:any;

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
  readonly spinner = {
    name: "chart-spinner",
    type: "ball-grid-pulse"
  }



  @Input() planning: Planning
  subjectStatusData: any = []
  planningStatusData: any = []
  chartsBarHorizontalStackedReady: Promise<boolean>
  pieChartReady: Promise<boolean>

  view: any[] = [700, 400]

  // options
  showXAxis: boolean = true
  showYAxis: boolean = true
  gradient: boolean = false
  showLegend: boolean = true
  colorScheme = {
    domain: ['#5AA454', '#C7B42C', '#AAAAAA']
  }

  async ngOnInit() {
    await this.fetchApiData()

    const footer = (tooltipItems:any) => {
      var sum = 0;
      console.log(tooltipItems)

      tooltipItems.forEach((tooltipItem:any) => {
        tooltipItem.dataset.data.forEach((value:number) => {
          sum = (+sum + +value)
          console.log(sum)
        })
      });
      return 'Heures total: ' + sum + 'h';
    };

    var myChart = new Chart("subjectStatusChart", {
      type: 'pie',
      data: {
        labels: this.subjectStatusData.map((item:any) => item.name + ' ' + item.value + 'h'),
        datasets: [{
          label: '# of Votes',
          data: this.subjectStatusData.map((item:any) => item.value),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Répartition totale du cours: ' + this.planning.subject_name + ' - ' + this.planning.subclass_name
          },
          tooltip: {
            callbacks: {
              footer: footer
            }
          }
        }
      },
    });
  }


  async fetchApiData() {
    try {
      const data = await Promise.all([
        this.resourceService.getPromise(this.resourceService.findAll('charts/subject/remote/' + this.planning.subject_id)),
        this.resourceService.getPromise(this.resourceService.findAll('charts/subject/status/' + this.planning.subject_id))
      ])
      this.subjectStatusData = await data[0].map((item: any) => ({
        name: item.is_remote ? 'Distanciel' : 'Présentiel',
        value: item.hours
      } as ChartData))
      this.pieChartReady = Promise.resolve(true)
    } catch (error) {
      this.errorService.handleError(error, this.spinner.name)
    }
  }

}
