import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { LoadingService } from './loading.service';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../classes/user';


@Injectable({
  providedIn: 'root'
})
export class ChatroomService {
  
  public chatrooms:Observable<any>;
  public changeChatroom:BehaviorSubject<string|null>=new BehaviorSubject(null);
  public selectedChatroom:Observable<any>;
  public selectedChatroomMessages:Observable<any>;
  constructor(private db:AngularFirestore, private loadingService:LoadingService, private authService:AuthService) {
    this.selectedChatroom=this.changeChatroom.pipe(switchMap(chatroomId=>{
      if(chatroomId){
        console.log(chatroomId)
        // this.loadingService.isLoading.next(true);
        
        // this.db.doc(`chatrooms/${chatroomId}`).valueChanges().subscribe(op => console.log(op));
        return this.db.doc(`chatrooms/${chatroomId}`).valueChanges();
      }
       return of(null);
    }))
    this.selectedChatroomMessages=this.changeChatroom.pipe(switchMap(chatroomId=>{
      if(chatroomId){
        console.log(chatroomId)
        // this.loadingService.isLoading.next(true);
        
        // this.db.doc(`chatrooms/${chatroomId}`).valueChanges().subscribe(op => console.log(op));
        return this.db.collection(`chatrooms/${chatroomId}/messages`).valueChanges();
        
      }
       return of(null);
    }))
    this.chatrooms=db.collection('chatrooms').valueChanges();
    console.log(this.chatrooms)
   }

   public createMessage(text:string){
     const chatroomId = this.changeChatroom.value;
     const sender=this.authService.setCurrentUserSnapshot();
     const message={
       message:text,
       createdAt:new Date(),
       sender:sender
      };
      console.log(this.authService.setCurrentUserSnapshot())
      this.db.collection(`chatrooms/${chatroomId}/messages`).add(message);
   }
}
