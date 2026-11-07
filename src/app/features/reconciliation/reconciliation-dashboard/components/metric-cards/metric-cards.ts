import { Component, Input } from '@angular/core';
import { MonthlyMetrics } from '../../../../../core/services/models/conciliation.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metric-cards.html',
  styleUrl: './metric-cards.css',
})
export class MetricCards {
  @Input() metrics: MonthlyMetrics | null = null;
}
