const PIXI = require('pixi.js');
const ACTIVE = 1;
const DELETED = 0;
let score;
let scoreCounter = 0;

class SceneObject {
    constructor(positionX, velocity) {
        this.positionX = positionX;
        this.positionY = 0;
        this.velocity = velocity;
        this.state = ACTIVE;
    }

    move() {
        this.positionY += this.velocity;
    }
}

class Catalanian extends SceneObject {
    constructor(positionX, sprite) {
        super(positionX, Math.random() * 2 + 0.1);
        this.sprite = sprite;
    }

    move() {
        if (this.state === ACTIVE) {
            this.positionY += this.velocity;
            let y = this.sprite.y;
            this.sprite.y = this.velocity + y;
        }
        else {
            this.sprite.destroy();
        }
    }
}

class Scene {
    constructor(app, resources) {
        this.objects = [];
        this.iteration = 0;
        this.app = app;
        this.resources = resources;
        this.generateInterval = 200;
        this.generateDensity = 0.1;

        score = new PIXI.Text(0);
        score.x = 30;
        score.y = 30;

        this.app.stage.addChild(score);
    }

    move() {
        this.objects.forEach(object => {
            object.move();
            if (object.state === DELETED) {
                this.objects.splice(this.objects.indexOf(object), 1);
            }
        });

        if (this.iteration % this.generateInterval === 0) {
            this._generate();
        }

        if (this.iteration % 100 === 0) {
            this.generateDensity += 0.01;
        }

        if (this.iteration % 2000 === 0) {
            this.generateInterval -= Math.floor(this.generateInterval / 10);
        }
        console.log(this.iteration++);
    }

    _generate() {
        let offset = 50;

        for (let i = 0; i < 7; i++) {
            let rand = Math.random();
            if (rand >= (1 - this.generateDensity)) {
                let drawableCatalanian = new PIXI.Sprite(this.resources.catalanian.texture);
                drawableCatalanian.anchor.x = 0.5;
                drawableCatalanian.anchor.y = 0.5;
                drawableCatalanian.interactive = true;
                drawableCatalanian.buttonMode = true;
                drawableCatalanian.x = i * offset + 50;

                let catalanian = new Catalanian(i * offset + 50, drawableCatalanian);
                drawableCatalanian.on('pointerdown', this.onMouseDown);
                drawableCatalanian.catalanian = catalanian;

                this.objects.push(catalanian);
                this.app.stage.addChild(drawableCatalanian);
            }
        }
    }

    onMouseDown() {
        this.catalanian.state = DELETED;
        score.text = ++scoreCounter;
    }
}

export default Scene;
