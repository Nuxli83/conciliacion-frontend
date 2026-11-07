import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentUploadService {
  //private apiUrl = 'https://localhost:7232/api/BankStatement'; // Ajusta a tu endpoint real
private apiUrl = `${environment.apiUrl}/Conciliation`;
  constructor(private http: HttpClient) {}

  uploadFiles(bankFiles: File[], invoiceFiles: File[]): Observable<any> {
    const formData = new FormData();
    
    // Agregamos los múltiples PDFs de los bancos
    bankFiles.forEach(file => {
      formData.append('bankFiles', file, file.name);
    });
    
    // Agregamos los XML/ZIP de las facturas
    invoiceFiles.forEach(file => {
      formData.append('invoicesFiles', file, file.name);
    });
  
    // Enviar el multipart/form-data al backend
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
}
