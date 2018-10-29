import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading-panel',
  templateUrl: './loading-panel.component.html',
  styleUrls: ['./loading-panel.component.css']
})
export class LoadingPanelComponent implements OnInit {

  @Input() message: string = "Loading...";
  
  constructor() { }

  ngOnInit() {
  }

}
