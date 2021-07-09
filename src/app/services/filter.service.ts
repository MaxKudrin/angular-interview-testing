import { CategoryList } from './../interfaces/category-list';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataProviderService } from './data-provider.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private apiUrl: string = environment.apiUrl

  constructor(private http: HttpClient, private dataProviderService: DataProviderService,) {
  }

  updateCategories(): void {
    try {
      this.http.get<CategoryList>(this.apiUrl).subscribe(
        (data) => {
          this.dataProviderService.appendCategoryListChunk(data.items);
        }
      )
    } catch (error) {
      console.log(error)
    }
  }
}
