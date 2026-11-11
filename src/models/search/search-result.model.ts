import { Article } from '../articles/article.model.dto';
import { MusicRelease } from '../music-release/music-release.models';
import { Track } from '../podcast/podcast.models';

export interface SearchResult {
  type: SearchResultType;

  id?: string;
  title: string;
  imageUrl: string;
  category: string;
  slug: string;

  item: Article | Track | MusicRelease;
}
export enum SearchResultType {
  Article = 'article',
  Podcast = 'podcast',
  Release = 'release',
}
