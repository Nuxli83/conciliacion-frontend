import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MetricCards } from './components/metric-cards/metric-cards';
import { ProcessAction } from './components/process-action/process-action';
import { SummaryResult } from './components/summary-result/summary-result';
import { HistoryTable } from './components/history-table/history-table';
import { MonthlyMetrics, PendingConciliationData, ReconciliationHistory, ReconciliationSummary } from '../../../core/services/models/conciliation.model';
import { ConciliationService } from '../../../core/services/conciliation.service';
import { forkJoin } from 'rxjs';
import { PendingGridComponent } from './components/pending-grid/pending-grid.component';

@Component({
  selector: 'app-reconciliation-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MetricCards,
    ProcessAction,
    SummaryResult,
    HistoryTable,
    PendingGridComponent
  ],
  templateUrl: './reconciliation-dashboard.component.html',
  styleUrl: './reconciliation-dashboard.component.css',
})
export class ReconciliationDashboardComponent implements OnInit {
  metrics: MonthlyMetrics | null = null;
  history: ReconciliationHistory[] = [];
  lastSummary: ReconciliationSummary | null = null;
  pendingData: PendingConciliationData | null = null;

  isLoading = true;
  isProcessing = false;
  successMessage = '';
  errorMessage = '';

  constructor(private conciliationService: ConciliationService) {}

  ngOnInit(): void {
    this.fetchDashboardData();
    this.isLoading = false;
  }

  fetchDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    forkJoin({
      metricsData: this.conciliationService.getMonthlyMetrics(),
      historyData: this.conciliationService.getHistory(),
      pendingItems: this.conciliationService.getPendingItems()
    }).subscribe({
      next: (result) => {
        // Asignamos las respuestas a nuestras variables locales
        this.metrics = result.metricsData;
        this.history = result.historyData;
        this.pendingData = result.pendingItems;
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando el dashboard:', err);
        this.errorMessage = 'Hubo un problema al cargar los datos del servidor.';
        this.isLoading = false;
      }
    });
  }

  onProcessReconciliation(): void {
    this.isProcessing = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request: any = {
      tenantId: 1 
    };

    this.conciliationService.processReconciliation(request).subscribe({
      next: (summary) => {
        this.lastSummary = summary;
        console.log('Resumen de conciliación recibido:', summary);
        this.successMessage = '¡Cruce de información finalizado con éxito!';
        this.isProcessing = false;
        //this.fetchDashboardData(); // Recarga métricas e historial
      },
      error: () => {
        this.errorMessage = 'Ocurrió un error en el motor de conciliación.';
        this.isProcessing = false;
      }
    });
  }

  private showError(msg: string) {
    this.errorMessage = msg;
    this.isLoading = false;
  }

}
