import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  list = ['list', 'tracker'];
  isShown:boolean = false;
  activeTab = '';

  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {
    if (!this.router.url.split('/main/').length) return;

    this.activeTab = this.router.url.split('/main/')[1];


    this.router.events.subscribe((event: any) => {
      if (!this.router.url.split('/main/').length) return;
      
      this.activeTab = event.url
        ? event.url.split('/main/')[1]
        : this.activeTab
    });
  }

  redirect(name) {
    this.isShown = !this.isShown;
    this.router.navigateByUrl(`/main/${name}`);
  } 

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }
}
