import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-process-action',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './process-action.html',
  styleUrl: './process-action.css',
})
export class ProcessAction {
  @Input() isProcessing = false;
  @Output() startReconciliation = new EventEmitter<void>();

  onExecute() {
    this.startReconciliation.emit();
  }
}
