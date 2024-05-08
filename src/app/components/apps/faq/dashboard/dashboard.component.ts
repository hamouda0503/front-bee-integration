import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { MentalHealthService } from '../../../../shared/services/mentalhealth.service';
import {TasksService} from "../../../../shared/services/tasks.service";
import {Chart} from "chart.js/auto";

export interface HealthSummary {
  date: Date;
  totalEnergyLevel: number;
  totalStressLevel: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  chartType: ChartType = 'line';
  healthSummaries: HealthSummary[];
  stressChartData: any[];
  energyChartData: any[];
  moodData: any;

  constructor(private mentalhealthservice: MentalHealthService,private tasksService: TasksService) { }

  ngAfterViewInit(): void {
    this.createCharts();
  }
  ngOnInit(): void {




    this.getHealthSummaries();
    this.getMoodDistribution(); // Appel pour récupérer les données de distribution des moods
  }
//chaima
  createCharts(): void {
    this.createTasksStatusChart();
    this.createTaskEvaluationChart();
    this.createWorkEvolutionChart();
    this.createDeadlineRespectChart();
  }

  createTasksStatusChart(): void {
    this.tasksService.getTasksStatusData().subscribe(data => {
      const statuses = Object.keys(data);
      const counts = Object.values(data);

      const ctx = document.getElementById('tasksStatusChart') as HTMLCanvasElement;
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: statuses,
          datasets: [{
            label: 'Tasks Count',
            data: counts,
            backgroundColor: 'rgba(255, 99, 132, 0.5)' // Rouge
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1 // Incrémente par 1
              }
            }
          },
          responsive: true
        }
      });
    });
  }

  createTaskEvaluationChart(): void {
    const ctx = document.getElementById('taskEvaluationChart') as HTMLCanvasElement;

    this.tasksService.getTaskEvaluationData().subscribe(data => {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Successfully Evaluated', 'Needs Review'],
          datasets: [
            {
              label: 'Task Evaluation',
              data: data,
              backgroundColor: ['rgba(255, 193, 7, 0.5)', 'rgba(255, 99, 132, 0.5)'] // Jaune et rouge
            }
          ]
        },
        options: {
          responsive: true
        }
      });
    });
  }

  createWorkEvolutionChart(): void {
    this.tasksService.getEstimatedWorkDataByWeek().subscribe(estimatedData => {
      this.tasksService.getActualWorkDataByWeek().subscribe(actualData => {
        const weeks = Object.keys(actualData);
        const actualWork = Object.values(actualData);
        const estimatedWork = Object.values(estimatedData);

        const ctx = document.getElementById('workEvolutionChart') as HTMLCanvasElement;
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: weeks,
            datasets: [
              {
                label: 'Actual Work',
                data: actualWork,
                borderColor: 'rgba(255, 99, 132, 0.5)', // Rouge
                fill: false
              },
              {
                label: 'Estimated Work',
                data: estimatedWork,
                borderColor: 'rgba(255, 193, 7, 0.5)', // Jaune
                fill: false
              }
            ]
          },
          options: {
            responsive: true
          }
        });
      });
    });
  }

  createDeadlineRespectChart(): void {
    this.tasksService.getDeadlineRespectData().subscribe(data => {
      const ctx = document.getElementById('deadlineRespectChart') as HTMLCanvasElement;
      new Chart(ctx, {
        type: 'bar', // Changement du type en 'bar'
        data: {
          labels: ['On Time', 'Delayed'],
          datasets: [{
            label: 'Deadline Respect',
            data: [data['On Time'], data['Delayed']],
            backgroundColor: [
              'rgba(255, 193, 7, 0.5)', // Jaune
              'rgba(255, 99, 132, 0.5)' // Rouge
            ]
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1 // Incrémente par 1
              }
            }
          },
          responsive: true
        }
      });
    });
  }
  //end chaima
  getHealthSummaries(): void {
    this.mentalhealthservice.getHealthSummaries()
      .subscribe(summaries => {
        this.healthSummaries = summaries;
        this.prepareChartData();
      });
  }

  prepareChartData(): void {
    this.stressChartData = this.healthSummaries.map(summary => ({
      x: summary.date,
      y: summary.totalStressLevel
    }));

    this.energyChartData = this.healthSummaries.map(summary => ({
      x: summary.date,
      y: summary.totalEnergyLevel
    }));
  }

  getMoodDistribution(): void {
    this.mentalhealthservice.getMoodDistribution()
      .subscribe(data => {
        this.moodData = {
          labels: Object.keys(data),
          datasets: [{
            data: Object.values(data),
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#007bff',
              '#28a745'
            ]
          }]
        };
      });
  }
}
