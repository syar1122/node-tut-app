import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent implements OnInit {
  message: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}

  ngOnInit(): void {
    console.log(this.data.message);
    this.message = this.data.message;
  }
}
