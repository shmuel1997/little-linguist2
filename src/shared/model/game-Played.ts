export class GamePlayed {
  idCategory: string;
  id?: string;
  date: Date;
  numOfPoints: number;
  secondsPlayed: number; 
  secondsLeftInGame: number; 

  constructor(
    idCategory: string,
    id: string,
    date: Date,
    numOfPoints: number,
    secondsPlayed: number,
    secondsLeftInGame: number
  ) {
    this.idCategory = idCategory;
    this.id = id;
    this.date = date;
    this.numOfPoints = numOfPoints;
    this.secondsPlayed = secondsPlayed;
    this.secondsLeftInGame = secondsLeftInGame;
  }
}
