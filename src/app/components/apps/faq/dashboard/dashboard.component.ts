import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { MentalHealthService } from '../../../../shared/services/mentalhealth.service';

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

  constructor(private mentalhealthservice: MentalHealthService) { }

  ngOnInit(): void {
    this.getHealthSummaries();
    this.getMoodDistribution(); // Appel pour récupérer les données de distribution des moods
  }

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
