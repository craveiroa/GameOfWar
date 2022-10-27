import { Card } from "./Card";
import * as THREE from 'three';

/**
 * This is the Deck Class. It stores an array of 0
 * or more cards, and can be used to do basic card
 * manipulations.
 */
export class Deck {

    model;
    cards;

    /**
     * Generates an empty Deck
     */
    constructor() {
        this.model = new THREE.Group();
        this.model.rotateX(Math.PI / 2);
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
        return (this.getSize() == 0)
    }

    /**
     * Reveals the top card without removing it from the deck
     * @returns {Card} Card
     */
    peekTop() {
        if (!this.isEmpty())
            return this.cards[this.cards.length - 1];
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
            return this.cards[0];
        else
            console.error('Deck is empty, nothing to peek at')
        return undefined;
    }

    /**
     * Removes the top card from the deck and returns it
     * @returns {Card} Card
     */
    takeTop() {
        if (!this.isEmpty()) {
            let card = this.cards.pop();
            this.model.remove(card.model);
            return card;
        }
        else
            console.error('Deck is empty, nothing to take')
        return undefined;
    }

    /**
     * Removes the bottom card from the deck and returns it
     * @returns {Card} Card
     */
    takeBottom() {
        if (!this.isEmpty()) {
            let card = this.cards.shift();
            this.model.remove(card.model);
            return card;
        }
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

        for (let i = 0; i < this.getSize(); i++)
            this.cards[i].model.position.set(0, 0, -card.DIMENSIONS.z * i);

        this.model.add(card.model);
    }

    /**
     * Adds a card to the bottom of the Deck
     * @param {Card} card 
     */
    addBottom(card) {

        this.cards.unshift(card);

        let cardModel = card.model;
        cardModel.position.set(0, 0, -card.DIMENSIONS.z * this.cards.length);
        this.model.add(cardModel);
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
        let tempPosition = this.cards[p1].model.position.clone();

        this.cards[p1].model.position.set(
            this.cards[p2].model.position.x,
            this.cards[p2].model.position.y,
            this.cards[p2].model.position.z,
        );

        this.cards[p2].model.position.set(
            tempPosition.x,
            tempPosition.y,
            tempPosition.z,
        );

        this.cards[p1] = this.cards[p2];
        this.cards[p2] = temp;
    }

    /**
     * Shuffles the deck
     */
    shuffle() {

        let tweens = []; //pool of tweens

        for (let i = 0; i < this.cards.length; i++) {
            let r = i + Math.floor(Math.random() * (this.cards.length - i));

            this.swap(i, r);
        }

    }

    /**
     * Empties the deck
     */
    clear() {
        while (!this.isEmpty()) {
            let card = this.cards.pop()
            this.model.remove(card.model);
        }
    }

    /**
     * Flips a given card face up
     */
    flipTopUp() {
        if (!this.isEmpty())
            this.peekTop().model.rotation.set(Math.PI, 0, 0)
        else
            console.error('Deck is empty, nothing to flip')
    }

    /**
     * Flips a given card face down
     */
    flipTopDown() {
        if (!this.isEmpty())
            this.peekTop().model.rotation.set(0, 0, 0)
        else
            console.error('Deck is empty, nothing to flip')
    }
}