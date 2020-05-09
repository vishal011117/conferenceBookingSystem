import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  list = [];
  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.list = [...Array(10).keys()].reduce((acc, curr, index) => {
      acc.push(index + 1);
      return acc;
    }, [])
  }
}
