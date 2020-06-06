import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss'],
})

export class TrackComponent implements OnInit {
  list = [];
  times = {
    low: 9,
    high: 21,
  };
  timeArray = [];
  slots = {};
  data = [];
  toggleDate: any = '';

  constructor(
    public mainService: MainService,
    public router: Router,
  ) { }
  
  ngOnInit(): void {
    // this.toggleDate = this.mainService.moment();
    this.createTimeData();
    this.loadData();
  }

  loadData() {
    this.list = this.mainService.loadData();
    this.loadDatedData(); 
  }

  loadDatedData(counter = null) {
    if (counter === '+') this.toggleDate = this.mainService.moment(this.toggleDate).add(1, 'd');
    else if (counter === '-') this.toggleDate = this.mainService.moment(this.toggleDate).subtract(1, 'd');
    else this.toggleDate = this.mainService.moment();

    this.data = this.list
      .filter(x => this.toggleDate.format('yyyy-MM-DD') === x.date);
    this.createSlotwithTime();
  }

  createTimeData() {
    this.timeArray = new Array(this.times.high - this.times.low)
      .fill(this.times.low)
      .map((x, i) => `${x + (i)}:00`)
  }

  createSlotwithTime() {
    this.slots = this.mainService.rooms
      .reduce((acc, x) => ({
        ...acc,
        [x]: this.data.filter(v => +v.roomNo === x)
      }), {});
  }

  getUpperMargin(slot) {
    const cellHeight = 40;
    const startTime = this.mainService.moment(slot.startTime).format('HH:mm');
    const endTime = this.mainService.moment(slot.endTime).format('HH:mm');

    const [startHour, startMinute] = startTime.split(':');
    const [endHour, endMinute] = endTime.split(':');

    const startPoint = ((startHour - 9) * cellHeight) + ((startMinute / 60) * cellHeight);
    const endPoint = ((endHour - 9) * cellHeight + ((endMinute / 60) * cellHeight) - startPoint);

    let styles = {
      'background-color': this.mainService.getRandomColor(),
      'font-weight': 'normal',
      'top': `${startPoint}px`,
      'height': `${endPoint}px`
    };

    return styles;
  }

  redirect(id) {
    this.router.navigate(['/main/view', id ])
  }
}
