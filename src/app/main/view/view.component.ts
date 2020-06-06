import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainService } from '../main.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  id = '';
  data: any = {};

  constructor(
    public router: ActivatedRoute,
    public mainService: MainService,
  ) { }

  ngOnInit(): void {
    this.id = this.router.snapshot.paramMap.get('id');
    this.data = this.mainService.list.find(x => x.id === +this.id);
  }
}
