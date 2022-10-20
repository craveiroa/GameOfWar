/**
 * This is the card class. It stores basic information about
 * suit and value. Cards should be immutable, so value and suit should not be 
 * tweaked ever.
 * 
 * Author: Tones
 */
export class Card {

    VALUE;
    SUIT;

    /**
     * Constructs a new Card Object
     * @param {number} value the cards numerical value, see Constants for Value Constants 
     * @param {number} suit the cards suit, see Deck for Constants Suit Constants
     */
    constructor(value, suit) {
        this.VALUE = value;
        this.SUIT = suit;
    }

    /**
     * Returns the cards value
     * @returns number
     */
    getValue() {
        return this.VALUE;
    }

    /**
     * Returns the cards suit
     * @returns 
     */
    getSuit() {
        return this.SUIT;
    }
}