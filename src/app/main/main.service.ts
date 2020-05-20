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

  checkUser(data) {
    const { name, type } = data;
    const existedUser = this.users.find(x => (x.name === name && x.type === type));

    if (existedUser) return (this.loginUser = existedUser);

    return !!existedUser;
  }

  newUser(data) {
    this.users = this.users.concat({
      ...data,
      id: (this.users.length || 0) + 1,
    }); 
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
    roomList = roomList.filter(x => 
      moment(date).isSame(x.startTime) 
      || moment(date).isSame(x.endTime) 
      || moment(date).isBetween(x.startTime, x.endTime));

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
