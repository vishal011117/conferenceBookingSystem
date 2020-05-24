import { Component, OnInit, TemplateRef } from '@angular/core';
import { MainService } from './main.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
    public toastr: ToastrService,
  ) {
    this.today = this.mainService.moment();

    this.selectForm = this.formBuilder.group({
      selected: [this.type[0]],
    });

    this.form = this.formBuilder.group({
      ownerName: [''],
      roomNo: [''],
      description: [''],
      startTime: ['', (control: FormControl) => this.checkCondition(control)],
      endTime: ['', (control: FormControl) => this.checkCondition(control)],
      date: ['']
    });
  }

  checkCondition(control, form = this.form) {
    this.mainService.checkOfficalTime(control) && this.mainService.checkSlot(control, form)
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.list = this.mainService.loadData();
  }

  resetForm() {
    this.form.reset()
  }

  removeSlot(index) {
    this.mainService.removeConferece(index);
    this.loadData();
    this.toastr.error("You are Conference slot successfully remove");
  }

  closeModal() {
    this.resetForm();     
    this.modal.close('Save click'); 
  }

  addConference() {
    const data = this.mainService.add(this.form.value);

    if (data) {
      this.toastr.success("You are Conference slot successfully registerd");
      this.closeModal();
      this.loadData();
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modal = this.modalService.open(template)
  }

  setEndDate() {
    this.form.setValue({
      endTime: {
        hour: this.form.value.startTime.hour + 1,
        minute: this.form.value.startTime.minute
      },
    });
  }

  checkEndTime() {
    if (!this.mainService.checkTypeUser()) return true;

    const { startTime, endTime, date: { year, month, day } } = this.form.value;

    if (!endTime) return true;

    let start = this.mainService.moment().clone();
    start.set({ year, month, date: day, hour: startTime.hour, minute: startTime.minute });
    let end = this.mainService.moment().clone();
    end.set({ year, month, date: day, hour: endTime.hour, minute: endTime.minute });
    const maxEnd = start.clone().add(3, 'h');

    if (start === end) {
      this.toastr.error('Enter Start time and End time different');
    } else if (end.isSameOrBefore(start)) {
      this.toastr.error('Entering End time is not less then start time');
    } else if (end.isSameOrAfter(maxEnd)) {
      this.toastr.error('Booking slot not more then 3 hours');
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
        this.list = data.filter(x => this.mainService.moment() > this.mainService.moment(x.startTime));
        break;
      default:
        this.list = data
    }
  }
}
