import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from '@angular/fire/firestore';
import { GamePlayed } from '../../../shared/model/game-Played';

export const gamePlayedConverter = {
  toFirestore: (game: GamePlayed) => {
    return {
      idCategory: game.idCategory,
      date: Timestamp.fromDate(game.date),
      numOfPoints: game.numOfPoints,
      secondsPlayed: game.secondsPlayed,
      secondsLeftInGame: game.secondsLeftInGame,
    };
  },

  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);
    return new GamePlayed(
      data['idCategory'],
      snapshot.id,
      data['date'].toDate(),
      data['numOfPoints'],
      data['secondsPlayed'],
      data['secondsLeftInGame']
    );
  },
};
