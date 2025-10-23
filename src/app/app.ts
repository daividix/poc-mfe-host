import { Component, signal, effect } from '@angular/core';
import { UserSessionService, BannerContentService } from '@poc-mfe/shared';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  
  currentRoute = signal<string>('');

  constructor(
    private _userSession: UserSessionService,
    private _bannerContent: BannerContentService,
    private router: Router
  ) {
    effect(() => {
      const isLoggedIn = this._userSession.isLoggedIn();
      const isLoggedOut = this._userSession.isLoggedOut();
      if(isLoggedIn) {
        console.log('detecto el login')
        this.router.navigateByUrl('/home');
      }
      if(isLoggedOut) {
        console.log('detecto el loggedout')
        this.router.navigateByUrl('/');
      }
    })
  }

  ngOnInit() {
    this._bannerContent.setBanner({
      type: 'text',
      content: 'Bienvenido'
    });
    this.currentRoute.set(this.router.url);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute.set(event.urlAfterRedirects);
        console.log(this.currentRoute)
      }
    });
  }

  get user() {
    return this._userSession.user();
  }
}
