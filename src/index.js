import './index.css';
import registerServiceWorker from './registerServiceWorker';

import Scene from './Scene';

const PIXI = require('pixi.js');


registerServiceWorker();


// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
var app = new PIXI.Application(600, 800);
// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);


// load the texture we need
PIXI.loader
    .add('reset', './images/reset.png')
    .add('background', './images/background.png')
    .add('backgroundTopOffice', './images/backgroundTopOffice.png')
    .add('line', './images/line.png')
    .add('catalanian', './images/catalanian.png')
    .add('catalanianRH', './images/catalanianRH.png')
    .add('catalanianLH', './images/catalanianLH.png')
    .add('car', './images/car.png')
    .add('deadCatalanian', './images/deadCatalanian.png')
    .add('police', './images/police.png')
    .load(function (loader, resources) {
        let scene = new Scene(app, resources);

        let moveFunction = scene.move.bind(scene);

        scene.moveFunction = moveFunction;
        scene.stopCallback = () => {
            app.ticker.remove(moveFunction);
            scene.showFinalScore();
        };

        moveFunction();
        // Listen for frame updates
        app.ticker.add(moveFunction);
    });
