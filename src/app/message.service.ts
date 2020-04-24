import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  mesasges: string[] = [];
  constructor() { }
  add(message: string) {
    this.mesasges.push(message);
  }
  clear() {
    this.mesasges = [];
  }
}
