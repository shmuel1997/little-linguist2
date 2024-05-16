import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-timer',
  standalone: true,
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() duration!: number; 
  @Output() timeUp: EventEmitter<void> = new EventEmitter<void>();
  @Output() reportTimeLeft: EventEmitter<number> = new EventEmitter<number>(); 

  displayTimeLeft: string = '';
  private timeLeft: number = 0;
  private intervalId?: number;

  ngOnInit(): void {
    if (!this.duration) {
      throw new Error('duration is required');
    }
    this.timeLeft = this.duration;
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  public startTimer(): void {
    console.log('Starting timer...');
    this.intervalId = window.setInterval(() => {
      this.timeLeft--;
      this.reportTimeLeft.emit(this.timeLeft);
      if (this.timeLeft <= 0) {
        clearInterval(this.intervalId);
        this.timeUp.emit();
      }
      this.displayTimeLeft = this.formatTime(this.timeLeft);
    }, 1000);
  }
  
  public resetTimer(): void {
    console.log('Resetting timer...');
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.timeLeft = this.duration;
    this.displayTimeLeft = this.formatTime(this.timeLeft);
  }
  

  private formatTime(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${this.padTime(minutes)}:${this.padTime(seconds)}`;
  }

  private padTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }

  
}
