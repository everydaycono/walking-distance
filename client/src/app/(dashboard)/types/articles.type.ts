export interface IArticle {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  status: string;
  views: number;
  likes: number;
  isRecommended: boolean;
  createAt: string;
  updateAt: string;
  category: Category;
  tags: Tag[];
  user: User;
}

export interface Category {
  id: string;
  label: string;
  createAt: string;
  updateAt: string;
}

export interface Tag {
  id: string;
  label: string;
  createAt: string;
  updateAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar: any;
  email: string;
}
