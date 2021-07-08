import { ChildCategory } from './child-category';
export interface Category {
    id: number,
    name: string,
    countChildren: number,
    parentCategoryId: number,
    children?: Array<ChildCategory>,
}