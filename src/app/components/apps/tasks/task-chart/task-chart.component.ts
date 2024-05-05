import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import {TasksService} from "../../../../shared/services/tasks.service";



@Component({
  selector: 'app-task-chart',
  templateUrl: './task-chart.component.html',
  styleUrls: ['./task-chart.component.scss']
})
export class TaskChartComponent implements AfterViewInit {

  constructor(private tasksService: TasksService) {}

  ngAfterViewInit(): void {
    this.createCharts();
  }

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
}
