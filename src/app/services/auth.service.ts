import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../classes/user';
import { Observable } from 'rxjs';
import { AlertType } from '../enums/alert-type.enum';
import { AlertService } from './alert.service';
import { Alert } from '../classes/alert';
import { of, Subject } from 'rxjs';
import { LoadingService } from './loading.service';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUserSnapshot:User|null;
  public currentUser:Observable<User|null>;
  public users:any;
  constructor(
    private router:Router, 
    private alertService:AlertService,
    private loadingService:LoadingService,
    private afAuth:AngularFireAuth,
    private db:AngularFirestore,
   ) {
     this.currentUser=this.afAuth.authState.pipe(switchMap(user=>{
       if(user){
        //  this.db.doc<User>(`users/${user.uid}`).valueChanges().subscribe(op=>console.log(op))
        localStorage.setItem('user', JSON.stringify(user));
        return this.db.doc<User>(`users/${user.uid}`).valueChanges();
       }else{
         return of(null);
       }
     }))
     this.setCurrentUserSnapshot();
     this.users=db.collection('users').valueChanges();
   }
   

   public signup(firstName:string, lastName:string, email:string, password:string){
    //to call firebase signup function
    // return of(true);
    this.afAuth.auth.createUserWithEmailAndPassword(email,password)
    .then((result) => {
      console.log(result.user);
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${result.user.uid}`);
    console.log(userRef)
    const updatedUser = {
    id:result.user.uid,
    firstName,
    lastName,
    photoUrl: 'https://avatarfiles.alphacoders.com/131/131718.jpg'
    };
    userRef.set(updatedUser);
    console.log("In then block")
    console.log("in auth service signup",this.isAuth())
    this.loadingService.isLoading.next(false);
    this.router.navigate(['/chat'])
    
    return true;
    })
    .catch((err) =>{ 
      
      return false
    });
  }
   
   public login(email:string, password:string){
     //to call firebase login function
    // return of(true);
    
   
    this.afAuth.auth.signInWithEmailAndPassword(email,password)
   .then(result => {
        //console.log(result);
       this.loadingService.isLoading.next(false);
        this.router.navigate(['/chat']);
      })
  .catch(error => {
      this.loadingService.isLoading.next(false);
      this.alertService.alerts.next(new Alert('Invalid Credentials', AlertType.Danger))
      console.log(error);
  });
   }
   public logout():void{
     //to call firebase logout function
     this.afAuth.auth.signOut().then(()=>{
      localStorage.removeItem('user')
      this.currentUser=null;
      this.router.navigate(['/login']);
      this.alertService.alerts.next(new Alert('You have been Signed Out', AlertType.Success))
       
    })
    
   }

   public isAuth(){
    return this.currentUser;
   }

   public setCurrentUserSnapshot(){
      this.currentUser.subscribe(user=>this.currentUserSnapshot=user);
     this.currentUser.subscribe(user=>{
        console.log("Current User", user);
      })
      console.log("Current User Snapshot", this.currentUserSnapshot);
      return this.currentUserSnapshot;
   }
}
