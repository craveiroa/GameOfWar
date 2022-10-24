import { Deck } from "./deck";
import { Card } from "./card";
import * as Constants from './constants'
import * as THREE from 'three';

/**
 * 
 */

export class StandardDeck extends Deck {

    constructor() {
        super();

        const textures = {};

        var cardTxtr = 12;

        var cardStr = 'assets/' + cardTxtr + '.jpg'

        // load the card textures
        var textureLoader = new THREE.TextureLoader();

        for (let s = Constants.SPADES; s <= Constants.CLUBS; s++) {
            for (let v = 1; v < 14; v++) {
                var material = new THREE.MeshBasicMaterial({
                    map: textureLoader.load(cardStr),
                });
                this.addTop(new Card(v, s, material));
                cardTxtr += 1;
            }
        }

    }

}


// ace of spades -> king of spades
// 1 - 13
// ace of hearts -> king of hearts
// 14-26
// ace of diamonds -> king of diamonds
// 27-39
// ace of clubs -> king of clubs
// 40-52