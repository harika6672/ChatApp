import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { AngularFireStorage } from 'angularfire2/storage';

import {  AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { finalize } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { User } from 'src/app/interfaces/user';
import { AlertService } from 'src/app/services/alert.service';
import { Alert } from 'src/app/classes/alert';
import { AlertType } from 'src/app/enums/alert-type.enum';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy{
public currentUser:any=null;
public userId:string;
public subSubscriptions:Subscription[]=[];
public uploadPercent:number=0;
public downloadUrl:Observable<string>=null;
  constructor( private authService:AuthService,
    private loadingService:LoadingService,
    private fs:AngularFireStorage,
    private alertService:AlertService,
    private route:ActivatedRoute,
    private db:AngularFirestore,
    private location:Location) {
  
  
  
  // this.loadingService.isLoading.next(true);

   }

  ngOnInit() {
    this.subSubscriptions.push(
      this.authService.currentUser.subscribe(user=>{
        this.currentUser=user;
        console.log(this.currentUser)
        // this.loadingService.isLoading.next(false);
      })
    )
    this.subSubscriptions.push(
      this.route.paramMap.subscribe(params=>{
        const userId=params.get('userId');
      })
    )
  }
  public uploadFile(event):void{
    const file=event.target.files[0];
    const filePath=`${file.name}_${this.currentUser.id}`;
    const fileRef = this.fs.ref(filePath);
    const task=this.fs.upload(filePath,file);

    //observe the percentage changes
    this.subSubscriptions.push(
      task.percentageChanges().subscribe(percentage=>{
        if(percentage<100){
          this.loadingService.isLoading.next(true);
        }else{
          this.loadingService.isLoading.next(false);
        }
        this.uploadPercent=percentage;
      })
    )
    
    task.snapshotChanges().pipe(
      finalize(() => this.downloadUrl = fileRef.getDownloadURL() )
      
   )
  .subscribe()
  console.log(this.downloadUrl)
      
    }

    public save():void{
      let photo;
      if(this.downloadUrl){
        photo=this.downloadUrl
      }else{
        photo=this.currentUser.photoUrl
      }
      const user=Object.assign({},this.currentUser,{photoUrl:photo});
      const userRef:AngularFirestoreDocument<User>=this.db.doc(`users/${user.id}`);
      userRef.set(user);
      this.alertService.alerts.next(new Alert('Your Profile is updated successfully',AlertType.Success));
      this.location.back();
    }
    
  
  ngOnDestroy(){
    this.subSubscriptions.forEach(subscription => subscription.unsubscribe())
  }

}
