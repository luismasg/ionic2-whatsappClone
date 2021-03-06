import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';
import { Messages } from '../../../../imports/collections';
import { Chat, Message, MessageType } from '../../../../imports/models';
import template from './messages.html';

@Component({
  template  
})
export class MessagesPage implements OnInit {
  selectedChat: Chat;
  title: string;
picture: string;
messages: Observable<Message[]>;
message: string = '';

  constructor(navParams: NavParams) {
    this.selectedChat = <Chat>navParams.get('chat');
    this.title = this.selectedChat.title;
    this.picture = this.selectedChat.picture;
    // console.log('Selected chat is: ', this.selectedChat);
  }

  ngOnInit() {
      let isEven = false;
          this.messages = Messages.find(
            {chatId: this.selectedChat._id},
            {sort: {createdAt: 1}}
          ).map((messages: Message[]) => {
            messages.forEach((message: Message) => {
              message.ownership = isEven ? 'mine' : 'other';
              isEven = !isEven;
            });

            return messages;
          });
  }
  onInputKeypress({ keyCode }: KeyboardEvent): void {
   if (keyCode === 13) {
     this.sendTextMessage();
   }
 }

 sendTextMessage(): void {
   // If message was yet to be typed, abort
   if (!this.message) {
     return;
   }

   MeteorObservable.call('addMessage', MessageType.TEXT,
     this.selectedChat._id,
     this.message
   ).zone().subscribe(() => {
     // Zero the input field
     this.message = '';
   });
 }
}
