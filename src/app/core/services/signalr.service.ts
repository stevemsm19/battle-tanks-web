import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/gameHub')
      .withAutomaticReconnect()
      .build();

    this.startConnection();
  }

  public startConnection = () => {
    if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      this.hubConnection
        .start()
        .then(() => console.log('SignalR Connection started'))
        .catch((err) =>
          console.log('Error establishing SignalR connection: ' + err),
        );
    }
  };

  public addMessageListener = (
    callback: (user: string, message: string) => void,
  ) => {
    this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
      console.log(`User: ${user}, Message: ${message}`);
      callback(user, message);
    });
  };

  public joinGame = (roomId: string) => {
    return this.hubConnection
      .invoke('JoinGame', roomId)
      .catch((err) => console.error('Error joining game: ' + err));
  };

  public leaveGame = (roomId: string) => {
    return this.hubConnection
      .invoke('LeaveGame', roomId)
      .catch((err) => console.error('Error leaving game: ' + err));
  };

  public on(methodName: string, newMethod: (...args: any[]) => void) {
    this.hubConnection.on(methodName, newMethod);
  }

  public invoke(methodName: string, ...args: any[]) {
    return this.hubConnection.invoke(methodName, ...args);
  }
}
