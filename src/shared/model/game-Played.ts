export class GamePlayed {
  idCategory: number;
  idGame?: number;
  date: Date;
  numOfPoints: number;
  secondsLeftInGame: number;
  secondsPlayed: number; 

  constructor(
    idCategory: number,
    idGame: number,
    date: Date,
    numOfPoints: number,
    secondsLeftInGame: number,
    secondsPlayed: number
  ) {
    this.idCategory = idCategory;
    this.idGame = idGame;
    this.date = date;
    this.numOfPoints = numOfPoints;
    this.secondsLeftInGame = secondsLeftInGame;
    this.secondsPlayed = secondsPlayed;
  }
}