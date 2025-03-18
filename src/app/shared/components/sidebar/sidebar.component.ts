import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Menu,NavService } from '../../services/nav.service';
import { Global } from '../../services/golbal';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  menuItems:Menu[] = [];
  // menuItems: Menu[];
  fullName: any;
  emailId: any;
  imagePath: string = 'assets/images/dashboard/user3.jpg';
  constructor(public _navService: NavService ,@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.menuItems = this._navService.MENUITEMS;

    // this.fullName = "mohit purohit";
    // this.emailId = "mohitpurohit@gmail.com";


    // let userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');

    // this.imagePath = (userDetails.imagePath == '' || userDetails.imagePath == null)
    //   ? 'assets/images/user.png' : Global.BASE_API_PATH + userDetails.image;

    if (isPlatformBrowser(this.platformId)) {
      let userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
      this.fullName = userDetails.name;
      this.emailId = userDetails.email;
    }

  }

  //click toggle menu // need to clear
  toggleNavActive(item: any) {
    item.active = !item.active;
  }

}
