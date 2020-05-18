import { Injectable } from '@angular/core';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  types = ['organization', 'admin'];
  loginUser: any = {};

  users = [];
  list = [];
  // list: any = [{
  //   userId: 1,
  //   roomNo: "1",
  //   ownerName: 'v',
  //   description: ['Bootstrap’s form controls expand on our Rebooted form styles with classes. Use these classes to opt into their customized displays for a more consistent rendering across browsers and devices',
  //   'Be sure to use an appropriate type attribute on all inputs (e.g., email for email address or number for numerical information) to take advantage of newer input controls like email verification, number selection, and more.',
  //   'Here’s a quick example to demonstrate Bootstrap’s form styles. Keep reading for documentation on required classes, form layout, and more.'].join(' '),
  //   date: moment().format('DD-MMM-yyyy'),
  //   startTime: moment({hour: 12, minute: 20}).format(),
  //   endTime: moment({hour: 15, minute: 20}).format(),
  //   timestamp: moment(),
  // }, {
  //   userId: 1,
  //   roomNo: "2",
  //   ownerName: 'd',
  //   description: 'This is demo card details',
  //   date: moment().format('DD-MMM-yyyy'),
  //   startTime: moment({hour: 14, minute: 20}).format(),
  //   endTime: moment({hour: 16, minute: 20}).format(),
  //   timestamp: moment(),
  // }, {
  //   userId: 1,
  //   roomNo: "3",
  //   ownerName: '2d',
  //   description: 'This is demo 3 card details',
  //   date: moment().format('DD-MMM-yyyy'),
  //   startTime: moment({hour: 15, minute: 20}).format(),
  //   endTime: moment({hour: 17, minute: 20}).format(),
  //   timestamp: moment(),
  // }, {
  //   userId: 1,
  //   roomNo: "4",
  //   ownerName: 'dvi',
  //   description: 'This is demo card 4 details',
  //   date: moment({date: 18 }).format('DD-MMM-yyyy'),
  //   startTime: moment({date: 18, hour: 12, minute: 20}).format(),
  //   endTime: moment({date: 18, hour: 14, minute: 20}).format(),
  //   timestamp: moment(),
  // }, {
  //   userId: 1,
  //   roomNo: "2",
  //   ownerName: 'dvi',
  //   description: 'This is demo card 5 details',
  //   date: moment({date: 18 }).format('DD-MMM-yyyy'),
  //   startTime: moment({date: 18, hour: 16, minute: 20}).format(),
  //   endTime: moment({date: 18, hour: 18, minute: 20}).format(),
  //   timestamp: moment(),
  // }, {
  //   userId: 1,
  //   roomNo: "2",
  //   ownerName: '18/05/2020 - 18:20',
  //   description: 'This is demo card 6 details',
  //   date: moment({date: 18 }).format('DD-MMM-yyyy'),
  //   startTime: moment({date: 18, hour: 18, minute: 20}).format(),
  //   endTime: moment({date: 18, hour: 20, minute: 30}).format(),
  //   timestamp: moment(),
  // }, {
  //   userId: 1,
  //   roomNo: "2",
  //   ownerName: '17/05/2020 - 18:20',
  //   description: 'This is demom 2card details',
  //   date: moment({date: 18 }).format('DD-MMM-yyyy'),
  //   startTime: moment({hour: 18, minute: 20}).format(),
  //   endTime: moment({hour: 20, minute: 20}).format(),
  //   timestamp: moment(),
  // }];

  moment: any = moment;
  rooms = new Array(5).fill(0).map((x, i) => i + 1);
  constructor() { }

  remove(index) {
    this.list.splice(index, 1);
  }

  checkMaxSlot(slot) {
    return (slot >= 3);
  }

  removeConferece(index) {
    this.list.splice(index, 1);
  }

  checkTypeUser() {
    return !!(this.types[0] === this.loginUser.type);
  }

  newUser(data) {
    const { name, type } = data;
    const existedUser = this.users.find(x => (x.name === name && x.type === type));

    console.log(existedUser);
    if (existedUser) this.loginUser = existedUser; 
    else {
      this.loginUser = {
        ...data,
        id: (this.loginUser.length || 0) + 1,
      }
      this.users = this.users.concat(this.loginUser); 
    }
    console.log(this.loginUser);
    console.log(this.users);
  }

  loadData() {
    if (this.checkTypeUser()) {
      return this.list.filter(x => x.userId === this.loginUser.id);
    } 

    return this.list;
  }

  checkOfficalTime(control) {
    const value = control.value;

    if (!value) return null;
    else if (!(value.hour >= 9 && value.hour < 21)) {
      alert('You need book between 9AM to 9PM');
      return false
    }

    return true;
  }

  getRoomSlot(number) {
    return this.list.filter(x => x.roomNo === number);
  }

  checkSlot(control, data) {
    const value = data.value;

    let roomList  = this.getRoomSlot(value.roomNo);

    const date = moment({ ...value.date, ...control.value}).format();
    roomList = roomList.filter(x => moment(date).isBetween(x.startTime, x.endTime));

    if (roomList.length) alert('Already slot booked');
  }

  getIndex(date, time) {
    const dateTime = moment({ ...date, ...time }).format()
    const a = this.list.reduce((acc, x) => {

      if (moment(moment(x.startTime).format()).isBefore(dateTime)) {
        acc += 1;
      }

      return acc;
    }, 0);
    
    return a;
  }

  add(data) {
    const {
      roomNo, ownerName, description, 
      date: { year, month, day },
      startTime, endTime
    } = data;

    const dateFormat = {year, month, date: day}

    const i = this.getIndex(dateFormat, startTime);

    const formatedData = {
      roomNo,
      ownerName,
      userId: this.loginUser.id,
      description,
      date: this.moment(dateFormat).format('yyyy-MM-DD'),
      startTime: moment({ ...dateFormat, hour: startTime.hour, minute: startTime.minute}).format(),
      endTime: moment({ ...dateFormat, hour: endTime.hour, minute: endTime.minute}).format(),
      timestamp: this.moment(),
    };

    this.list.splice(i, 0, formatedData);
    return true;    
  }
}
