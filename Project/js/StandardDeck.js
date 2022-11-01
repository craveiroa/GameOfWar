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
            for (let v = 2; v < 15; v++) {
                var material = new THREE.MeshStandardMaterial({
                    color: 0xFFFFFF
                });
                const materials = [
                    material,
                    material,
                    material,
                    material,
                    new THREE.MeshStandardMaterial({
                        map: textureLoader.load(cardStr),
                    }),
                    new THREE.MeshStandardMaterial({
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


// 2 of spades -> ace of spades
// 1 - 13
// 2 of hearts -> ace of hearts
// 14-26
// 2 of diamonds -> ace of diamonds
// 27-39
// 2 of clubs -> ace of clubs
// 40-52