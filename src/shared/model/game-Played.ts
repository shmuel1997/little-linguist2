export class GamePlayed {
  idCategory: number;
  idGame?: number;
  date: Date;
  numOfPoints: number;

  constructor(
    idCategory: number,
    idGame: number,
    date: Date,
    numOfPoints: number
  ) {
    (this.idCategory = idCategory),
      (this.idGame = idGame),
      (this.date = date),
      (this.numOfPoints = numOfPoints);
  }
}
