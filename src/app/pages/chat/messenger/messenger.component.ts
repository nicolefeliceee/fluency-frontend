import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { FormsModule } from '@angular/forms';
import { ChatService, MessageDTO } from '../../../services/chat.service';

@Component({
  selector: 'app-messenger',
  standalone: true,
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css'],
  imports: [CommonModule, FormsModule]
})
export class MessengerComponent implements OnInit {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  selectedChatId!: number;
  messages: MessageDTO[] = [];
  newMessage: string = '';
  private socket!: Socket;
  loggedUserId!: number;

  constructor(
    private chatService: ChatService,
    private actRoute: ActivatedRoute // ✅ Inject ActivatedRoute
  ) { }

  ngOnInit() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.loggedUserId = Number(userId);
    } else {
      console.error('❌ Logged User ID not found in local storage');
      return;
    }

    // ✅ Extract chatId from route parameters
    this.actRoute.paramMap.subscribe(params => {
      const chatIdParam = params.get('chatId');
      if (chatIdParam) {
        this.selectedChatId = Number(chatIdParam);
        this.loadMessages(this.selectedChatId); // ✅ Load messages for this chat
      } else {
        console.error('❌ No chatId found in the route parameters.');
      }
    });

    // ✅ Initialize WebSocket Connection
    this.socket = io('ws://localhost:4933');

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server with id:', this.socket.id);
    });

    // ✅ Listen for new messages
    this.socket.on('newMessage', (message: MessageDTO) => {
      this.loadMessages(this.selectedChatId);
    });
  }

  // ✅ Load messages for the selected chat
  loadMessages(chatId: number): void {
    this.chatService.getMessages(chatId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.scrollToBottom();
      },
      error: (error) => console.error('❌ Error loading messages:', error)
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  loadInformation(chatId: number): void {
    this.chatService.getMessages(chatId).subscribe({
      next: (messages) => {
        this.messages = messages;
      },
      error: (error) => console.error('❌ Error loading messages:', error)
    });
  }

  // ✅ Send message
  sendMessage(): void {
    console.log("masuk send message");
    if (this.newMessage.trim() === '') return;

    const messagePayload: MessageDTO = {
      sender_id: this.loggedUserId,
      chat_id: this.selectedChatId,
      text: this.newMessage,
      date_time: new Date().toISOString(),
      message_type: "",
      url:""
    };

    console.log(messagePayload.sender_id)
    console.log(messagePayload.chat_id)
    console.log(messagePayload.text)
    console.log(messagePayload.message_type)
    console.log(messagePayload.date_time)
    console.log(messagePayload.url)

    this.chatService.sendMessage(messagePayload).subscribe({
      next: (savedMessage: MessageDTO) => {
        this.messages.push(savedMessage);
        this.socket.emit('clientMessage', savedMessage); // ✅ Emit via WebSocket
      },
      error: (error) => {
        console.error('❌ Error sending message:', error);
      }
    });

    this.newMessage = ''; // ✅ Clear input field
  }

  formatTime(dateTime: string): string {
    const date = new Date(dateTime);
    const hours = date.getHours().toString().padStart(2, '0'); 
    const minutes = date.getMinutes().toString().padStart(2, '0'); 
    return `${hours}.${minutes}`; // Example: 01.50
  }
  
  formatDate(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    });
    // Example: "Wednesday, 27 February 2025"
  }
  
  shouldShowDate(messages: MessageDTO[], index: number): boolean {
    if (index === 0) return true; // Always show for the first message
  
    const currentMessageDate = new Date(messages[index].date_time).toDateString();
    const previousMessageDate = new Date(messages[index - 1].date_time).toDateString();
  
    return currentMessageDate !== previousMessageDate; // Show if different from the previous message
  }
}
