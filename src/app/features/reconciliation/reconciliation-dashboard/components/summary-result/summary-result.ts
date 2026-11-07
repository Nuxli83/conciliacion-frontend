import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReconciliationSummary } from '../../../../../core/services/conciliation.service';

@Component({
  selector: 'app-summary-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-result.html',
  styleUrl: './summary-result.css',
})
export class SummaryResult {
  @Input() summary: ReconciliationSummary | null = null;
}
