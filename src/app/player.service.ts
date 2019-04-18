import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { PLAYERS, KEYCODES } from './player-stock';
import { PlayerClass } from './player';
@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(
    private db: AngularFirestore
  ) { }

  private players: PlayerClass[] = PLAYERS;
  private keyCodes: string = KEYCODES;

  // getPlayers(): PlayerClass[] {
  //   return this.players;
  // }

  addPlayer(name: string): void {

    /** Random KeyCode **/
    // Clean Key Codes
    this.cleanKeyCodes();
    // Generate random number capped to length of key codes available
    var randomNum = Math.floor(Math.random() * 100) % (this.keyCodes.length);
    // Assign the char at random number position
    var newKeyCode = this.keyCodes.charAt(randomNum);
    // Exit without creating a player, if unique keycode not available.
    if (newKeyCode === '') return;
    var newPlayer = { name: name, keyCode: newKeyCode, color: '#341122' };
    this.players.push(newPlayer);
    this.db.collection('users').add(newPlayer);
  }

  getPlayers() {
    return this.db.collection("users").snapshotChanges();
  }

  updatePlayer(data) {
    var randomNum = Math.floor(Math.random() * 100) % (this.keyCodes.length);
    // Assign the char at random number position
    var newKeyCode = this.keyCodes.charAt(randomNum);
    return this.db
      .collection("users")
      .doc(data.payload.doc.id)
      .set({ keyCode: newKeyCode }, { merge: true });
  }

  deletePlayer(data) {
    return this.db
      .collection("users")
      .doc(data.payload.doc.id)
      .delete();
  }

  uploadFile(data) {
    this.db.collection('files').add(data);
  }

  cleanKeyCodes(): void {
    var t = this;
    t.players.forEach(function (element) {
      t.keyCodes = t.keyCodes.replace(element.keyCode, '');
    });
  }
}
