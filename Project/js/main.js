import '../style.css';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'

import * as CONSTANTS from './constants.js';
import { Card } from './Card.js';
import { Deck } from './Deck.js';
import { StandardDeck } from './StandardDeck.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


//Graphics World
let scene, camera, renderer;
let gameCanvas = document.getElementById('gameOfWar');
let cardGeometry, cardMaterial;
let orbitControls;
let pointX;
let pointZ;
let pointLight;
let ambientLight;
let ambientOn = true;
let pointOn = true;

//Logic Stuff
let startDeck;
let playerDecks = []; //players hands
let tableDecks = []; //players cards on table
let playersInPlay = [];
let numPlayers = 3;
let gameStart = false;
let inTurn = false;

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

  ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambientLight);

  pointX = 0;
  pointZ = 0;
  pointLight = new THREE.PointLight(0xFFFFFF, 1);
  pointLight.position.set(0, 2, 0);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 2000;
  pointLight.shadow.mapSize.height = 2000;
  scene.add(pointLight);

  // Game models

  //Table

  var textureLoader = new THREE.TextureLoader();

  const tableGeometry = new THREE.CylinderGeometry(0.7, 0.7, 0.05, 32);
  const tableMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('assets/wood.jpeg'),
  });
  const table = new THREE.Mesh(tableGeometry, tableMaterial);
  table.position.setY(-0.025);
  table.receiveShadow = true;
  scene.add(table)

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

    playersInPlay.push(i);

  }//end of for

  // Orbit controls

  orbitControls = new OrbitControls(camera, document.body);

  //Renderer

  renderer = new THREE.WebGLRenderer({
    canvas: gameCanvas,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(gameCanvas.clientWidth, gameCanvas.clientHeight);
  renderer.shadowMap.enabled = true;

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

  playersInPlay = []

  for (let i = 0; i < numPlayers; i++) {
    playerDecks[i].clear();
    tableDecks[i].clear();

    playersInPlay.push(i);
  }

  gameStart = false;

} //end of reset

/**
 * Starts the game if it hasnt been started already
 * @return {boolean} true if game starts, false otherwise
 */
async function startGame() {
  if (gameStart)
    return false;

  gameStart = true;

  startDeck.shuffle();


  let i = 0;
  while (!startDeck.isEmpty()) {
    let card = startDeck.takeTop();

    //card.model.rotation.set(Math.PI / 2, 0, 0)

    scene.add(card.model);
    /*
        let beginX = card.model.position.x;
        let beginY = card.model.position.y;
        let beginZ = card.model.position.z;
        let endX = playerDecks[i].model.position.x;
        let endY = playerDecks[i].model.position.y + card.DIMENSIONS.z * (playerDecks[i].getSize() + 2);
        let endZ = playerDecks[i].model.position.z;
    
        const tw = new TWEEN.Tween({ x: beginX, y: beginY, z: beginZ, i: i, card: card })
          .to({ x: endX, y: endY, z: endZ }, 1000)
          .easing(TWEEN.Easing.Exponential.Out)
          .onUpdate((tween) => {
            tween.card.model.position.x = tween.x;
            tween.card.model.position.y = tween.y;
            tween.card.model.position.z = tween.z;
          })
          .onComplete((tween) => {
            tween.card.model.rotation.set(0, 0, 0);
            tween.card.model.position.set(0, 0, card.DIMENSIONS.z * playerDecks[tween.i].getSize());
            
          });
        tw.start();
    */

    playerDecks[i].addTop(card);
    i = (i + 1) % numPlayers;
  }
  await delay(1100);

} //end of startGame

/**
 * starts the next turn sequence
 */
async function startTurn() {

  if (inTurn)
    return;

  inTurn = true;

  // Remove players from play with no cards

  for (let i = 0; i < playersInPlay.length; i++) {
    let plr = playersInPlay[i];

    if (playerDecks[plr].isEmpty())
      playersInPlay.splice(i, 1);
  }

  // Check if there is only one plr with cards remaining.
  if (playersInPlay.length == 1) {
    // If there is only one plr with cards, declare a winner.
    endGame(playersInPlay[0] + 1);
  }

  // If there is more than one deck with cards remaining then 
  // play out a turn with those decks
  for (let i = 0; i < playersInPlay.length; i++) {

    let plr = playersInPlay[i];

    // Place top card on table
    let card = playerDecks[plr].takeTop();
    scene.add(card.model);

    /*
    let beginX = playerDecks[i].model.position.x;
    let beginY = playerDecks[i].model.position.y;
    let beginZ = playerDecks[i].model.position.z;
    let endX = tableDecks[i].model.position.x;
    let endY = tableDecks[i].model.position.y;
    let endZ = tableDecks[i].model.position.z;


    const tw = new TWEEN.Tween({ x: beginX, y: beginY, z: beginZ, i: i, card: card })
      .to({ x: endX, y: endY, z: endZ }, 1000)
      .easing(TWEEN.Easing.Exponential.Out)
      .onUpdate((tween) => {
        tween.card.model.position.x = tween.x;
        tween.card.model.position.y = tween.y;
        tween.card.model.position.z = tween.z;
      })
      .onComplete((tween) => {
        tween.card.model.rotation.set(0, 0, 0);
        tween.card.model.position.set(0, 0, card.DIMENSIONS.z * tableDecks[tween.i].getSize());
        tableDecks[tween.i].addTop(tween.card);
      });
    tw.start();

    await delay(100);
    */

    tableDecks[plr].addTop(card);
  }

  await delay(1000);

  // Flip each card face up
  playersInPlay.forEach((plr) => {
    tableDecks[plr].flipTopUp();
  });

  await delay(1000);

  // Is one greater than the others?
  let isWar = false;
  let greatestValue = -1;
  let winningPlr = -1; //plr with greatest card

  playersInPlay.forEach((plr) => {
    let topCard = tableDecks[plr].peekTop();

    if (topCard.value > greatestValue) {
      greatestValue = topCard.value;
      winningPlr = plr;
      isWar = false;
    }
    else if (topCard.value == greatestValue) {
      isWar = true;
    }
  });

  await delay(1000)

  playersInPlay.forEach((plr) => {
    tableDecks[plr].flipTopDown();
  });

  await delay(1000)


  console.log(isWar);

  while (isWar) {

    greatestValue = -1;
    winningPlr = -1;
    isWar = false;

    for (let i = 0; i < playersInPlay.length; i++) {
      let plr = playersInPlay[i];

      for (let j = 0; j < 2; j++) {
        if (!playerDecks[plr].isEmpty()) {
          let card = playerDecks[plr].takeTop();
          scene.add(card.model);
          tableDecks[plr].addTop(card);
          await delay(500)

        }
      }
    }

    await delay(3000)

    playersInPlay.forEach((plr) => {
      tableDecks[plr].flipTopUp();
    });

    await delay(3000)


    playersInPlay.forEach((plr) => {

      let topCard = tableDecks[plr].peekTop();

      if (topCard.value > greatestValue) {
        greatestValue = topCard.value;
        winningPlr = plr;
        isWar = false;
      }
      else if (topCard.value == greatestValue) {
        isWar = true;
      }
    });

  }

  playersInPlay.forEach((plr) => {
    tableDecks[plr].flipTopDown();
  });

  await delay(1000)


  //move all cards on table to winners deck
  let winnerDeck = playerDecks[winningPlr];

  playersInPlay.forEach((plr) => {
    let tabled = tableDecks[plr];

    while (!tabled.isEmpty()) {
      let card = tabled.takeTop();
      winnerDeck.addBottom(card);
    }

  });

  console.log(playerDecks);
  inTurn = false;
} //end of startTurn


/**
 * Ends the game, typically when a player wins
 */
function endGame(winner) {
  console.log('I am player', winner, 'and I am better than everyone else');
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
        startTurn();
        break;
      case 'r':
      case 'R':
        reset();
        break;
      case 'w':
      case 'W':
        movePointLight('W');
        break;
      case 'a':
      case 'A':
        movePointLight('A');
        break;
      case 's':
      case 'S':
        movePointLight('S');
        break;
      case 'd':
      case 'D':
        movePointLight('D');
        break;
      case 'l':
      case 'L':
        toggleAmbient();
        break;
      case 'p':
      case 'P':
        togglePoint();
        break;
      case 'm':
      case 'M':
        toggleShadows();
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

  orbitControls.update();

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

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function movePointLight(key) {
  if (key == 'W') {
    pointZ -= 0.25;
    pointLight.position.set(pointX, 2, pointZ);
  }
  else if (key == 'A') {
    pointX -= 0.25;
    pointLight.position.set(pointX, 2, pointZ);
  }
  else if (key == 'S') {
    pointZ += 0.25;
    pointLight.position.set(pointX, 2, pointZ);
  }
  else {
    pointX += 0.25;
    pointLight.position.set(pointX, 2, pointZ);
  }
}

function toggleAmbient() {
  ambientOn = !ambientOn;

  if (ambientOn) {
    ambientLight.intensity = 0.35;
  }
  else {
    ambientLight.intensity = 0;
  }
}

function togglePoint() {
  pointOn = !pointOn;

  if (pointOn) {
    pointLight.intensity = 1;
  }
  else {
    pointLight.intensity = 0;
  }
}

function toggleShadows() {
  renderer.shadowMap.enabled = !renderer.shadowMap.enabled;
  scene.traverse(function (child) {
    if (child.material) {
      child.material.needsUpdate = true;
    }
  })
}