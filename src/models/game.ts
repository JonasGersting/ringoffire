export class Game {
    public id: string = '';
    public players: string[] = [];
    public stack: string[] = [];
    public playedCards: string[] = [];
    public currentPlayer: number = 0;
    public pickCardAnimation: boolean = false;
    public currentCard: string = '';

    constructor(gameData?: Partial<Game>) {
        if (gameData) {
            Object.assign(this, gameData)
        }

        for (let i = 1; i < 14; i++) {
            this.stack.push(`ace_${i}.png`);
            this.stack.push(`clubs_${i}.png`);
            this.stack.push(`hearts_${i}.png`);
            this.stack.push(`diamonds_${i}.png`);
        }
        shuffle(this.stack)
    }

    public toJson() {
        return {
            players: this.players || [],
            stack: this.stack || [],
            playedCards: this.playedCards || [],
            currentPlayer: this.currentPlayer || 0,
            pickCardAnimation: this.pickCardAnimation || false,
            currentCard: this.currentCard || '',
        }
    }

}


function shuffle(array: any) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

