import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from 'src/app/interfaces/user';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUser:any=null;
   user:User
   authSubscription:Subscription[]=[];
  constructor(private authService:AuthService,
    private loadingService:LoadingService,
    private route:ActivatedRoute,
    private db:AngularFirestore) {
      this.loadingService.isLoading.next(true);
     }

  ngOnInit() {
    this.authSubscription.push(this.authService.currentUser.subscribe(user =>{
      this.currentUser=user;
    }));
    this.authSubscription.push(this.route.paramMap.subscribe(params=>{
      console.log(this.route)
      const userId=params.get('userId')
      const userRef:AngularFirestoreDocument<User>=this.db.doc(`users/${userId}`);
      userRef.valueChanges().subscribe(user=>this.user=user);
      this.loadingService.isLoading.next(false);
    }))
  }

  ngOnDestroy(){
    this.authSubscription.forEach(subscription => subscription.unsubscribe())
  }
}
