import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MessageDTO {
  sender_id: number;
  chat_id: number;
  text: string;
  date_time: string;
  message_type: string;
  url: string;
}

export interface userDTO {
  id?: number;
  sender_id: number;
  senderName?: string; // optional
  chat_id: number;
  text: string;
  date_time?: string;   // ISO formatted date-time string
  mmessage_type: string; // e.g., "sent" or "received"
  url?: string;
}


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private httpClient: HttpClient) { }

  baseUrl = environment.baseUrl;

  getAllChats(loggedId: number): Observable<any> {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      throw new Error('Logged User ID not found in local storage.');
    }
    const params = new HttpParams().set('userId', userId);
    return this.httpClient.get(`${this.baseUrl}/chat`, { params });
  }

    // Send a new message via POST
    sendMessage(message: MessageDTO): Observable<MessageDTO> {
      return this.httpClient.post<MessageDTO>(`${this.baseUrl}/chat/send`, message);
    }
  
    // Retrieve all messages for a given chat
    getMessages(chatId: number): Observable<MessageDTO[]> {
      return this.httpClient.get<MessageDTO[]>(`${this.baseUrl}/chat/${chatId}`);
    }

    // Retrieve messages profile
    getMessagesProfile(chatId: number): Observable<MessageDTO[]> {
      return this.httpClient.get<MessageDTO[]>(`${this.baseUrl}/chat/${chatId}`);
    }
}
