/**
 * Main source code for our project
 * --------------------------------
 * 
 * Author: Tones and Owne
 * 
 * ABOVE AND BEYOND
 * a) Audio
 * b) ScoreKeeping With DOM
 * c) LoadingManager + Loading Screen
 * d) Using Custom Assets from Blender
 * 
 */

import '../style.css';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'

import { Deck } from './Deck.js';
import { StandardDeck } from './StandardDeck.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Mesh, Vector3 } from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

//Dom elements
let gameCanvas = document.getElementById('game-of-war');
let audio = document.getElementById("music"); //Chrome dont like when music play, so make sure to click!

//Graphics World
let scene, camera, renderer;
let font;
let winText;
let orbitControls;
let pointX;
let pointZ;
let pointLight;
let ambientLight;
let ambientOn = true;
let pointOn = true;
let d1 = 100;
let d2 = 2000;
let d3 = 1000;

//Logic Stuff
let startDeck;
let playerDecks = []; //players hands
let tableDecks = []; //players cards on table
let playersInPlay = [];
let numPlayers = 3;
let gameStart = false;
let inTurn = false;
let list = document.getElementById("myList");

//Promise Stuff
let promiseArray = [];

/**
 * Startup Function
 */
function main() {

  loadAssets();
  initGraphics();
  initController();

  loop();

} //end of main


function assetsReceiveShadow(obj) {
  if (obj.children.length == 0) {
    obj.receiveShadow = true;
  }
  else {
    obj.children.forEach(assetsReceiveShadow);
  }
}

function assetsCastShadow(obj) {
  if (obj.children.length == 0) {
    obj.castShadow = true;
  }
  else {
    obj.children.forEach(assetsCastShadow);
  }
}

/**
 * Preloads all assets (textures and models)
 * 
 * Above and beyond -> We use custom models from Blender using loader
 * and we update a loading screen when complete.
 * 
 * Making loading Bar
 * https://www.youtube.com/watch?v=zMzuPIiznQ4
 */
function loadAssets() {

  let progressBar = document.getElementById('progress-bar')
  let loadingManager = new THREE.LoadingManager();

  loadingManager.onProgress = function (url, loaded, total) {
    progressBar.value = (loaded / total) * 100;
  }

  let progressBarContainer = document.querySelector('.progress-bar-container');

  loadingManager.onLoad = function () {
    progressBarContainer.style.display = 'none';
  }

  let loader = new GLTFLoader(loadingManager);

  loader.load('../assets/models/pokerScene.gltf', function (gltf) {

    let props = gltf.scene;
    props.position.y = -0.03;
    props.scale.setX(0.6);
    props.scale.setZ(0.6);
    props.scale.setY(0.6);

    let table = props.getObjectByName('Table');
    assetsCastShadow(table);

    let chair = props.getObjectByName('Chair');
    assetsCastShadow(chair);

    chair = props.getObjectByName('Chair001');
    assetsCastShadow(chair);

    chair = props.getObjectByName('Chair002');
    assetsCastShadow(chair);

    assetsReceiveShadow(props);

    scene.add(props);
  
    audio.play();

  }, undefined, function (error) {

    console.error(error);

  });

  //load the font for later use
  let fontLoader = new FontLoader(loadingManager);

  fontLoader.load('node_modules/three/examples/fonts/helvetiker_bold.typeface.json', function (f) {
    font = f;
    console.log(font);
  });

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

  ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  pointX = 0;
  pointZ = 0;
  pointLight = new THREE.PointLight(0xFFFFFF, 0.6);
  pointLight.position.set(0, 3, 0);
  pointLight.castShadow = true;
  pointLight.shadow.bias = - 0.00005;
  pointLight.shadow.mapSize.width = 2048;
  pointLight.shadow.mapSize.height = 2048;
  scene.add(pointLight);

  let spotLight = new THREE.SpotLight(0xFFFFFF, 0.3, undefined, Math.PI/6);
  spotLight.position.set(0, 3, 0);
  spotLight.castShadow = true;
  spotLight.shadow.bias = - 0.00005;
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  scene.add(spotLight);
  

  // Game models

  //Decks

  // add the 52 cards
  startDeck = new StandardDeck();
  scene.add(startDeck.model);

  let spacing = (Math.PI * 2) / numPlayers;
  let outerRadius = 0.5;
  let innerRadius = 0.25;

  // set up all of the decks and their locations for each player based on the number of players
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
  }

  // Orbit controls

  orbitControls = new OrbitControls(camera, document.body);

  //Renderer

  renderer = new THREE.WebGLRenderer({
    canvas: gameCanvas,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(gameCanvas.clientWidth, gameCanvas.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // wall painting
  var textureLoader = new THREE.TextureLoader();
  var material = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF
  });
  const frameMaterials = [
    material,
    material,
    material,
    material,
    new THREE.MeshStandardMaterial({
      map: textureLoader.load('assets/frame.jpeg'),
    }),
    material,
  ];
  const frameBox = new THREE.BoxGeometry(0.25, 0.25, 0.01);
  const frame = new THREE.Mesh(frameBox, frameMaterials);
  frame.position.setZ(-3.95);
  frame.position.setY(3);
  scene.add(frame);

  const materials = [
    material,
    material,
    material,
    material,
    new THREE.MeshStandardMaterial({
      map: textureLoader.load('assets/framedstuetzleart.jpeg'),
    }),
    material,
  ];
  const paint = new THREE.BoxGeometry(0.2, 0.2, 0.01);
  const painting = new THREE.Mesh(paint, materials);
  painting.position.setZ(-3.94);
  painting.position.setY(3);
  scene.add(painting);

} //end of initGraphics

