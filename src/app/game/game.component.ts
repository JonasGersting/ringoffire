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
import { ActivatedRoute } from '@angular/router';
import { PlayerMobileComponent } from "../player-mobile/player-mobile.component";

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
    PlayerMobileComponent
],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})

export class GameComponent {

  readonly name = signal('');
  readonly dialog = inject(MatDialog);
  
  game: Game = new Game();
  gameId: string = '';
  firestore: Firestore = inject(Firestore);
  firestoreGame: Game = new Game();

constructor (private route: ActivatedRoute) {}


  ngOnInit(): void {  
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      this.getGameById(this.gameId);
      
    })
    

  }

  getGameById(id: string): void {
    // Referenz zum spezifischen Dokument mit der ID
    const gameDocRef = doc(this.firestore, `games/${id}`);
    
    // Verwende onSnapshot, um Änderungen des Spiels in Echtzeit zu abonnieren
    onSnapshot(gameDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        // Das Spiel-Dokument existiert, also konvertiere es in ein Game-Objekt
        this.firestoreGame = this.setGameObject(docSnapshot.data(), docSnapshot.id);
        this.game = this.firestoreGame;
        // this.game.currentPlayer = this.firestoreGame.currentPlayer;
        // this.game.playedCards = this.firestoreGame.playedCards;
        // this.game.players = this.firestoreGame.players;
        // this.game.stack = this.firestoreGame.stack;
        // this.game.pickCardAnimation = this.firestoreGame.pickCardAnimation;
        // this.game.currentCard = this.firestoreGame.currentCard;
      } else {
        console.log("Kein Spiel mit dieser ID gefunden.");
      }
    });
  }

  setGameObject(obj: any, id: string): Game {
    return new Game({
        id: id,
        players: obj.players || [],
        stack: obj.stack || [],
        playedCards: obj.playedCards || [],
        currentPlayer: obj.currentPlayer || 0,
        pickCardAnimation: obj.pickCardAnimation || false,
        currentCard: obj.currentCard || '',
    });
}




  newGame(): void {
    this.game = new Game();
  }

 

  takeCard(): void {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop() || 'no_card.png';
      this.game.pickCardAnimation = true;
      
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      // this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        console.log(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
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
        this.saveGame();
      }
    });
  }

  async saveGame() {
    const gameData = this.game.toJson();
    console.log('Speichere Spiel:', gameData); // Debugging
    const gameRef = doc(this.firestore, `games/${this.gameId}`);
    await updateDoc(gameRef, gameData);
}










}
