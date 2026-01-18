import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection: HubConnection;

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://serverurl/gamehub')
      .withAutomaticReconnect()
      .build();

    this.startConnection();
  }

  private startConnection() {
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.log('Error while starting connection: ' + err));
  }

  public on(methodName: string, newMethod: (...args: any[]) => void) {
    this.hubConnection.on(methodName, newMethod);
  }

  public invoke(methodName: string, ...args: any[]) {
    return this.hubConnection.invoke(methodName, ...args);
  }
}
