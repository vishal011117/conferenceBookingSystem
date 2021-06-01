import { Injectable } from '@angular/core';

import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    public toastr: ToastrService
  ) {
    this.loginUser = this.getFromlocalStorage('user');
    this.users = this.getFromlocalStorage('users');
    this.list = this.getFromlocalStorage('list');
  }

  getFromlocalStorage(key)  {
    return JSON.parse(localStorage.getItem(key)) || [];
  }

  setLocalStorage(key: string, data: any) {
    return localStorage.setItem(key, JSON.stringify(data));
  }

  checkMaxSlot(slot) {
    return (slot >= 3);
  }

  removeConferece(id) {
    this.list = this.list.filter(x => x.id !== id);
    this.setLocalStorage('list', this.list);
  }

  checkTypeUser() {
    return !!(this.types[0] === this.loginUser.type);
  }

  checkUser(data) {
    const { name, type, password } = data;
    const existedUser = this.users.find(x => (x.name === name && x.type === type && x.password === password));

    if (existedUser) {
      this.setLocalStorage('user', existedUser);
      this.loginUser = existedUser
    };

    return !!existedUser;
  }

  newUser(data) {
    this.users = this.users.concat({
      ...data,
      id: (this.users.length || 0) + 1,
    });

    this.setLocalStorage('users', this.users);
  }

  loadData() {
    this.list = this.getFromlocalStorage('list');
    
    return this.checkTypeUser()
      ? this.list.filter(x => x.userId === this.loginUser.id)
      : this.list;
  }

  checkOfficalTime(control) {
    const value = control.value;

    if (!value) return null;
    else if (!(value.hour >= 9 && value.hour < 21)) {
      this.toastr.error('You need book between 9AM to 9PM');
      return false
    }

    return true;
  }

  getRoomSlot(number) {
    return this.list.filter(x => x.roomNo === number);
  }

  checkSlot(data) {
    const { date, startTime, endTime, roomNo } = data;

    let roomList  = this.getRoomSlot(roomNo);
    const startDateTime = moment({
      ...date,
      month: date.month - 1,
      ...startTime
    }).format();    
    const endDateTime = moment({ 
      ...date,
      month: date.month - 1, 
      ...endTime
    }).format();

    roomList = roomList.filter(x =>
      ((moment(startDateTime).isSame(x.startTime) || moment(endDateTime).isSame(x.startTime))
      || (moment(startDateTime).isSame(x.endTime) || moment(endDateTime).isSame(x.endTime))
      || (moment(startDateTime).isBetween(x.startTime, x.endTime) || moment(endDateTime).isBetween(x.startTime, x.endTime))
      || (moment(x.startTime).isBetween(startDateTime, endDateTime) || moment(x.endTime).isBetween(startDateTime, endDateTime))));

    if (roomList.length) return false;

    return true;
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

    const dateFormat = { year, month: month - 1, date: day }

    const i = this.getIndex(dateFormat, startTime);

    const formatedData = {
      roomNo,
      ownerName,
      userId: this.loginUser.id,
      description,
      id: this.list.length + 1,
      date: this.moment(dateFormat).format('yyyy-MM-DD'),
      startTime: moment({ ...dateFormat, hour: startTime.hour, minute: startTime.minute}).format(),
      endTime: moment({ ...dateFormat, hour: endTime.hour, minute: endTime.minute}).format(),
      timestamp: this.moment().format(),
    };

    this.list.splice(i, 0, formatedData);
    this.setLocalStorage('list', this.list);
    return true;    
  }

  getRandomColor() {
    const color = "hsl(" + Math.random() * 360 + ", 50%, 75%)";
    return color;
  }
}
