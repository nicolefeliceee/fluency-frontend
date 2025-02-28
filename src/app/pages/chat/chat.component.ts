import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { FormsModule } from '@angular/forms';
import { MessengerComponent } from './messenger/messenger.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, MessengerComponent, HeaderComponent]
})
export class ChatComponent implements OnInit {
  chatList: any[] = [];
  selectedChatId: number | null = null;  // ✅ Store selected chat ID
  private socket!: Socket;
  loggedUserId!: number;

  constructor(
    private chatService: ChatService,
    private router: Router
  ) { }

  ngOnInit() {
    this.socket = io('ws://localhost:4933');
    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server with id:', this.socket.id);
    });

    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.loggedUserId = Number(userId);
    } else {
      console.error('❌ Logged User ID not found in local storage');
      return;
    }

    console.log(`Fetching chats for User ID: ${userId}`);
    this.chatService.getAllChats(Number(userId)).subscribe({
      next: (data) => {
        this.chatList = Array.isArray(data) ? data : data.chats || [];
      },
      error: (error) => {
        console.error('❌ Error loading chats:', error);
      }
    });
  }

  selectChat(chat: any, event: Event): void {
    event.preventDefault();
    this.selectedChatId = chat.id;
    this.router.navigate(['/chat', chat.id]);
  }
}
