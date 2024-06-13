import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { SkeletonModule } from 'primeng/skeleton';

interface IUploadedFile {
  name: string;
  size: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FileUploadModule, ButtonModule, BadgeModule, ProgressBarModule, ToastModule, HttpClientModule, CommonModule, SkeletonModule],
  providers: [MessageService],
  animations: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';

  files = [];

  totalSize: number = 0;

  isMiningLoading: boolean = false;

  minningResult: string | null = null;

  uploadedFile: IUploadedFile | null = null;

  miningError: string | null = null;

  constructor(private config: PrimeNGConfig, private messageService: MessageService, public _apiService: ApiService) {}

  choose(event: any, callback?: any) {
    callback();
  }

  onRemoveTemplatingFile(event: any, file: any, removeFileCallback: any, index: any) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
  }

  onClearTemplatingUpload(clear: any) {
    clear();
    this.totalSize = 0;
  }

  onTemplatedUpload() {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
  }

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
    this.files.forEach((file: any) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });
  }

  uploadEvent(callback: any) {
    // this.uploadedFile = this.files[0];

    this._apiService.uploadFile(this.files[0]).subscribe({
      next: (response: any) => {
        console.log(response);
        this.uploadedFile = this.files[0];
        this.isMiningLoading = true;
        // this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', key: 'br', life: 3000 });
        callback();
      },
      error: (error: any) => {
        console.log(error);
        // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'File Upload Failed', key: 'br', life: 3000 });
      }
    });

    this._apiService.textMining().subscribe({
      next: (response: any) => {
        console.log(response);
        this.isMiningLoading = false;
        this.minningResult = response.response;
        // this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Text Mining Completed', key: 'br', life: 3000 });
      },
      error: (error: any) => {
        console.log(error);
        this.isMiningLoading = false;
        // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Text Mining Failed', key: 'br', life: 3000 });
      }
    });
  }

  formatSize(bytes: any) {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes as any;
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  }
}