//Here We make our game :) 

/**
 * reset the game
 */
function reset() {

  if (inTurn)
    return;

  scene.remove(startDeck.model);
  scene.remove(winText);

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

  reset();

  gameStart = true;
  inTurn = true;

  startDeck.shuffle();

  // deal an even number of cards to each player's hand from the starting deck
  let i = 0;
  while (!startDeck.isEmpty()) {

    let promise = transferCardTop(startDeck, playerDecks[i], TWEEN.Easing.Sinusoidal.In);
    promiseArray.push(promise);

    i = (i + 1) % numPlayers;
    await setDelay(d1);
  } //end of while

  await Promise.all(promiseArray);
  promiseArray = [];

  inTurn = false;

  // clear the old card card counter values which keeps track of how many cards are remaining for each player
  list.innerHTML = '';

  // update the card counter values
  for (let i = 0; i < playerDecks.length; i++) {
    let li = document.createElement("li");
    li.innerText = 'Player ' + (i + 1) + ': ' + playerDecks[i].getSize();
    li.style.color = "white";
    li.style.fontSize = "1rem";
    li.style.listStyleType = "none";
    li.style.display = "inline";
    li.style.marginRight = "1vw";
    list.appendChild(li);
  }
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

    if (playerDecks[plr].isEmpty()) {
      playersInPlay.splice(i, 1);
      i--;
    }

  }

  // Check if there is only one plr with cards remaining.
  if (playersInPlay.length == 1) {
    // If there is only one plr with cards, declare a winner.
    endGame(playersInPlay[0] + 1);
    return;
  }

  // If there is more than one deck with cards remaining then 
  // play out a turn with those decks
  for (let i = 0; i < playersInPlay.length; i++) {

    let plr = playersInPlay[i];

    // Place top card on table
    let promise = transferCardTop(playerDecks[plr], tableDecks[plr], TWEEN.Easing.Sinusoidal.In);
    promiseArray.push(promise);

  }

  await Promise.all(promiseArray);
  promiseArray = [];

  // Flip each card face up
  playersInPlay.forEach((plr) => {
    tableDecks[plr].flipTopUp();
  });

  await setDelay(d2);

  // Is one greater than the others?
  let isWar = false;
  let greatestValue = -1;
  let winningPlr = -1; //plr with greatest card

  // keep track of which player has the highest card placed down and what that card is
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

  // flip each card face down
  playersInPlay.forEach((plr) => {
    tableDecks[plr].flipTopDown();
  });

  while (isWar) {

    greatestValue = -1;
    winningPlr = -1;
    isWar = false;

    for (let i = 0; i < playersInPlay.length; i++) {
      let plr = playersInPlay[i];

      // have each player place down 2 more cards
      // if they dont have 2 cards remaining, place how many they have left, if any
      for (let j = 0; j < 2; j++) {
        if (!playerDecks[plr].isEmpty()) {
          let promise = transferCardTop(playerDecks[plr], tableDecks[plr], TWEEN.Easing.Sinusoidal.In);
          promiseArray.push(promise);
          await setDelay(d1);
        }
      }
    }

    await Promise.all(promiseArray);
    promiseArray = [];

    // flip each player's second extra war card face up
    playersInPlay.forEach((plr) => {
      tableDecks[plr].flipTopUp();
    });

    await setDelay(d2)

    // compare each players top card as if it were a normal turn, keeping track of the highest card 
    // and the player with that card
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

  // flip the cards facedown in preparation to be put in the winners hand
  playersInPlay.forEach((plr) => {
    tableDecks[plr].flipTopDown();
  });

  await setDelay(d3)

  //move all cards on table to winners deck
  let winnerDeck = playerDecks[winningPlr];

  for (let i = 0; i < playersInPlay.length; i++) {
    let plr = playersInPlay[i];

    let tabled = tableDecks[plr];

    while (!tabled.isEmpty()) {
      let promise = transferCardBottom(tabled, winnerDeck, TWEEN.Easing.Sinusoidal.In);
      promiseArray.push(promise);
      await setDelay(d1);
    }

    await setDelay(d1);
  }

  await Promise.all(promiseArray);
  promiseArray = [];

  inTurn = false;

  // clear the old card card counter values which keeps track of how many cards are remaining for each player
  list.innerHTML = '';

  // update the card counter values
  for (let i = 0; i < playerDecks.length; i++) {
    let li = document.createElement("li");
    li.innerText = 'Player ' + (i + 1) + ': ' + playerDecks[i].getSize();
    li.style.color = "white";
    li.style.fontSize = "1rem";
    li.style.listStyleType = "none";
    li.style.display = "inline";
    li.style.marginRight = "1vw";
    list.appendChild(li);
  }

} //end of startTurn


