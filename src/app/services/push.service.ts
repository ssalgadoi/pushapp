import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage';
import { OneSignal , OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';


@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes :OSNotificationPayload[] = [
    // {
      // title: 'Titulo de la push',
      // body: 'Este es el Body de la push',
      // date: new Date()
    // }
  ];

  userId: string = '';

  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(
    private oneSignal: OneSignal,
    private storage: Storage ) {
      this.cargarMensajes();
     }

     async getMensajes() {
      await this.cargarMensajes();
      return [...this.mensajes];
     }
configuracionInicial() {
  this.oneSignal.startInit('', '');

  this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

  this.oneSignal.handleNotificationReceived().subscribe(( noti ) => {
    console.log('Notificacion recibida', noti);
    this.notificacionRecibida( noti );
  });

  this.oneSignal.handleNotificationOpened().subscribe( async ( noti ) => {
    console.log('Notificación abierta', noti);
    await this.notificacionRecibida( noti.notification );
  });

  //Obtener id del subcriptor
  this.oneSignal.getIds().then( info => {
    this.userId = info.userId;
    console.log(this.userId);
  });
  this.oneSignal.endInit();
}
  async notificacionRecibida( noti: OSNotification)  {

    await this.cargarMensajes();

    const payload = noti.payload;
    if (!payload) {
      console.log('Payload de notificación es undefined');
      return;
    }

    const existePush = this.mensajes.find( mensaje => mensaje.notificationID ===
      payload.notificationID);

      if( existePush ) {
        return
      }

      this.mensajes.unshift( payload );
      this.pushListener.emit( payload );

      await this.guardarMensajes();

  }

  guardarMensajes() {
    this.storage.set('mensajes', this.mensajes);
  }

  async cargarMensajes(){

    this.mensajes =  await this.storage.get('mensajes') || [];

    return this.mensajes;
  }
}
