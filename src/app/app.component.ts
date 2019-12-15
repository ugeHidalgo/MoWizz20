import { Component } from '@angular/core';
import { GlobalsService } from './globals/globals.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MoWizz - The money wizzard';

  constructor ( protected globals: GlobalsService, private router: Router) {
    const me = this,
          username = me.globals.getUserNameFromLocalStorage();

    me.globals.setUser(username);
    me.router.navigate(['/mainscreen']);
  }

  logout() {
    const me = this;

    me.globals.clearUser();
    me.globals.removeUserDataFromLocalStorage();
    me.router.navigate(['/']);
  }
}
