import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-product-image',
  templateUrl: './product-image.component.html',
  styleUrls: ['./product-image.component.css']
})
export class ProductImageComponent implements OnInit, OnChanges {

  @Input() imageFolder: string = null;
  @Input() size: string = null;

  imageLoaded: boolean = false;
  imageFailed: boolean = false;
  imageSource: string = null;

  ngOnChanges(changes: SimpleChanges): void {
    //Start loading a new image
    this.renderImage();
  }

  getImageUrl(): string {
    return `${this.imageFolder}${this.size}.jpg`;
  }

  renderImage(): void {
    this.messageService.debug("Product Image changing.");
    this.imageLoaded = false;
    this.imageFailed = false;
    
    if (this.imageFolder == null || this.size == null) {
      this.messageService.debug("Product Image failed.");
      this.imageFailed = true;
      this.imageLoaded = false; 
    }
    else {
      var url = this.getImageUrl();
      var productImage = new Image();
      productImage.src = url;

      productImage.onerror = () => {
        this.messageService.debug("Product Image does not exist: " + url);
        this.imageFailed = true;
        this.imageLoaded = false;
      }
      
      productImage.onload = () => {
        this.messageService.debug("Product Image loaded.");
        this.imageSource = url;
        this.imageLoaded = true;
        this.imageFailed = false;
      }
    }
  }

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.renderImage();
  }

}
