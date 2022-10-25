import '../style.css';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'

import { Deck } from './Deck';
import { StandardDeck } from './StandardDeck';
import { Card } from './card';
import { FlyControls } from 'three/addons/controls/FlyControls.js';


//Graphics World
let scene, camera, renderer;
let gameCanvas = document.getElementById('gameOfWar');
let cardGeometry, cardMaterial;
let flycontrols;

//Logic Stuff
let startDeck;
let playerDecks = []; //players hands
let tableDecks = []; //players cards on table
let numPlayers = 3;
let gameStart = false;
let inTurn = false;


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
 * builds the view the user will see
 */
function initGraphics() {

  //Scene

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  //Camera

  camera = new THREE.PerspectiveCamera(90, gameCanvas.clientWidth / gameCanvas.clientHeight, 0.1, 1000);
  camera.name = 'camera';
  camera.position.z = 0.5;
  camera.position.y = 0.5;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  scene.add(camera);

  //Lighting

  let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
  scene.add(ambientLight);

  let pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.y = 5.0;

  scene.add(pointLight);

  // Game models

  //Table

  //Decks

  startDeck = new StandardDeck();
  scene.add(startDeck.model);

  let spacing = (Math.PI * 2) / numPlayers;
  let outerRadius = 0.5;
  let innerRadius = 0.25;

  for (let i = 0; i < numPlayers; i++) {
    let hand = new Deck();
    playerDecks.push(hand);

    let value = spacing * i;
    hand.model.position.set(Math.cos(value) * outerRadius, 0, Math.sin(value) * outerRadius);

    let tabled = new Deck(); //cards that are on table
    tableDecks.push(tabled);

    tabled.model.position.set(Math.cos(value) * innerRadius, 0, Math.sin(value) * innerRadius);

    scene.add(hand.model);
    scene.add(tabled.model);

  }//end of for

  // Fly controls

  flycontrols = new FlyControls(camera, document.body);

  flycontrols.autoForward = false;
  flycontrols.movementSpeed = 0.05;


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
  scene.remove(startDeck.model);
  startDeck = new StandardDeck();
  scene.add(startDeck.model);

  for (let i = 0; i < numPlayers; i++) {
    playerDecks[i].clear();
    tableDecks[i].clear();
  }

  gameStart = false;

} //end of reset

/**
 * Starts the game if it hasnt been started already
 * @return {boolean} true if game starts, false otherwise
 */
function startGame() {
  if (gameStart)
    return false;

  gameStart = true;

  startDeck.shuffle();

  let i = 0;
  while (!startDeck.isEmpty()) {
    let card = startDeck.takeTop();
    playerDecks[i].addBottom(card);
    i = (i + 1) % numPlayers;
  }

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
        startGame();
        break;
      case 'r':
      case 'R':
        reset();
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

  flycontrols.update(0.1);

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