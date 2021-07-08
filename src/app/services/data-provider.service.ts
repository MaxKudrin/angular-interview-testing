import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  private $categoryList: BehaviorSubject<Array<Category>> = new BehaviorSubject<Array<Category>>([])

  categoryListObs(): Observable<Array<Category>> {
    return this.$categoryList.asObservable();
  }
  appendCategoryListChunk(data: Array<Category>): void {
    if (!this.$categoryList.getValue().length) {
      this.$categoryList.next([...data]);
    } else {
      let tmp = [...this.$categoryList.getValue()];
      for (let elem of data) {
        if (!tmp.find(el => el.id === elem.id)) {
          tmp.push({ ...elem });
        }
      }
      this.$categoryList.next([...tmp]);
    }
  }
}
