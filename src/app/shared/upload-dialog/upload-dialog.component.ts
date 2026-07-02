import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-upload-dialog',
    imports: [],
    templateUrl: './upload-dialog.component.html',
    styleUrl: './upload-dialog.component.css'
})
export class UploadDialogComponent {
  @Output() close = new EventEmitter<void>();
  @Output() continue = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onContinue(): void {
    this.continue.emit();
  }
}
