import { Injectable } from '@angular/core';

import { OneSignal , OSNotification } from '@ionic-native/onesignal/ngx';

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
  this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
  this.oneSignal.handleNotificationReceived().subscribe(( noti ) => {
    console.log('Notificacion recibida', noti);
    this.notificacionRecibida( noti );
  });
  this.oneSignal.handleNotificationOpened().subscribe(( noti ) => {
    console.log('Notificación abierta')
  });
}
  notificacionRecibida( noti: OSNotification)  {
    const payload = noti.payload;
    const existePush = this.mensajes.find( mensaje => mensaje.notificationID ===
      payload?.notificationID);

      if( existePush ) {
        return
      }

      this.mensajes.unshift( payload );
  }
}
