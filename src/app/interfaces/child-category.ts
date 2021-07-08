export interface ChildCategory {
    id: number,
    name: string,
    countChildren: number,
    parentCategoryId: number,
    isSelected: boolean
}