import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MainService } from '../main.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  list = [];
  form: FormGroup;
  selectForm: FormGroup;
  today;
  modal;
  type = ['all', 'past', 'future'];
  loading: boolean;

  constructor(
    public mainService: MainService,
    public modalService: NgbModal,
    public formBuilder: FormBuilder,
    public toastr: ToastrService,
    public router: Router,
  ) {
    this.today = this.mainService.moment();

    this.selectForm = this.formBuilder.group({
      selected: [this.type[0]],
    });

    this.form = this.formBuilder.group({
      ownerName: ['', Validators.required],
      roomNo: ['', Validators.required],
      description: ['', Validators.required],
      startTime: ['', (control: FormControl) => this.setEndTime(control)],
      endTime: ['', (control: FormControl) => this.checkCondition(control)],
      date: ['', Validators.required]
    });
  }

  setEndTime(control) {
    if (this.form) this.form.controls.endTime.setValue(undefined);
    
    this.mainService.checkOfficalTime(control);
  }

  checkCondition(control, form = this.form) {
    return this.mainService.checkOfficalTime(control)
      && this.checkEndTime(control);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.list = this.mainService.loadData();
    this.loading = false;
  }

  resetForm() {
    this.form.reset()
  }

  removeSlot(id) {  
    this.mainService.removeConferece(id);
    this.loadData();
    this.toastr.error("You are Conference slot successfully remove");
  }

  closeModal() {
    this.resetForm();     
    this.modal.close('Save click'); 
  }

  addConference() {
    const { value } = this.form;

    if (!value.startTime && !value.endTime) {
       return this.toastr.error('Start and End Time are mandatory');
    }
    if (!this.form.valid) return this.toastr.error('All fields are mandatory');

    const slot = this.mainService.checkSlot(value);
    if (slot) {
      const data = this.mainService.add(value);

      if (data) {
        this.toastr.success("You are Conference slot successfully registerd");
        this.closeModal();
        this.loadData();
      }
    } else {
        this.form.controls.startTime.setValue(undefined);
        this.form.controls.endTime.setValue(undefined);
        this.toastr.error('Already slot booked');
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modal = this.modalService.open(template)
  }

  checkEndTime(control) {
    if (!this.mainService.checkTypeUser()) return true;

    const endTime = control.value;
    const { startTime, date: { year, month, day } } = this.form.value;

    if (!endTime) return false;

    let start = this.mainService.moment().clone();
    start.set({ year, month, date: day, hour: startTime.hour, minute: startTime.minute });
    let end = this.mainService.moment().clone();
    end.set({ year, month, date: day, hour: endTime.hour, minute: endTime.minute });
    const maxEnd = start.clone().add(3, 'h');

    if (start === end) {
      this.toastr.error('Enter Start time and End time different');
      return false;
    } else if (end.isSameOrBefore(start)) {
      this.toastr.error('Entering End time is not less then start time');
      return false;
    } else if (end.isSameOrAfter(maxEnd)) {
      this.toastr.error('Booking slot not more then 3 hours');
      return false;
    }

    return true
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

  redirect(id) {
    this.router.navigate(['/main/view', id ])
  }
}
