import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, Observable } from 'rxjs'
import { User } from 'src/app/classes/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser:any=null;
  authSubscription:Subscription;
  constructor(private authService:AuthService) {
    console.log("In Navbar Constructor");
   }

  ngOnInit() {
    console.log("In Navbar OnInit");
    this.authSubscription=this.authService.currentUser.subscribe(user =>{
      this.currentUser=user;
    });
  console.log("navbar", this.currentUser)
}

ngOnDestroy(){
  if(this.authSubscription){
    this.authSubscription.unsubscribe();
  }
  
}


}
