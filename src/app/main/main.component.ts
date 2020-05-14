import { Component, OnInit, TemplateRef } from '@angular/core';
import { MainService } from './main.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  list = [];
  form: FormGroup;
  selectForm: FormGroup;
  today;
  modal;
  type = ['all', 'past', 'future'];

  constructor(
    public mainService: MainService,
    public modalService: NgbModal,
    public formBuilder: FormBuilder,
  ) {
    this.today = this.mainService.moment();

    this.selectForm = this.formBuilder.group({
      selected: [this.type[0]],
    });

    this.form = this.formBuilder.group({
      ownerName: [''],
      roomNo: [''],
      description: [''],
      startTime: ['', (control: FormControl) => this.mainService.checkOfficalTime(control)],
      endTime: ['', (control: FormControl) => this.mainService.checkOfficalTime(control)],
      date: [{
        "year": this.today.year(),
        "month": this.today.month(),
        "day": this.today.date()
      }]
    })
  }

  ngOnInit(): void {
    this.list = this.mainService.loadData();
  }

  resetForm() {
    this.form.reset()
  }

  addConference() {
    this.mainService.add(this.form.value)
    this.resetForm();
  }

  openModal(template: TemplateRef<any>) {
    this.modalService
      .open(template)
      .result
      .then((result) => {
        this.addConference()
      }, (reason) => {
        console.log(`dismiss with: ${reason}`);
      })
  }

  setEndDate() {
    console.log('enter', this.form);
    // this.form.value.startTime; 
    this.form.setValue({
      endTime: {
        hour: this.form.value.startTime.hour + 1,
        minute: this.form.value.startTime.minute
      },
    });
  }

  checkEndTime() {
    const { startTime, endTime, date: { year, month, day } } = this.form.value;

    if (!endTime) return true;

    let start = this.mainService.moment().clone();
    start.set({ year, month, date: day, hour: startTime.hour, minute: startTime.minute });
    let end = this.mainService.moment().clone();
    end.set({ year, month, date: day, hour: endTime.hour, minute: endTime.minute });
    const maxEnd = start.clone().add(3, 'h');

    if (start === end) {
      console.log('Start time and End time need different');
    } else if (end.isBefore(start)) {
      console.log('End time not less then start time');
    } else if (end.isSameOrAfter(maxEnd)) {
      console.log('End time not more then 3 hours');
    }
  }

  filerList() {
    this.list = [];
    const data = this.mainService.loadData();
    
    switch(this.selectForm.value.selected) {
      case 'future': 
        const futureData = data.filter(x => this.mainService.moment() < this.mainService.moment(x.startTime));
        this.list = futureData.sort((x, y) => this.mainService.moment(x.startTime) - this.mainService.moment(y.startTime));
        break;
      case 'past':
        const pastData = data.filter(x => this.mainService.moment() > this.mainService.moment(x.startTime));
        this.list = pastData.sort((x, y) => this.mainService.moment(x.startTime) - this.mainService.moment(y.startTime));
        break;
      default:
        this.list = data
    }
  }
}
