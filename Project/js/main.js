import '../style.css';
import * as THREE from 'three';

import {Deck} from './deck';
import {StandardDeck} from './standardDeck';

let scene, camera, renderer;

let gameCanvas = document.getElementById('gameOfWar')

function main() {

  loadAssets();
  initLogic();
  initGraphics();
  initController();

  gameLoop();

} //end of main

function loadAssets() {

} //end of loadAssets

function initLogic() {
  let myDeck = new StandardDeck();

  console.log(myDeck);

  myDeck.shuffle();

  console.log(myDeck);

} //end of initLogic

function initGraphics() {

  //Scene

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  //Camera

  camera = new THREE.PerspectiveCamera(90, gameCanvas.clientWidth/gameCanvas.clientHeight, 0.1, 1000);
  camera.name = 'camera';
  camera.position.z = 0.5;
  camera.position.y = 0.5;
  camera.lookAt(new THREE.Vector3(0,0,0));

  scene.add(camera);

  //Lighting

  let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
  scene.add(ambientLight);

  let pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.y = 5.0;

  scene.add(pointLight);

  //Geometry

  //let tableGeometry = new THREE.BoxGeometry(2, 0.05, 0.5);

  //Material

  /*let tableMaterial = new THREE.MeshStandardMaterial({
    color: 0xC04000
  });

  let table = new THREE.Mesh(tableGeometry, tableMaterial);
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

function initController() {

} //end of initController

function gameLoop() {

  render();

} //end of gameLoop

function render() {
  renderer.render(scene, camera);
} //end of render

main();