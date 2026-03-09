import { Injectable, NgZone } from '@angular/core';
import { inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { LoginService } from '../auth/pages/login/services/login.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  private loginService = inject(LoginService);
  private ngZone = inject(NgZone);
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    this.ngZone.runOutsideAngular(() => {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${environment.apiUrl}/gameHub`, {
          accessTokenFactory: () =>
            this.loginService.getToken().then((t) => t ?? ''),
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.startConnection();
    });
  }

  public startConnection(): Promise<void> {
    if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      this.connectionPromise = this.hubConnection.start().catch((err) => {
        console.error('Error establishing SignalR connection:', err);
        throw err;
      });
    }
    return this.connectionPromise || Promise.resolve();
  }

  public on(methodName: string, callback: (...args: any[]) => void): void {
    this.hubConnection.on(methodName, (...args) => {
      console.log(`[SignalR] ${methodName}:`, ...args);
      callback(...args);
    });
  }

  public off(methodName: string): void {
    this.hubConnection.off(methodName);
  }

  public async invoke(methodName: string, ...args: any[]): Promise<any> {
    await this.startConnection();
    console.log(`[SignalR Invoke] ${methodName}:`, ...args);
    return this.hubConnection.invoke(methodName, ...args);
  }
}
