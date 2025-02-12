import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, limit, orderBy } from '@angular/fire/firestore';
import { Game } from '../../models/game';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {

  constructor(private firestore: Firestore,private router: Router){

  }

  newGame(){
    let game = new Game;
    this.addGame(game.toJson(), 'games');
  }

  async addGame(item: object, colId: 'games') {
    await addDoc(this.getGamesRef(colId), item).catch(
      (err) => { console.log(err) }
    ).then( (gameInfo: any) => {
      this.router.navigateByUrl('/game/' + gameInfo.id);
    });
  }

  getGamesRef(colId: string) {
    return collection(this.firestore, colId);
  }
}
