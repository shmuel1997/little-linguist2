export class GamePlayed {
  idCategory: number;
  idGame?: number;
  date: Date;
  numOfPoints: number;
  secondsPlayed: number; 
  secondsLeftInGame: number; 

  constructor(
    idCategory: number,
    idGame: number,
    date: Date,
    numOfPoints: number,
    secondsPlayed: number,
    secondsLeftInGame: number
  ) {
    this.idCategory = idCategory;
    this.idGame = idGame;
    this.date = date;
    this.numOfPoints = numOfPoints;
    this.secondsPlayed = secondsPlayed;
    this.secondsLeftInGame = secondsLeftInGame;
  }
}
