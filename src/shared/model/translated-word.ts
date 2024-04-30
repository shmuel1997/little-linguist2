export class TranslatedWord {
  origin: string;
  target: string;
  guess: string;
  status: string;

  constructor(origin: string, target: string) {
    this.origin = origin;
    this.target = target;
    this.guess = '';
    this.status = '';
  }
}
