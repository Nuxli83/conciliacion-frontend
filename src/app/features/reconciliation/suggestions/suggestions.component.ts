import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConciliationService, SuggestionDto } from '../../../core/services/conciliation.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-suggestions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.css',
})
export class SuggestionsComponent implements OnInit {
  suggestions: SuggestionDto[] = [];
  isLoading = false;
  tenantId = 1; // Aquí inyectarás el TenantId del usuario logueado

  constructor(private conciliationService: ConciliationService) {}

  ngOnInit(): void {
    this.loadSuggestions();
  }

  loadSuggestions(): void {
    this.isLoading = true;
    this.conciliationService.getSuggestions(this.tenantId).subscribe({
      next: (data) => {
        this.suggestions = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar la bandeja', err);
        this.isLoading = false;
      }
    });
  }

  onApprove(id: number): void {
    this.conciliationService.approveSuggestion(id).subscribe({
      next: () => {
        this.suggestions = this.suggestions.filter(s => s.reconciliationId !== id);
      },
      error: (err) => console.error('Error al aprobar', err)
    });
  }

  onReject(id: number): void {
    if (confirm('¿Liberar estos registros para evaluación manual?')) {
      this.conciliationService.rejectSuggestion(id).subscribe({
        next: () => {
          this.suggestions = this.suggestions.filter(s => s.reconciliationId !== id);
        },
        error: (err) => console.error('Error al rechazar', err)
      });
    }
  }

  getScoreClass(score: number): string {
    return score >= 0.85 ? 'badge-high' : 'badge-medium';
  }


  exportToExcel(data: any[], fileName: string): void {

    console.log('Exportando a Excel:', data);
    const datosFormateados = data.map(item => ({
      'Concepto movimiento': item.bankDescription,
      'RFC Factura': item.invoiceRfc,
      'Monto': item.amount, // <--- Enviamos el número puro para que Excel lo sume
      'Fecha movimiento': new Date(item.bankDate), // <--- Objeto Date real
      'Fecha factura': new Date(item.invoiceDate)
    }));
    
    // 2. Agregamos una fila de "Total" al final
    const totalConciliado = data.reduce((sum, item) => sum + item.amount, 0);
    
    datosFormateados.push({
      'Concepto movimiento': 'TOTAL CONCILIADO',
      'RFC Factura': '',
      'Monto': totalConciliado,
      'Fecha movimiento': new Date(),
      'Fecha factura': new Date()
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosFormateados);

    // Ajuste elegante: Formato de moneda para la columna C (Monto)
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cellAddress = XLSX.utils.encode_cell({c: 2, r: R}); // Columna C es índice 2
      if (!ws[cellAddress]) continue;
      
      // Aplicamos formato numérico contable a la celda
      ws[cellAddress].z = '$#,##0.00'; 
    }
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Conciliacion');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  formatDate(dateInput: any): string {
    if (!dateInput) return ''; // Maneja valores nulos
    
    const date = new Date(dateInput);
    
    // Validamos que sea una fecha válida
    if (isNaN(date.getTime())) return String(dateInput);
  
    // Formato DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0-11
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  }
}
