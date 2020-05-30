import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  @Input() dish: Dish;

  constructor(private route: ActivatedRoute,
          private dishService: DishService,
          private loaction: Location
    ) { }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    this.dishService.getDish(id)
      .subscribe(
        (dish) => {
          this.dish = dish;
        }
      );
  }

  goBack(): void {
    this.loaction.back();
  }

}
