import { Injectable } from '@angular/core';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  list = [{
    roomNo: 1,
    ownerName: 'v',
    description: 'This is demom card details',
    duartion: `${moment({hour: 12, minute: 20}).format('hh:mm')}TO${moment({hour: 15, minute: 30}).format('hh:mm')}`,
    date: moment().format('DD-MMM-yyyy'),
    startTime: moment({hour: 12, minute: 20}).format(),
    endTime: moment({hour: 15, minute: 20}).format(),
    timestamp: moment(),
  }, {
    roomNo: 2,
    ownerName: 'd',
    description: 'This is demo card details',
    duartion: `${moment({hour: 14, minute: 20}).format('hh:mm')}TO${moment({hour: 16, minute: 30}).format('hh:mm')}`,
    date: moment().format('DD-MMM-yyyy'),
    startTime: moment({hour: 14, minute: 20}).format(),
    endTime: moment({hour: 16, minute: 20}).format(),
    timestamp: moment(),
  }, {
    roomNo: 3,
    ownerName: '2d',
    description: 'This is demo 3 card details',
    duartion: `${moment({hour: 15, minute: 20}).format('hh:mm')}TO${moment({hour: 17, minute: 30}).format('hh:mm')}`,
    date: moment().format('DD-MMM-yyyy'),
    startTime: moment({hour: 15, minute: 20}).format(),
    endTime: moment({hour: 17, minute: 20}).format(),
    timestamp: moment(),
  }, {
    roomNo: 4,
    ownerName: 'dvi',
    description: 'This is demo card 4 details',
    duartion: `${moment({hour: 12, minute: 20}).format('hh:mm')}TO${moment({hour: 14, minute: 30}).format('hh:mm')}`,
    date: moment({date: 18 }).format('DD-MMM-yyyy'),
    startTime: moment({date: 18, hour: 12, minute: 20}).format(),
    endTime: moment({date: 18, hour: 14, minute: 20}).format(),
    timestamp: moment(),
  }];
  moment: any = moment;
  rooms = new Array(5).fill(0).map((x, i) => i + 1);
  constructor() {}

  loadData() {
    console.log(this.list);
    return this.list;
  }

  checkOfficalTime(control) {
    const value = control.value;

    if (!value) return null;
    else if (!(value.hour >= 9 && value.hour < 21)) {
      alert('You need book between 9AM to 9PM');
    }

    return null;
  }

  add(data) {    
    const {
      roomNo, ownerName, description, 
      date: { year, month, day },
      startTime, endTime
    } = data;

    this.list.push({
      roomNo,
      ownerName,
      description,
      duartion: `${this.moment({hour: startTime.hour, minute: startTime.minute}).format('hh:mm')}TO${this.moment({hour: endTime.hour, minute: endTime.minute}).format('hh:mm')}`,
      date: this.moment({year, month, date: day}).format('yyyy-MM-DD'),
      startTime: moment({hour: startTime.hour, minute: startTime.minute}).format(),
      endTime: moment({hour: endTime.hour, minute: endTime.minute}).format(),
      timestamp: this.moment(),
    });
    console.log(this.list);
  }

  remove(index) {
    this.list.splice(index, 1);
  }

  checkMaxSlotTime(time) {
    return (time >= 3);
  }

  checkMaxSlot(slot) {
    return (slot >= 3);
  }

  checkSlotDayTime() {
    console.log('enter');
  }

  removeConferece(index) {
    this.list.splice(index, 1);
  }
}
