import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terminator',
  templateUrl: './terminator.component.html',
  styleUrls: ['./terminator.component.css']
})
export class TerminatorComponent implements OnInit {

  closePopup(): void {
    var daddy = window.self;
    daddy.opener = window.self;
    daddy.close();
  }

  constructor() { }

  ngOnInit() {
  }

}
