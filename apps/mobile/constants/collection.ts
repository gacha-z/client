export type CollectionCategory = 'BADGE' | 'ITEM';

export type CollectionFilterValue = 'ALL' | CollectionCategory;

export const COLLECTION_CATEGORY_LABELS: Record<CollectionCategory, string> = {
  BADGE: '배지',
  ITEM: '아이템'
};

export const COLLECTION_FILTERS: ReadonlyArray<{
  label: string;
  value: CollectionFilterValue;
}> = [
  { label: '전체', value: 'ALL' },
  { label: COLLECTION_CATEGORY_LABELS.BADGE, value: 'BADGE' },
  { label: COLLECTION_CATEGORY_LABELS.ITEM, value: 'ITEM' }
];
