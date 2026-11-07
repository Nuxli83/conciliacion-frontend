import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReconciliationHistory } from '../../../../../core/services/models/conciliation.model';

@Component({
  selector: 'app-history-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history-table.html',
  styleUrl: './history-table.css',
})
export class HistoryTable {
  @Input() historyList: ReconciliationHistory[] = [];
}
