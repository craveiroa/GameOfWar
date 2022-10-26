import { Deck } from "./deck";
import { Card } from "./Card";
import * as Constants from './constants'
import * as THREE from 'three';

/**
 * 
 */

export class StandardDeck extends Deck {

    constructor() {
        super();

        // load the card textures
        var textureLoader = new THREE.TextureLoader();
        var cardTxtr = 1;
        var cardStr = 'assets/' + cardTxtr + '.jpg';

        for (let s = Constants.SPADES; s <= Constants.CLUBS; s++) {
            for (let v = 0; v < 13; v++) {
                var material = new THREE.MeshBasicMaterial({
                    map: textureLoader.load(cardStr),
                });
                this.addTop(new Card(v, s, material));
                const materials = [
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    new THREE.MeshBasicMaterial({
                        map: textureLoader.load(cardStr),
                    }),
                    new THREE.MeshBasicMaterial({
                        map: textureLoader.load('assets/card_back.jpg'),
                    }),
                ];
                this.addTop(new Card(v, s, materials));
                cardTxtr++;
                cardStr = 'assets/' + cardTxtr + '.jpg';
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