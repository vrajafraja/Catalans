const PIXI = require('pixi.js');
const ACTIVE = 1;
const DELETED = 0;

const BreakException = (message) => {
        this.message = message;
        this.name = 'BreakException';
    }
;
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
        super(positionX, Math.random() * 20 + 0.1);
        this.sprite = sprite;
    }

    move() {
        if (this.state === ACTIVE) {
            if (this.positionY < 800) {
                this.positionY += this.velocity;
                let y = this.sprite.y;
                this.sprite.y = this.velocity + y;
            }
            else {
                throw new BreakException('Catalanian hit the ground.');
            }
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

    _reset(){

        this.objects.forEach(object => {
            console.log(object);
            object.sprite.destroy();
        });

        this.objects = [];
        this.iteration = 0;
        this.generateInterval = 200;
        this.generateDensity = 0.1;
        score.text = 0;
        scoreCounter = 0;


        this.app.ticker.add(this.moveFunction);
    }

    _applyRules() {
        if (this.iteration % this.generateInterval === 0) {
            this._generate();
        }

        if (this.iteration % 100 === 0) {
            this.generateDensity += 0.01;
        }

        if (this.iteration % 2000 === 0) {
            this.generateInterval -= Math.floor(this.generateInterval / 10);
        }
    }

    move() {
        try {
            this.objects.forEach(object => {
                object.move();
                if (object.state === DELETED) {
                    this.objects.splice(this.objects.indexOf(object), 1);
                }
            });
            this._applyRules();
        } catch (e) {
            this.stopCallback();
        }
        console.log(this.iteration++);
    }

    _formatSprite(sprite) {
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.interactive = true;
        sprite.buttonMode = true;
        return sprite;
    }

    _generate() {
        let offset = 50;

        for (let i = 0; i < 7; i++) {
            let rand = Math.random();
            if (rand >= (1 - this.generateDensity)) {
                let drawableCatalanian = new PIXI.Sprite(this.resources.catalanian.texture);
                drawableCatalanian = this._formatSprite(drawableCatalanian);
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

    showFinalScore() {
        let resetButton = new PIXI.Sprite(this.resources.reset.texture);
        let finalScore = new PIXI.Text(scoreCounter);
        let finalScoreText = new PIXI.Text("Catalans denied!!!");

        resetButton = this._formatSprite(resetButton);
        resetButton.x = 300;
        resetButton.y = 300;
        resetButton.on('pointerdown', () =>
        {
            resetButton.destroy();
            finalScore.destroy();
            finalScoreText.destroy();
            this._reset()
        });

        finalScore.x = 300;
        finalScore.y = 600;
        finalScoreText.x = 200;
        finalScoreText.y = 650;

        this.app.stage.addChild(resetButton);
        this.app.stage.addChild(finalScore);
        this.app.stage.addChild(finalScoreText);
    }
}

export default Scene;
