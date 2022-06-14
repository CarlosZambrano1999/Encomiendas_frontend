import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public subscriber: Subscription | undefined;

  constructor(private router: Router, @Inject(DOCUMENT) private document: any){ }

  ngOnInit(): void {
    this.subscriber = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
       if(event['url']==='/login' ||  event['url']==='/singUp' ||  event['url']==='/change' || event['url']==='/' ){
        this.document.body.classList = '';
        this.document.body.classList.add('bg1');
      }else if(event['url']==='/send' ||  event['url']==='/sent' ||  event['url']==='/received'){
        this.document.body.classList = '';
        this.document.body.classList.add('bg2');
      }else{
        this.document.body.classList = '';
        this.document.body.classList.add('bg3');
      }

    });
  }

  ngOnDestroy () {
    this.subscriber?.unsubscribe();
  }
}


