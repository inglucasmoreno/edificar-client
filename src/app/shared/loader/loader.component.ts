import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  public show = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart){ // Comienza la navegacion
        this.show = true;
      }else if(event instanceof NavigationEnd){ // Finaliza la navegacion
        setTimeout(()=>{
          this.show = false;
        }, 500);
      }
    });
  }

}
