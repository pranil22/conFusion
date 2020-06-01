import { Component, OnInit, Inject } from '@angular/core';
import { DishService } from '../services/dish.service';
import { PromotionService } from '../services/promotion.service';
import { Dish } from '../shared/dish';
import { Promotion } from '../shared/promotion';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';
import { baseURL } from '../shared/baseurl'
import { HttpErrorResponse } from '@angular/common/http';
import { flyInOut, expand } from '../animations/app.animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {
  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  baseURL = baseURL;
  dishErrMess: string;


  constructor(private dishService: DishService,
              private promotionService: PromotionService,
              private leaderService: LeaderService,
    ) { }

  ngOnInit() {
    this.dishService.getFeaturedDish()
      .subscribe((dish) => {
        this.dish = dish;
      },
      (errMess) => {
        this.dishErrMess = errMess;
      });
    this.promotionService.getFeaturedPromotion()
      .subscribe((promo) => {
        this.promotion = promo;
      });
    this.leaderService.getFeaturedLeader()
      .subscribe((leader) => {
        this.leader = leader;
      });
  }

}
