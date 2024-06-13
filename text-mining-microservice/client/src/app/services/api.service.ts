import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${environment.apiBaseUrl}/s3/upload`, formData);
  }

  // ${environment.apiBaseUrl}/mining - POST - for text mining

  textMining() {
    return this.http.post(`${environment.apiBaseUrl}/mining`, {});
  }
}
