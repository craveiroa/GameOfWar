import '../style.css';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'

import {Deck} from './deck';
import {StandardDeck} from './standardDeck';
import { Mesh } from 'three';
import { Card } from './card';

//Graphics World
let scene, camera, renderer;
let gameCanvas = document.getElementById('gameOfWar');
let cardGeometry, cardMaterial;

//Logic Stuff
let startDeck;
let playerDecks = []; //players hands
let tableDecks = []; //players cards on table
let numPlayers = 2;
let start = false;


const CARD_THICKNESS = 0.00024;

/**
 * Startup Function
 */
function main() {

  loadAssets();
  initGraphics();
  initController();

  loop();

} //end of main

/**
 * Preloads all assets (textures and models)
 */
function loadAssets() {

} //end of loadAssets


/**
 * creates a deck, and generates cards if it contains them
 * @param {Deck} deck deck to be projected into the world
 */
function createDeckModel(deck) {
  let deckModel = new THREE.Group();
  deck.userData = deck;

  if(deck.isEmpty())
    return deckModel;

  let offset = 0;
  for(let i = 0; i < deck.getSize(); i++)
  {

    let card = deck.lookAt(i);
    let cardModel = createCardModel(card, undefined);

    cardModel.position.z = offset;

    deckModel.add(cardModel);

    offset += CARD_THICKNESS;

  } //end of for

  return deckModel;

} //end of createdeckModel 

/**
 * builds the view the user will see
 */
function initGraphics() {

  //Scene

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  //Camera

  camera = new THREE.PerspectiveCamera(90, gameCanvas.clientWidth/gameCanvas.clientHeight, 0.1, 1000);
  camera.name = 'camera';
  camera.position.z = 0.2;
  camera.position.y = 0.2;
  camera.lookAt(new THREE.Vector3(0,0,0));

  scene.add(camera);

  //Lighting

  let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
  scene.add(ambientLight);

  let pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.y = 5.0;

  scene.add(pointLight);

  let deck = new StandardDeck();
  scene.add(deck.model);
  deck.model.position.x = -0.4;

  deck.takeTop();
  //Renderer

  renderer = new THREE.WebGLRenderer({
    canvas: gameCanvas,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(gameCanvas.clientWidth, gameCanvas.clientHeight);

  console.log(scene);

} //end of initGraphics

//Here We make our game :) 

/**
 * reset the game
 */
function reset() {

} //end of reset

/**
 * Starts the game if it hasnt been started already
 */
function startGame() {

} //end of startGame

/**
 * starts the next turn sequence
 */
function startTurn() {

} //end of startTurn


/**
 * Ends the game, typically when a player wins
 */
function endGame() {
 
} //end of endGame

/**
 * Creates the contoller for the user to interact
 * with the view.
 */
function initController() {
  document.onkeydown = function (e) {
    switch (e.key) {
      case 'n':
      case 'N':
        break;
      case 'r':
      case 'R':
        break;
    }
  }
} //end of initController

/**
 * This is where the game and its events occur
 */
function loop(t) {

  TWEEN.update(t);
  render();
  
  window.requestAnimationFrame(loop);

} //end of loop

/**
 * A basic render method, in case special steps
 * must be taken during a single render.
 */
function render() {
  renderer.render(scene, camera);
} //end of render

main();