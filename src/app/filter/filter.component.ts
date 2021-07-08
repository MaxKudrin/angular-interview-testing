import { ChildCategory } from './../interfaces/child-category';
import { FilterService } from './../services/filter.service';
import { Component, OnInit } from '@angular/core';
import { DataProviderService } from '../services/data-provider.service';
import { Category } from '../interfaces/category';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  public buffer: Array<Category> = new Array<Category>();
  public categories: Array<Category> = new Array<Category>();
  public filtredCategories: Array<Category> = new Array<Category>();

  public isCategorySearch: boolean = false;
  public categorySearch: string = '';

  public selectedCategories: Array<Category> = new Array<Category>();

  public childCategories: Array<ChildCategory> = new Array<ChildCategory>();
  public searchTitleControl = new FormControl()

  public filteredOptions:Observable<Array<ChildCategory>> = new Observable<Array<ChildCategory>>()

  constructor(private filterService: FilterService, private dataProviderService: DataProviderService) {
    this.filterService.updateCategories()
    this.dataProviderService.categoryListObs().subscribe(list => {
      this.buffer = [...list];
      this.childCategories = this.buffer.filter(cat => cat.countChildren === 0).map(c => ({ ...c, isSelected: false }))
      this.categories = this.buffer.filter(cat => cat.countChildren !== 0).map(cat => {
        const children: Array<ChildCategory> = this.buffer.filter(c => c.parentCategoryId === cat.id).map(c => ({ ...c, isSelected: false }))
        return { ...cat, children }
      })
    });
  }

  handleCategorySearch(): void {
    const searchValue = this.categorySearch.trim()
    if (searchValue !== "") {
      this.isCategorySearch = true
      this.filtredCategories = this.categories.filter(cat=> cat.name.toLowerCase().includes(searchValue))
    }
    else if(searchValue === ""){
      this.filtredCategories = this.categories
      this.isCategorySearch = true
    }
    else {
      this.isCategorySearch = false
    }
  }
  handleCategoryBlur():void{
    this.isCategorySearch = false
    this.categorySearch = ""
  }
  handleSelectCatagory(isSelected: boolean, id: number): void {
    const cat: any = this.buffer.find(cat => cat.id === id)
    if (isSelected && cat) {
      this.selectedCategories.push(cat)
    }
    else {
      this.selectedCategories = this.selectedCategories.filter(cat => cat.id !== id)
      this.categories.filter(parentCat => {
        if (parentCat.id === cat.parentCategoryId && parentCat.children) {
          parentCat.children = parentCat.children.map(c => {
            if (c.id === id) {
              c.isSelected = false
            }
            return c
          })
        }
      })
    }
  }

  ngOnInit(): void {
    this.filteredOptions = this.searchTitleControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    )
  }
  private _filter(value: string): Array<ChildCategory> {
    const filterValue = value.toLowerCase();
    return this.childCategories.filter(option => option.name.toLowerCase().includes(filterValue))
  }
  displayFn(subject: any) {
    return subject ? subject.name : undefined
  }

}