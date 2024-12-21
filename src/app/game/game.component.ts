import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '../dialog/dialog.component';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, limit, orderBy } from '@angular/fire/firestore';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    GameInfoComponent,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})

export class GameComponent {

  readonly name = signal('');
  readonly dialog = inject(MatDialog);
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game = new Game();
  firestore: Firestore = inject(Firestore);
  firestoreGame: Game = new Game();


  ngOnInit(): void {
    this.newGame();
    this.subGamesList();

  }

  setGameObject(obj: any, id: string): Game {
    return new Game(
      {
        id: id,
        players: obj.players,
        stack: [], 
        playedCards: obj.playedCards,
        currentPlayer: obj.currentPlayer,
      }
    ) 
  }

  subGamesList() {
    const q = query(this.getGamesRef('games'), limit(100))
    return onSnapshot(q, (snapshot) => {
      snapshot.forEach(game => {
        this.firestoreGame = this.setGameObject(game.data(), game.id);
      });
      console.log(this.firestoreGame);

    });
  }

  getGamesRef(colId: string) {
    return collection(this.firestore, colId);
  }

  newGame(): void {
    this.game = new Game();
  }

  takeCard(): void {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop() || 'no_card.png';
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(Dialog, {
      data: { name: this.name() },
    });

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name !== undefined) {
        this.game.players.push(name);
      }
    });
  }
}
