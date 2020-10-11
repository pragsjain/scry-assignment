import { Component } from '@angular/core';
import { AppService } from './app.service';
import { Router } from '@angular/router';
import { ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
constructor(private appService: AppService,
  private router: Router,
  private route: ActivatedRoute){
}
ngOnInit(){
}

}