/**
 * Ends the game, typically when a player wins
 */
function endGame(winner) {

  let geometry = new TextGeometry('Player ' + winner + ' Won!', {
    font: font,
    size: 0.1,
    height: 0.01,
  });



  let material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });

  winText = new Mesh(geometry, material);
  winText.castShadow = true;
  winText.position.x = -0.5;

  scene.add(winText);

  gameStart = false;
  inTurn = false;

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
        if (gameStart)
          startTurn();
        else
          startGame();
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
      case 'f':
      case 'F':
        fasterGame();
        break;
      case 'g':
      case 'G':
        slowerGame();
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

// this function allows us to pause the program for some time, used in this context for letting animations complete
function setDelay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

// this function allows the point light to be moved with key presses
function movePointLight(key) {
  if (key == 'W') {
    pointZ -= 0.25;
    pointLight.position.set(pointX, pointLight.position.y, pointZ);
  }
  else if (key == 'A') {
    pointX -= 0.25;
    pointLight.position.set(pointX, pointLight.position.y, pointZ);
  }
  else if (key == 'S') {
    pointZ += 0.25;
    pointLight.position.set(pointX, pointLight.position.y, pointZ);
  }
  else {
    pointX += 0.25;
    pointLight.position.set(pointX, pointLight.position.y, pointZ);
  }
}

