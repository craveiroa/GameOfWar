/**
 * 
 */
export class Deck {

    constructor() {
        this.cards = [];
    }

    getSize() {
        return cards.length;
    }

    isEmpty() {
        return (this.cards.length == 0)
    }

    peekTop() {
        if (!this.isEmpty())
            return cards[this.cards.length - 1];
        else
            console.error('Deck is empty, nothing to peek at')

        return undefined;
    }

    peekBottom() {
        if (!this.isEmpty())
            return cards[0];
        else
            console.error('Deck is empty, nothing to peek at')

        return undefined;
    }

    takeTop() {
        if (!this.isEmpty())
            return this.cards.pop();
        else
            console.error('Deck is empty, nothing to take')
        return undefined;
    }

    takeBottom() {
        if (!this.isEmpty())
            return this.cards.shift();
        else
            console.error('Deck is empty, nothing to take')
        return undefined;
    }

    addTop(card) {
        this.cards.push(card);
    }

    addBottom(card) {
        this.cards.unshift(card);
    }

    swap(p1, p2) {
        let temp = this.cards[p1];
        this.cards[p1] = this.cards[p2];
        this.cards[p2] = temp;
    }

    shuffle() {
        for (let i = 0; i < this.cards.length; i++)
        {
            let r = i + Math.floor(Math.random() * (this.cards.length - i));

            this.swap(i, r);
        }
    }
    
}