import './index.css';
import registerServiceWorker from './registerServiceWorker';

import FallingEnemy from './FallingEnemy';

const PIXI = require('pixi.js');


registerServiceWorker();


// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
var app = new PIXI.Application(600, 800);
// The application will create a canvas element for you that you
// can then insert into the DOM.
app.view.id = "app";


let initializeApp = () => {
    if (app) {
        document.body.removeChild(app.view);
        app.destroy();
        app = new PIXI.Application(600, 800);
        document.body.insertBefore(app.view, document.body.childNodes.item(2));
        app.view.id = "app";
        PIXI.loader.reset();
    }
}


document.body.appendChild(app.view);

let playFallingCatalanian = () => {
    // load the texture we need
    initializeApp();
    PIXI.loader
        .add('reset', './images/reset.png')
        .add('background', './images/background.png')
        .add('line', './images/line.png')
        .add('catalanian', './images/catalanian.png')
        .add('catalanianRH', './images/catalanianRH.png')
        .add('catalanianLH', './images/catalanianLH.png')
        .add('oldCatalanianRH', './images/oldCatalanianRH.png')
        .add('oldCatalanianLH', './images/oldCatalanianLH.png')
        .add('car', './images/car.png')
        .add('deadCar1', './images/deadCar1.png')
        .add('deadCar2', './images/deadCar2.png')
        .add('deadCatalanian', './images/deadCatalanian.png')
        .add('deadOldCatalanian', './images/deadOldCatalanian.png')
        .add('police', './images/police.png')
        .load(function (loader, resources) {
            let fallingEnemy = new FallingEnemy(app, resources);

            let moveFunction = fallingEnemy.move.bind(fallingEnemy);

            fallingEnemy.moveFunction = moveFunction;
            fallingEnemy.stopCallback = () => {
                app.ticker.remove(moveFunction);
                fallingEnemy.showFinalScore();
            };

            moveFunction();
            // Listen for frame updates
            app.ticker.add(moveFunction);
        });
}

document.getElementById("fallingCatalanian").onclick = playFallingCatalanian;

let playFallingPoliceman = () => {

    initializeApp();
    PIXI.loader
        .add('reset', './images/reset.png')
        .add('background', './images/backgroundCatalanian.png')
        .add('line', './images/line.png')
        .add('catalanian', './images/police.png')
        .add('catalanianRH', './images/policemanRH.png')
        .add('catalanianLH', './images/policemanLH.png')
        .add('oldCatalanianRH', './images/oldPolicemanRH.png')
        .add('oldCatalanianLH', './images/oldPolicemanLH.png')
        .add('car', './images/policeCar.png')
        .add('deadCar1', './images/deadPoliceCar1.png')
        .add('deadCar2', './images/deadPoliceCar2.png')
        .add('deadCatalanian', './images//deadPoliceman.png')
        .add('deadOldCatalanian', './images/deadOldPoliceman.png')
        .add('police', './images/police.png')
        .load(function (loader, resources) {
            let fallingEnemy = new FallingEnemy(app, resources);

            let moveFunction = fallingEnemy.move.bind(fallingEnemy);

            fallingEnemy.moveFunction = moveFunction;
            fallingEnemy.stopCallback = () => {
                app.ticker.remove(moveFunction);
                fallingEnemy.showFinalScore();
            };

            moveFunction();
            // Listen for frame updates
            app.ticker.add(moveFunction);
        });
}
document.getElementById("fallingPoliceman").onclick = playFallingPoliceman;


//playFallingPoliceman();



