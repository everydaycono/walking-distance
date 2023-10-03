export interface CreateArticleType {
  title: string;
  content: string;
  category: string;
  status: 'publish' | 'draft' | 'onlyme';
  thumbnail?: string;
  tags?: string[];
}

export interface CategoryType {
  id: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}
