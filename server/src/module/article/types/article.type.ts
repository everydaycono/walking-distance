import { Article } from '../article.entity';

type CategoryLabelType = string;
type PartialArtcile = Partial<Article>;

export type CustomArticleType = PartialArtcile & {
  category: CategoryLabelType;
};
