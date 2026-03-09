import { Injectable, NgZone } from '@angular/core';
import { inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { LoginService } from '../auth/pages/login/services/login.service';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  private loginService = inject(LoginService);
  private ngZone = inject(NgZone);

  constructor() {
    this.ngZone.runOutsideAngular(() => {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5000/gameHub', {
          accessTokenFactory: () =>
            this.loginService.getToken().then((t) => t ?? ''),
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.startConnection();
    });
  }

  private connectionPromise: Promise<void> | null = null;

  public startConnection = () => {
    if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      this.connectionPromise = this.hubConnection.start().catch((err) => {
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
    return this.invoke('JoinGame', roomId).catch((err) =>
      console.error('Error joining game: ' + err),
    );
  };

  public leaveGame = (roomId: string) => {
    return this.invoke('LeaveGame', roomId).catch((err) =>
      console.error('Error leaving game: ' + err),
    );
  };

  public joinSearchRoom = () => {
    return this.invoke('JoinSearchRoomGroup').catch((err) =>
      console.error('Error joining SearchRoom group: ' + err),
    );
  };

  public leaveSearchRoom = () => {
    return this.invoke('LeaveSearchRoomGroup').catch((err) =>
      console.error('Error leaving SearchRoom group: ' + err),
    );
  };

  public onBulletSpawned(callback: (bullet: any) => void): void {
    this.hubConnection?.on('BulletSpawned', callback);
  }

  public offBulletSpawned(): void {
    this.hubConnection?.off('BulletSpawned');
  }

  public off(methodName: string) {
    this.hubConnection.off(methodName);
  }

  public on(methodName: string, newMethod: (...args: any[]) => void) {
    this.hubConnection.on(methodName, (...args) => {
      console.log(`[SignalR Notification] ${methodName}:`, ...args);
      newMethod(...args);
    });
  }

  public async invoke(methodName: string, ...args: any[]) {
    await this.startConnection();
    console.log(`[SignalR Invoke] ${methodName}:`, ...args);
    return this.hubConnection.invoke(methodName, ...args);
  }
}
