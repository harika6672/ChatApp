import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChatroomService } from 'src/app/services/chatroom.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-chatroom-window',
  templateUrl: './chatroom-window.component.html',
  styleUrls: ['./chatroom-window.component.scss']
})
export class ChatroomWindowComponent implements OnInit, OnDestroy, AfterViewChecked {
//replace with firebase data
@ViewChild('scrollContainer', {static: false}) scrollContainer:ElementRef

public chatroom:Observable<any>;
public messages:Observable<any>;
private subscriptions:Subscription[]=[];

  constructor(private route:ActivatedRoute, private chatroomService:ChatroomService, private loadingService:LoadingService) { 
    this.subscriptions.push(
      this.chatroomService.selectedChatroom.subscribe((chatroom)=>{
        this.chatroom=chatroom;
        console.log(this.chatroom)
        // this.loadingService.isLoading.next(false);
      }),
      this.chatroomService.selectedChatroomMessages.subscribe((messages)=>{
        this.messages=messages;
        console.log(this.messages)
        // this.loadingService.isLoading.next(false);
      })
    )
   
     
    
  }
  ngAfterViewChecked(){
    this.scrollToBottom();
  }

  ngOnInit() {
    this.scrollToBottom();
    this.subscriptions.push(this.route.paramMap.subscribe(params=>{
      const chatroomId=params.get('chatroomId');
      this.chatroomService.changeChatroom.next(chatroomId)
    }))
  }
  ngOnDestroy(){
    this.subscriptions.forEach(subscription=>subscription.unsubscribe())
  }
  private scrollToBottom(){
    try{
       this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight; 
    }catch(err){

    }
  }
}
