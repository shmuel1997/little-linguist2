import { Injectable } from '@angular/core';
import { GamePlayed } from '../../shared/model/game-Played';
import {
  DocumentSnapshot,
  Firestore,
  QuerySnapshot,
  addDoc,
  collection,
  getDocs,
} from '@angular/fire/firestore';
import { gamePlayedConverter } from './converters/gamePlayed.converter';

@Injectable({
  providedIn: 'root',
})
export class GamePlayerDifficultyService {
  constructor(private firestoreService: Firestore) {}

  async list(): Promise<GamePlayed[]> {
    const collectionConnection = collection(
      this.firestoreService,
      'gamesPlayed'
    ).withConverter(gamePlayedConverter);
    const querySnapshot: QuerySnapshot<GamePlayed> = await getDocs(
      collectionConnection
    );
    const result: GamePlayed[] = [];
    querySnapshot.docs.forEach((docSnap: DocumentSnapshot<GamePlayed>) => {
      const data = docSnap.data();
      if (data) {
        result.push(data);
      }
    });
    return result;
  }

  async addGamePlayed(gamePlayed: GamePlayed): Promise<void> {
    await addDoc(
      collection(this.firestoreService, 'gamesPlayed').withConverter(
        gamePlayedConverter
      ),
      gamePlayed
    );
  }

  async getNumberOfLearnedCategories(): Promise<number> {
    const gamesPlayed = await this.list();
    const learnedCategoryIds = new Set(
      gamesPlayed.map((game) => game.idCategory)
    );
    return learnedCategoryIds.size;
  }

  async getNumberOfUnlearnedCategories(
    totalCategories: number
  ): Promise<number> {
    const numberOfLearnedCategories = await this.getNumberOfLearnedCategories();
    return Math.max(totalCategories - numberOfLearnedCategories, 0);
  }

  async getTotalPlaytime(): Promise<number> {
    const games = await this.list();
    return games.reduce((total, game) => total + game.secondsPlayed, 0);
  }

  async getAverageGameTime(): Promise<number> {
    const games = await this.list();
    return games.length > 0
      ? (await this.getTotalPlaytime()) / games.length
      : 0;
  }

  async getGamesFinishedOnTimePercent(): Promise<number> {
    const games = await this.list();
    const gamesFinishedOnTime = games.filter(
      (game) => game.secondsLeftInGame > 0
    ).length;
    return games.length > 0 ? (gamesFinishedOnTime / games.length) * 100 : 0;
  }
}
