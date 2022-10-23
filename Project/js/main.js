import '../style.css';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'

import {Deck} from './deck';
import {StandardDeck} from './standardDeck';
import { Mesh } from 'three';

let scene, camera, renderer;

let gameCanvas = document.getElementById('gameOfWar');

let cardGeometry, cardMaterial;

let myDeck, otherDeck;

let myDeckModel, otherDeckModel;

let testTween;

const CARD_THICKNESS = 0.00024;

/**
 * Startup Function
 */
function main() {

  loadAssets();
  initLogic();
  initGraphics();
  initController();

  gameLoop();

} //end of main

/**
 * Preloads all assets (textures and models)
 */
function loadAssets() {

  cardGeometry = new THREE.BoxGeometry(0.0571, 0.0829, CARD_THICKNESS); //numbers come from real card

  cardMaterial = new THREE.MeshStandardMaterial({
    color:0xFFFFFF
  });
} //end of loadAssets

/**
 * Generates the model world we will project in
 * the graphics world
 */
function initLogic() {
  myDeck = new StandardDeck();
  otherDeck = new Deck();
  
  myDeck.shuffle();

  console.log(myDeck);
  console.log(otherDeck);

} //end of initLogic

/**
 * creates a card given a Card and a texture
 */
function createCardModel(card, texture) {
  let mesh = new THREE.Mesh(cardGeometry, cardMaterial);
  mesh.userData = card;
  return mesh;
} //end of createCardModel

/**
 * creates a deck, and generates cards if it contains them
 * @param {Deck} deck deck to be projected into the world
 */
function createDeckModel(deck) {
  let deckModel = new THREE.Group();

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

  //Geometry

  myDeckModel = createDeckModel(myDeck)
  myDeckModel.rotateX(Math.PI/2);
  myDeckModel.position.x -= 0.1;

  scene.add(myDeckModel);

  otherDeckModel = createDeckModel(otherDeck);
  otherDeckModel.rotateX(Math.PI/2);
  otherDeckModel.position.x += 0.1;

  scene.add(otherDeckModel);

  testTween = new TWEEN.Tween({
    x: myDeckModel.position.x,
    y: myDeckModel.position.y,
    z: myDeckModel.position.z});
  testTween.to({
    x: otherDeckModel.position.x,
    y: otherDeckModel.position.y,
    z: otherDeckModel.position.z
  }, 2000);
  testTween.onUpdate((coords) => {
    myDeckModel.position.x = coords.x;
    myDeckModel.position.y = coords.y;
    myDeckModel.position.z = coords.z;
  });
  testTween.easing(TWEEN.Easing.Exponential.InOut)

  //let tableGeometry = new THREE.BoxGeometry(2, 0.05, 0.5);

  //Material

 /* let tableMaterial = new THREE.MeshStandardMaterial({
    color: 0xC04000
  });

  let table = new THREE.Mesh(tableGeometry, tableMaterial);
  table.position.y -= .1;
  scene.add(table);
 */

  //Renderer

  renderer = new THREE.WebGLRenderer({
    canvas: gameCanvas,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(gameCanvas.clientWidth, gameCanvas.clientHeight);

  console.log(scene)

} //end of initGraphics

/**
 * Creates the contoller for the user to interact
 * with the view.
 */
function initController() {
  document.onkeydown = function (e) {
    switch (e.key) {
      case 'n':
        testTween.start();
      break;
    }
  }
} //end of initController

/**
 * This is where the game and its events occur
 */
function gameLoop(t) {

  TWEEN.update(t);
  render();
  
  window.requestAnimationFrame(gameLoop);

} //end of gameLoop

/**
 * A basic render method, in case special steps
 * must be taken during a single render.
 */
function render() {
  renderer.render(scene, camera);
} //end of render

main();