// this function turns the ambient light on and off
function toggleAmbient() {
  ambientOn = !ambientOn;

  if (ambientOn) {
    ambientLight.intensity = 0.35;
  }
  else {
    ambientLight.intensity = 0;
  }
}

// this function turns the point light on and off
function togglePoint() {
  pointOn = !pointOn;

  if (pointOn) {
    pointLight.intensity = 0.6;
  }
  else {
    pointLight.intensity = 0;
  }
}

// this function turns the shadows on and off
function toggleShadows() {
  renderer.shadowMap.enabled = !renderer.shadowMap.enabled;
  scene.traverse(function (child) {
    if (child.material) {
      child.material.needsUpdate = true;
    }
    child.castShadow = !child.castShadow;
  })
}

// this function halves the values used for the delays and animations, making the game go quicker
function fasterGame() {
  d1 /= 2;
  d2 /= 2;
  d3 /= 2;
}

// this function double the values used for the delays and animations, making the game go slower
function slowerGame() {
  d1 *= 2;
  d2 *= 2;
  d3 *= 2;
}

function transferCardTop(startDeck, endDeck, easing = TWEEN.Easing.Linear.None, delay = 0) {
  let card = startDeck.takeTop();

  card.model.rotation.set(Math.PI / 2, 0, 0)

  let beginX = startDeck.model.position.x;
  let beginY = startDeck.model.position.y + card.DIMENSIONS.z * (startDeck.getSize() + 1);
  let beginZ = startDeck.model.position.z;

  card.model.position.set(new Vector3(beginX, beginY, beginZ));

  let endX = endDeck.model.position.x;
  let endY = endDeck.model.position.y + card.DIMENSIONS.z * (endDeck.getSize());
  let endZ = endDeck.model.position.z;

  const tw = new TWEEN.Tween({ x: beginX, y: beginY, z: beginZ, dest: endDeck, card: card })
    .to({ x: endX, y: endY, z: endZ }, d3)
    .easing(easing)
    .delay(delay)
    .onUpdate((tween) => {
      tween.card.model.position.x = tween.x;
      tween.card.model.position.y = tween.y;
      tween.card.model.position.z = tween.z;
    });

  tw.start();

  scene.add(card.model);

  //create a promise to wait for
  return new Promise(function (resolve) {
    tw.onComplete((tw) => {
      tw.card.model.rotation.set(0, 0, 0);
      tw.dest.addTop(tw.card);
      resolve(tw);
    });
  });

}

function transferCardBottom(startDeck, endDeck, easing = TWEEN.Easing.Linear.None, delay = 0) {
  let card = startDeck.takeTop();

  card.model.rotation.set(Math.PI / 2, 0, 0)

  let beginX = startDeck.model.position.x;
  let beginY = startDeck.model.position.y + card.DIMENSIONS.z * (startDeck.getSize() + 1);
  let beginZ = startDeck.model.position.z;

  card.model.position.set(new Vector3(beginX, beginY, beginZ));

  let endX = endDeck.model.position.x;
  let endY = endDeck.model.position.y;
  let endZ = endDeck.model.position.z;

  const tw = new TWEEN.Tween({ x: beginX, y: beginY, z: beginZ, dest: endDeck, card: card })
    .to({ x: endX, y: endY, z: endZ }, d3)
    .easing(easing)
    .delay(delay)
    .onUpdate((tween) => {
      tween.card.model.position.x = tween.x;
      tween.card.model.position.y = tween.y;
      tween.card.model.position.z = tween.z;
    });

  tw.start();

  scene.add(card.model);

  //create a promise to wait for
  return new Promise(function (resolve) {
    tw.onComplete((tw) => {
      tw.card.model.rotation.set(0, 0, 0);
      tw.dest.addBottom(tw.card);
      resolve(tw);
    });
  });
}