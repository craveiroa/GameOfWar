import { Deck } from "./deck";
import { Card } from "./card";
import * as Constants from './constants'

/**
 * 
 */

export class StandardDeck extends Deck {

    constructor() {
        super();

        for(let s = Constants.SPADES; s <= Constants.CLUBS; s++)
        {
            for(let v = 0; v < 13; v++ )
                this.addTop( new Card(v , s, undefined) );
        }

    }

}