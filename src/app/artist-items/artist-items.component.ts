import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-artist-items',
  templateUrl: './artist-items.component.html',
  styleUrls: ['./artist-items.component.less'],
  inputs: ['artist']
})
export class ArtistItemsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
