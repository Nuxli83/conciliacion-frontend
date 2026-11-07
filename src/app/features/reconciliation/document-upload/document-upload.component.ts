import { Component, ElementRef, ViewChild } from '@angular/core';
import { DocumentUploadService } from '../../../core/services/document-upload.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-upload.component.html',
  styleUrl: './document-upload.component.css',
})
export class DocumentUploadComponent {
  bankFiles: File[] = [];
  invoiceFiles: File[] = [];
  isUploading = false;
  uploadSuccess = false;

  @ViewChild('bankInput') bankInput!: ElementRef<HTMLInputElement>;
  @ViewChild('invoicesInput') invoicesInput!: ElementRef<HTMLInputElement>;

  constructor(private uploadService: DocumentUploadService) {}

  onBankFileSelected(event: any): void {
    const files: FileList = event.target.files;
  if (files) {
    // Convierte el FileList en un arreglo de File y lo asigna
    this.bankFiles = Array.from(files);
  }
  }

  onInvoiceFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.invoiceFiles = Array.from(input.files);
    }
  }

  removeBankFile(index: number): void {
    // Elimina 1 elemento en la posición 'index'
    this.bankFiles.splice(index, 1);
  }

  onBankFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files) {
      // Convierte el FileList que nos da el navegador en un arreglo de File
      this.bankFiles = Array.from(files);
    }
  }

  removeInvoiceFile(index: number): void {
    this.invoiceFiles.splice(index, 1);
    if (this.invoiceFiles.length === 0) {
      this.invoicesInput.nativeElement.value = '';
    }
  }

  onSubmit(): void {
    if (!this.bankFiles || this.invoiceFiles.length === 0) return;

    this.isUploading = true;
    this.uploadSuccess = false;

    this.uploadService.uploadFiles(this.bankFiles, this.invoiceFiles).subscribe({
      next: (response:any) => {
        console.log('Respuesta del servidor:', response);
        this.isUploading = false;
        this.uploadSuccess = true;
        this.resetForm();
      },
      error: (err) => {
        console.error('Error durante la carga:', err);
        this.isUploading = false;
        alert('Ocurrió un error al procesar los documentos.');
      }
    });
  }

  private resetForm(): void {
    this.bankFiles = [];
    this.invoiceFiles = [];
    this.bankInput.nativeElement.value = '';
    this.invoicesInput.nativeElement.value = '';
  }
}
