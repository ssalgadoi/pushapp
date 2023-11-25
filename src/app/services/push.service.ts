import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes :any[] = [
    {
      title: 'Titulo de la push',
      body: 'Este es el Body de la push',
      date: new Date()
    }
  ]

  constructor( private oneSignal: OneSignal) { }

configuracionInicial() {
  this.oneSignal.startInit('', '');
  this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
  this.oneSignal.handleNotificationReceived().subscribe(( noti ) => {
    console.log('Notificacion recibida', noti);
  });
  this.oneSignal.handleNotificationOpened().subscribe(( noti ) => {
    console.log('Notificación abierta')
  });
}
}
