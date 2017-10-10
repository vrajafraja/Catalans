import './index.css';
import registerServiceWorker from './registerServiceWorker';

import Scene from './Scene';

const PIXI = require('pixi.js');


registerServiceWorker();


// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
var app = new PIXI.Application(600, 800, {backgroundColor: 0x1099bb});
// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);


// load the texture we need
PIXI.loader
    .add('catalanian', './images/catalanian.png')
    .add('police', './images/police.png')
    .load(function (loader, resources) {
        let scene = new Scene(app, resources);

        let moveFunction = () => {
            scene.move();
        };

        scene.stopCallback = () => {
            app.ticker.remove(moveFunction);
            scene.showFinalScore();
        };

        moveFunction();
        // Listen for frame updates
        app.ticker.add(moveFunction);
    });
