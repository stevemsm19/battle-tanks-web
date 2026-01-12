import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection!: signalR.HubConnection;

  constructor() {}

  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/chathub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connected to SignalR hub'))
      .catch(error =>
        console.error('Error starting SignalR:', error)
      );
  }

  onMessageReceived(callback: (user: string, message: string) => void): void {

  setTimeout(() => {
    callback('System', 'Conection stablished successfully');
  }, 1000);

  setTimeout(() => {
    callback('Client 1', 'This is a test message from Client 1');
  }, 3000);
}

  sendMessage(user: string, message: string): void {
    this.hubConnection
      .invoke('SendMessage', user, message)
      .catch(error =>
        console.error('Error sending message', error)
      );
  }
}