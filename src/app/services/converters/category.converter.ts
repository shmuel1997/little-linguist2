import {
  DocumentReference,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  getDoc,
} from '@angular/fire/firestore';
import { Category } from '../../../shared/model/category';
import { TranslatedWord } from '../../../shared/model/translated-word';

export const categoryConverter = {
  toFirestore: (category: Category) => {
    return {
      lastUpdateDate:  Timestamp.fromDate(category.lastUpdateDate),
      name: category.name,
      origin: category.origin,
      target: category.target,
      words: category.words.map(word => ({
        origin: word.origin,
        target: word.target,
        guess: word.guess,
        status: word.status
      })),
      }
  },

  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);
    let c = new Category(
      snapshot.id,
      data['name'],
      data['origin'],
      data['target']
    );
    let words = data['words'];
    if (words) {
      for (let i = 0; i < words.length; ++i) {
        let w = new TranslatedWord(words[i].origin, words[i].target);
        w.guess = words[i].guess;
        w.status = words[i].status;
        c.words.push(w);
      }
    }
    c.lastUpdateDate = data['lastUpdateDate'].toDate();
    return c;
  },
};
