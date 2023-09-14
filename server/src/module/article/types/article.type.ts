import { Article } from '../article.entity';

type CategoryLabelType = string;
type TagsType = string[];
type PartialArticle = Partial<Article>;

export type InputArticleType = PartialArticle & {
  category: CategoryLabelType;
  tags: TagsType;
};
