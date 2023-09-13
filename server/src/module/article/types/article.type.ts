import { Article } from '../article.entity';

type CategoryLabelType = string;
type TagsType = string[];
type PartialArtcile = Partial<Article>;

export type InputArticleType = PartialArtcile & {
  category: CategoryLabelType;
  tags: TagsType;
};
