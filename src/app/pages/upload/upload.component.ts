import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-upload',
    imports: [CommonModule, FormsModule],
    templateUrl: './upload.component.html',
    styleUrl: './upload.component.css'
})
export class UploadComponent {
  selectedFile: File | null = null;

  description = '';

  dragging = false;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.dragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.dragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.dragging = false;

    const files = event.dataTransfer?.files;

    if (!files?.length) {
      return;
    }

    this.setFile(files[0]);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.setFile(input.files[0]);
  }

  private setFile(file: File): void {
    if (
      file.type !== 'audio/mpeg' &&
      !file.name.toLowerCase().endsWith('.mp3')
    ) {
      alert('Please upload an MP3 file.');
      return;
    }

    const maxSize = 500 * 1024 * 1024; // 500MB

    if (file.size > maxSize) {
      alert('Maximum file size is 500MB.');
      return;
    }

    this.selectedFile = file;
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  continue(): void {
    if (!this.selectedFile) {
      return;
    }

    console.log(this.selectedFile);
    console.log(this.description);

    // Call your upload API here
  }
}
