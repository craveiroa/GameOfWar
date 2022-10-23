import { Card } from "./card";

/**
 * This is the Deck Class. It stores an array of 0
 * or more cards, and can be used to do basic card
 * manipulations.
 */
export class Deck {

    /**
     * Generates an empty Deck
     */
    constructor() {
        this.cards = [];
    }

    /**
     * Returns size of the deck
     * @returns number
     */
    getSize() {
        return this.cards.length;
    }

    /**
     * Boolean on if the deck is empty
     * @returns true if deckSize = 0, false otherwise
     */
    isEmpty() {
        return (this.cards.length == 0)
    }

    /**
     * Reveals the top card without removing it from the deck
     * @returns {Card} Card
     */
    peekTop() {
        if (!this.isEmpty())
            return cards[this.cards.length - 1];
        else
            console.error('Deck is empty, nothing to peek at')

        return undefined;
    }

    /**
     * Reveals the bottom card without removing it from the deck
     * @returns {Card} Card
     */
    peekBottom() {
        if (!this.isEmpty())
            return cards[0];
        else
            console.error('Deck is empty, nothing to peek at')

        return undefined;
    }

    /**
     * Removes the top card from the deck and returns it
     * @returns {Card} Card
     */
    takeTop() {
        if (!this.isEmpty())
            return this.cards.pop();
        else
            console.error('Deck is empty, nothing to take')
        return undefined;
    }

    /**
     * Removes the bottom card from the deck and returns it
     * @returns {Card} Card
     */
    takeBottom() {
        if (!this.isEmpty())
            return this.cards.shift();
        else
            console.error('Deck is empty, nothing to take')
        return undefined;
    }

    /**
     * Adds a card to the top of the Deck
     * @param {Card} card
     */
    addTop(card) {
        this.cards.push(card);
    }

    /**
     * Adds a card to the bottom of the Deck
     * @param {Card} card 
     */
    addBottom(card) {
        this.cards.unshift(card);
    }

    /**
     * peeks at the card specified by the index
     * @param {number} idx 
     */
    lookAt(idx) {
        return this.cards[idx];
    }

    /**
     * Swaps the positions of two cards, given the position
     * in the Deck.
     * @param {number} p1 index of first card
     * @param {number} p2 index of second card
     */
    swap(p1, p2) {
        let temp = this.cards[p1];
        this.cards[p1] = this.cards[p2];
        this.cards[p2] = temp;
    }

    /**
     * Shuffles the deck
     */
    shuffle() {
        for (let i = 0; i < this.cards.length; i++)
        {
            let r = i + Math.floor(Math.random() * (this.cards.length - i));

            this.swap(i, r);
        }
    }
    
}