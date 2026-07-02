import { Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { LoaderService } from '../../../models/shared/loader.service';

@Component({
    selector: 'app-loader',
    imports: [NgIf, AsyncPipe],
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  constructor(public loader: LoaderService) {}
}
