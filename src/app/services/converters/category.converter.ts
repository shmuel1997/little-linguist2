import { QueryDocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";
import { Category } from "../../../shared/model/category";

export const categoryConverter = {
    toFirestore: (category: Category) => {
      return {
        id: category.id,
        lastUpdateDate: category.lastUpdateDate,
        name: category.name,
        origin: category.origin,
        target: category.target,
        words: category.words,
      };
    },
    fromFirestore: (
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): Category => {
      const data = snapshot.data(options);
      return new Category(
        data['id'],
        data['name'],
        data['origin'],
        data['target']
      );
    }
  };
  