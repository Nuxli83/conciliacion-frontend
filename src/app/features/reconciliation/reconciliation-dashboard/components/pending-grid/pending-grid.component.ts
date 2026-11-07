import { Component, Input } from '@angular/core';
import { PendingConciliationData } from '../../../../../core/services/models/conciliation.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pending-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-grid.component.html',
  styleUrl: './pending-grid.component.css',
})
export class PendingGridComponent {
  @Input() pendingData: PendingConciliationData | null = null;
}
