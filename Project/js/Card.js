import * as THREE from 'three';
/**
 * This is the card class. It stores basic information about
 * suit and value. Cards should be immutable, so value and suit should not be 
 * tweaked ever.
 * 
 * Author: Tones
 */
export class Card {

    value;
    suit;
    model;
    DIMENSIONS = new THREE.Vector3(0.0571 * 1.5, 0.0829 * 1.5, 0.00120);

    /**
     * Constructs a new Card Object
     * @param {number} value the cards numerical value, see Constants for Value Constants 
     * @param {number} suit the cards suit, see Deck for Constants Suit Constants
     */
    constructor(value, suit, materials) {
        this.value = value;
        this.suit = suit;
        this.model = new THREE.Mesh(
            new THREE.BoxGeometry(this.DIMENSIONS.x, this.DIMENSIONS.y, this.DIMENSIONS.z),
            materials
        );
        this.model.receiveShadow = true;
        this.model.castShadow = true;
    }

    /**
     * Returns the cards value
     * @returns number
     */
    getValue() {
        return this.value;
    }

    /**
     * Returns the cards suit
     * @returns number
     */
    getSuit() {
        return this.suit;
    }

    /**
     * Returns the cards model
     * @return mesh
     */
    getModel() {
        return this.model;
    }

    /**
     * Compares two cards values
     * @param {Card} otherCard 
     * @returns 1 if greater, -1 if less, 0 if equal
     */
    compareValue(otherCard) {
        if (this.value > otherCard.value())
            return 1;
        else if (this.value < otherCard.getValue())
            return 1;
        else
            return 0;
    }
}