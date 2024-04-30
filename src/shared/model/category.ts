import { Language } from './language';
import { TranslatedWord } from './translated-word';

export class Category {
  lastUpdateDate = new Date();
  words: TranslatedWord[] = [];

  constructor(
    public id: number,
    public name: string,
    public origin: Language,
    public target: Language
  ) {}
}
