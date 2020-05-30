import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  @Input() dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  constructor(private route: ActivatedRoute,
          private dishService: DishService,
          private loaction: Location
    ) { }

  ngOnInit() {
    this.dishService.getDishIds()
      .subscribe(
        (dishIds) => {
          this.dishIds = dishIds;
          console.log(this.dishIds);
        }
      )

    this.route.params
      .pipe(switchMap((params: Params)=> {
        return this.dishService.getDish(params['id'])
      }))
      .subscribe(
        (dish) => {
          this.dish = dish;
          this.setPrevNext(dish.id);
        }
      )
  }

  goBack(): void {
    this.loaction.back();
  }

  setPrevNext(dishId: string) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%(this.dishIds.length)];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%(this.dishIds.length)];
  }

}
