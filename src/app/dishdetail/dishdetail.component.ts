import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { baseURL } from '../shared/baseurl';
import { visibility } from '../animations/app.animations'


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    visibility()
  ]
})
export class DishdetailComponent implements OnInit {

  form: FormGroup;
  @Input() dish: Dish;
  @ViewChild('cform') formDirective;
  dishIds: string[];
  prev: string;
  next: string;
  isSubmmited = false;
  dishCopy: Dish;
  baseURL = baseURL;
  visibility = 'shown';
  formValue = {
    author: '',
    rating: '',
    comment: ''
  };
  rate: string;
  errMess: string;
  formErrors = {
    'author': '',
    'comment': ''
  }

  validationMessages = {
    'author': {
      'required': 'Author name is required.',
      'minlength': 'First Name must be at least 2 characters long.'
    },
    'comment': {
      'required': 'Comment is required'
    }
  }

  constructor(private route: ActivatedRoute,
          private dishService: DishService,
          private loaction: Location,
          private fb: FormBuilder
    ) { }

  ngOnInit() {
    this.dishService.getDishIds()
      .subscribe(
        (dishIds) => {
          this.dishIds = dishIds;
          console.log(this.dishIds);
        },
        (errMess) => {
          this.errMess = errMess;
        }
      )

    this.route.params
      .pipe(switchMap((params: Params)=> {
        this.visibility = 'hidden';
        return this.dishService.getDish(params['id'])
      }))
      .subscribe(
        (dish) => {
          this.visibility = 'shown';
          this.dish = dish;
          this.dishCopy = dish;
          this.setPrevNext(dish.id);
        }
      )

      this.createForm();
  }

  goBack(): void {
    this.loaction.back();
  }

  setPrevNext(dishId: string) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%(this.dishIds.length)];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%(this.dishIds.length)];
  }

  createForm() {
    this.form = this.fb.group({
      author: ['',[Validators.required,Validators.minLength(2)]],
      comment: ['',[ Validators.required]],
      rating: [5]
    });

    this.form.valueChanges
      .subscribe(
        (data) => {
          this.onValueChanged(data);
          this.formValue = this.form.value;
        }
    )

    this.onValueChanged();
  }

  onSubmit() {
    this.isSubmmited = true;
    this.dishCopy.comments.push({
      author: this.formValue.author,
      rating: +this.formValue.rating,
      comment: this.formValue.comment,
      date: (new Date().toISOString())
    });
    this.dishService.putDish(this.dishCopy)
      .subscribe(
        (dish: Dish) => {
          this.dish = dish;
          this.dishCopy = dish;
        },
        (errMess) => {
          this.errMess = errMess;
          this.dish = null;
          this.dishCopy = null;
        }
      )
    this.formDirective.resetForm();
    this.form.reset({
      author: '',
      rating: '5',
      comment: ''
    });
  }

  onValueChanged(data?: any) {
    if (!this.form) { return; }
    const form = this.form;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}
