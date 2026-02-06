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
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.startConnection();
  }

  private connectionPromise: Promise<void> | null = null;

  public startConnection = () => {
    if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      this.connectionPromise = this.hubConnection
        .start()
        .catch((err) => {
          console.error('Error establishing SignalR connection: ' + err);
          throw err;
        });
    }
    return this.connectionPromise || Promise.resolve();
  };

  public addMessageListener = (
    callback: (user: string, message: string) => void,
  ) => {
    this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
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
    this.hubConnection.on(methodName, (...args) => {
      newMethod(...args);
    });
  }

  public async invoke(methodName: string, ...args: any[]) {
    await this.startConnection();
    return this.hubConnection.invoke(methodName, ...args);
  }
}
