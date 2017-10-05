import './index.css';
import registerServiceWorker from './registerServiceWorker';

import policemen from './voteGame';
const PIXI = require('pixi.js');


registerServiceWorker();


// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
var app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);


// load the texture we need
PIXI.loader
.add('catalanian', './images/catalanian.png')
.add('police', './images/police.png')
.load(function(loader, resources) {

    let drawablePolicemen = policemen.map(man => {
        let drawablePoliceman = new PIXI.Sprite(resources.police.texture);
        drawablePoliceman.x = man.positionX;
        drawablePoliceman.y = man.positionY;
        drawablePoliceman.anchor.x = 0.5;
        drawablePoliceman.anchor.y = 0.5;
        drawablePoliceman.on('pointerover', onMouseDown);
        return drawablePoliceman;
    });
    drawablePolicemen.forEach(man => {
        app.stage.addChild(man);
    });

    // This creates a texture from a 'bunny.png' image.
    var catalanian = new PIXI.Sprite(resources.catalanian.texture);

    // Setup the position of the bunny
    catalanian.x = app.renderer.width / 2;
    catalanian.y = 0;

    // Rotate around the center
    catalanian.anchor.x = 0.5;
    catalanian.anchor.y = 0.5;
    catalanian.interactive = true;
    catalanian.buttonMode = true;
    catalanian.on('pointerdown', onMouseDown);


    // Add the bunny to the scene we are building.
    app.stage.addChild(catalanian);

    //
    //
    // police.x = app.renderer.width / 3;
    // police.y = 0;
    //
    //  // Rotate around the center
    // police.anchor.x = 0.5;
    // police.anchor.y = 0.5;


    // Listen for frame updates
    app.ticker.add(function() {
         // each frame we spin the bunny around a bit
        // police.y += 1;
        drawablePolicemen.forEach(man => {
            man.y += 1;
        })
    });
});

function onMouseDown() {
    console.log("aaa");
}