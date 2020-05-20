import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginStep = true;
  form: FormGroup;

  constructor(
    public mainService: MainService,
    public router: Router,
    public formBuilder: FormBuilder,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['admin'],
    })
  }

  submit() {
    const data = {
      name: this.form.get('name').value,
      type: this.form.get('type').value,
    };

    if (!this.loginStep) {
      this.mainService.newUser(data);
      this.toastr.success("You are successfully registerd");
      this.form.reset();

      return (this.loginStep = !this.loginStep); 
    }

    const isExistedUser = this.mainService.checkUser(data);

    if (isExistedUser) {
      this.router.navigate(['main'])
      this.form.reset();
    } else {
      this.toastr.error("You are unregister user");
    }
  }
}
