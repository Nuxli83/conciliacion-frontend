import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MonthlyMetrics, PendingConciliationData, ReconciliationHistory } from './models/conciliation.model';

export interface SuggestionDto {
  reconciliationId: number;
  confidenceScore: number;
  bankDate: string;
  amount: number;
  bankDescription: string;
  invoiceRfc: string;
  invoiceDate: string;
}


export interface ReconciliationSummary {
  totalBankTransactions: number;
  totalInvoices: number;
  successfullyMatched: number;
  pendingTransactions: number;
  pendingInvoices: number;
  totalAmountMatched: number;
  warnings: string[];
}


@Injectable({
  providedIn: 'root',
})

export class ConciliationService {
  // Ajusta el puerto al que usa tu API en desarrollo
  //private apiUrl = 'https://localhost:7232/api/Conciliation'; 
private apiUrl = `${environment.apiUrl}/Conciliation`;
  constructor(private http: HttpClient) {}

  getSuggestions(tenantId: number): Observable<SuggestionDto[]> {
    return this.http.get<SuggestionDto[]>(`${this.apiUrl}/suggestions/${tenantId}`);
  }

  approveSuggestion(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/approve/${id}`, {});
  }

  rejectSuggestion(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reject/${id}`, {});
  }

  processReconciliation(request: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/process`, request);
  }

  getPendingItems(): Observable<PendingConciliationData> {
    return this.http.get<PendingConciliationData>(`${this.apiUrl}/pending`);
  }

  getMonthlyMetrics(): Observable<MonthlyMetrics> {
    return this.http.get<MonthlyMetrics>(`${this.apiUrl}/monthly-metrics`);
  }

  getHistory(): Observable<ReconciliationHistory[]> {
    return this.http.get<ReconciliationHistory[]>(`${this.apiUrl}/history`);
  }
}

