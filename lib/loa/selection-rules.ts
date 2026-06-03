export type SelectionRule = 'one' | 'multiple'

export interface CategorySelectionState {
  categoryId: string
  categoryName: string
  rule: SelectionRule
  selectedItemIds: string[]
}

export interface SelectionValidationError {
  categoryId: string
  message: string
}

export function validateCategorySelections(
  categories: CategorySelectionState[]
): SelectionValidationError[] {
  const errors: SelectionValidationError[] = []
  for (const cat of categories) {
    const n = cat.selectedItemIds.length
    if (cat.rule === 'one' && n !== 1) {
      errors.push({ categoryId: cat.categoryId, message: `${cat.categoryName}: pilih tepat 1` })
    }
    if (cat.rule === 'multiple' && n < 1) {
      errors.push({ categoryId: cat.categoryId, message: `${cat.categoryName}: pilih minimal 1` })
    }
  }
  return errors
}
