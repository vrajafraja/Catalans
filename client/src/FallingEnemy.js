import {unregister} from "./registerServiceWorker";

const PIXI = require('pixi.js');
const HOWL = require('howler');

const ACTIVE = 1;
const DELETED = 0;
const DEAD = -1;

const HIGH_SCORE_SERVER = "https://catalans.herokuapp.com";


const scoreTextStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#fffd00', '#ff6102'], // gradient
    stroke: '#000000',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#FFFFFF',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440
});

const accuracyStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 26,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#fffd00', '#ff6102'], // gradient
    stroke: '#000000',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#FFFFFF',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440
});

const BreakException = (message) => {
    this.message = message;
    this.name = 'BreakException';
};


let speedQuotient = 9;
let totalClicks = 0;
let totalHits = 0;
let score;
let scoreCounter = 0;
let iteration = 0;


const slapSound = new HOWL.Howl({
    src: ['sounds/Slap.mp3']
});

const carCrashSound = new HOWL.Howl({
    src: ['sounds/CarCrash.mp3']
});

const backgroundSound = new HOWL.Howl({
    src: ['sounds/vejvar.mp3'],
    volume: 5.0,
    loop: true
});

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
    constructor(positionX, speed, sprite, resources) {
        super(positionX, speed);
        this.sprite = sprite;
        this.textureResources = resources;
        this.animation = "RH";
        this._animate();
    }

    _animate() {
        if (iteration % (20 - Math.ceil(this.velocity)) === 0) {
            if (this.animation === "RH") {
                this.animation = "LH";
                this.sprite.texture = this.textureResources.catalanianLH.texture;
            }
            else {
                this.animation = "RH";
                this.sprite.texture = this.textureResources.catalanianRH.texture;
            }
        }
    }

    move() {
        if (this.state === ACTIVE) {
            if (this.positionY < 800) {
                this._animate();
                this.positionY += this.velocity;
                let y = this.sprite.y;
                this.sprite.y = this.velocity + y;
            }
            else {
                throw new BreakException('Catalanian hit the ground.');
            }
        }
        else if (this.state === DEAD) {
            if (this.sprite.alpha > 0) {
                this.sprite.alpha -= 0.001;
            }
            else {
                this.state = DELETED;
            }
        }
        else {
            this.sprite.destroy();
        }
    }

    _playSound() {
        slapSound.play();
    }

    click() {
        if (this.state === ACTIVE) {
            scoreCounter += Math.ceil(this.velocity);
            score.text = scoreCounter;
            this._playSound();
            this.kill();
            totalHits++;
        }
        totalClicks++;
    }

    kill() {
        //debugger;
        this.sprite.interactive = false;
        this.state = DEAD;
        this.sprite.texture = this.textureResources.deadCatalanian.texture;
        this.sprite.alpha = .5;
    }
}

class OldCatalanian extends SceneObject {
    constructor(positionX, speed, sprite, resources) {
        super(positionX, speed);
        this.sprite = sprite;
        this.textureResources = resources;
        this.animation = "RH";
        this._animate();
    }

    _animate() {
        if (iteration % (25 - Math.ceil(this.velocity)) === 0) {
            if (this.animation === "RH") {
                this.animation = "LH";
                this.sprite.texture = this.textureResources.oldCatalanianLH.texture;
            }
            else {
                this.animation = "RH";
                this.sprite.texture = this.textureResources.oldCatalanianRH.texture;
            }
        }
    }

    move() {
        if (this.state === ACTIVE) {
            if (this.positionY < 800) {
                this.positionY += this.velocity;
                let y = this.sprite.y;
                this.sprite.y = this.velocity + y;
                this._animate();
            }
            else {
                throw new BreakException('Catalanian hit the ground.');
            }
        }
        else if (this.state === DEAD) {
            if (this.sprite.alpha > 0) {
                this.sprite.alpha -= 0.001;
            }
            else {
                this.state = DELETED;
            }
        }
        else {
            this.sprite.destroy();
        }
    }

    _playSound() {
        slapSound.play();
    }

    click() {
        if (this.state === ACTIVE) {
            scoreCounter += Math.ceil(this.velocity);
            score.text = scoreCounter;
            this._playSound();
            this.kill();
            totalHits++;
        }
        totalClicks++;
    }

    kill() {
        //debugger;
        this.sprite.interactive = false;
        this.state = DEAD;
        this.sprite.texture = this.textureResources.deadOldCatalanian.texture;
        this.sprite.alpha = .5;
    }
}

class CatalanianInCar extends Catalanian {
    constructor(positionX, speed, sprite, resources) {
        super(positionX, speed, sprite, resources);
        this.animation = "deadCar1";
        this._animate();
    }

    _animate() {
        if (iteration % 10 === 0) {
            if (this.state === DEAD) {
                if (this.animation === "deadCar1") {
                    this.animation = "deadCar2";
                    this.sprite.texture = this.textureResources.deadCar2.texture;
                }
                else {
                    this.animation = "deadCar1";
                    this.sprite.texture = this.textureResources.deadCar1.texture;
                }
            }
            else {
                this.sprite.texture = this.textureResources.car.texture;
            }
        }

    }

    move() {
        if (this.state === ACTIVE) {
            if (this.positionY < 800) {
                this.positionY += this.velocity;
                let y = this.sprite.y;
                this.sprite.y = this.velocity + y;
                this._animate();
            }
            else {
                throw new BreakException('Catalanian hit the ground.');
            }
        }
        else if (this.state === DEAD) {
            if (this.sprite.alpha > 0) {
                this.sprite.alpha -= 0.001;
                this._animate();
            }
            else {
                this.state = DELETED;
            }
        }
        else {
            this.sprite.destroy();
        }
    }

    _playSound() {
        carCrashSound.play();
    }

    kill() {
        this.sprite.interactive = false;
        this.state = DEAD;
        this.sprite.texture = this.textureResources.deadCar1.texture;
        this.sprite.alpha = .5;
    }

}

class FallingEnemy {
    constructor(app, resources) {
        this.objects = [];

        this.app = app;
        this.resources = resources;
        this.generateInterval = 200;
        this.generateDensity = 0.1;
        this._resetCounters();

        score = new PIXI.Text(0, scoreTextStyle);
        score.x = 30;
        score.y = 30;

        let background = new PIXI.Sprite(resources.background.texture);
        background.interactive = true;

        background.on('pointerdown', () => totalClicks++);
        this.app.stage.addChild(background);
        this.app.stage.addChild(score);
        backgroundSound.stop();
        backgroundSound.play();
    }

    _resetCounters(){
        iteration = 0;
        this.generateInterval = 200;
        this.generateDensity = 0.1;
        totalHits = 0;
        totalClicks = 0;
        scoreCounter = 0;
    }

    _reset() {
        this.objects.forEach(object => {
            object.sprite.destroy();
        });

        score.text = 0;
        this.objects = [];
        this._resetCounters();

        backgroundSound.play();
        this.app.ticker.add(this.moveFunction);
    }

    _applyRules() {
        if ((iteration % this.generateInterval === 0) || this._nobodyAlive()) {
            this._generate();
        }

        if (iteration % 100 === 0) {
            this.generateDensity += 0.01;
            speedQuotient += 0.05;
        }

        if (iteration % 2000 === 0) {
            this.generateInterval -= Math.floor(this.generateInterval / 10);
        }
    }

    _nobodyAlive() {
        let allDead = true;
        this.objects.forEach(object => {
            if (object.state === ACTIVE) {
                allDead = false;
            }
        });
        return allDead;
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
        iteration++;
        //console.log(iteration);
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
                let speed = Math.random() * speedQuotient + 0.1;
                let drawableCatalanian = new PIXI.Sprite();
                drawableCatalanian = this._formatSprite(drawableCatalanian);
                drawableCatalanian.x = i * offset + Math.sin(iteration) * 50 + 90;
                let catalanian;
                if (speed < 1.5) {
                    catalanian = new OldCatalanian(i * offset + 50, speed, drawableCatalanian, this.resources);
                }
                else if (speed < 5) {
                    catalanian = new Catalanian(i * offset + 50, speed, drawableCatalanian, this.resources);
                }
                else {
                    catalanian = new CatalanianInCar(i * offset + 50, speed, drawableCatalanian, this.resources);
                }

                drawableCatalanian.on('pointerdown', this.onMouseDown);
                drawableCatalanian.catalanian = catalanian;

                this.objects.push(catalanian);
                this.app.stage.addChild(drawableCatalanian);
            }
        }
    }

    onMouseDown() {
        this.catalanian.click();
    }

    _stopScene() {
        this.objects.forEach(object => object.state = DEAD);
        backgroundSound.stop();
    }

    _createResetButton() {
        let resetButton = new PIXI.Sprite(this.resources.reset.texture);
        resetButton = this._formatSprite(resetButton);
        resetButton.x = 300;
        resetButton.y = 250;
        return resetButton;
    }

    _createFinalScore() {
        let finalScore = new PIXI.Text("Your score: " + scoreCounter, scoreTextStyle);
        finalScore.x = 300;
        finalScore.y = 605;
        finalScore.anchor.x = 0.5;
        return finalScore;
    }


    _createAccuracy() {
        let accuracy = new PIXI.Text("Accuracy: " + Math.ceil(totalHits / totalClicks * 100) + "%", accuracyStyle);
        accuracy.x = 300;
        accuracy.y = 665;
        accuracy.anchor.x = 0.5;
        return accuracy;
    }

    _validateHighScore(pixiText) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `${HIGH_SCORE_SERVER}/players/0/10`);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                let scoreList = JSON.parse(xhr.responseText);
                let highScore = 0;
                if (scoreList.length > 0) {
                    highScore = scoreList[0].score;
                }
                if (scoreCounter > highScore || highScore === 0) {
                    let name = this._promptForName();
                    this._storeNewHighScore(name);
                    this._updateHighScoreText(pixiText, {'name': name, 'score': scoreCounter});
                }
                else {
                    this._updateHighScoreText(pixiText, scoreList[0]);
                }
            }
        }
        xhr.send();
    }

    _promptForName() {
        let name = prompt("Enter your name");

        return name.substr(0, 6);
    }

    _storeNewHighScore(name) {
        let xhr = new XMLHttpRequest();
        let url = `${HIGH_SCORE_SERVER}/players/${name}/${scoreCounter}`;
        xhr.open('PUT', url);
        xhr.send();
    }

    _updateHighScoreText(pixiText, highScore) {
        if (highScore !== undefined) {
            pixiText.text = `High Score: ${highScore.name}  ${highScore.score}`;
        }
    }

    _createHighScore() {
        let highScoreText = new PIXI.Text(" ", scoreTextStyle);
        highScoreText.x = 300;
        highScoreText.y = 535;
        highScoreText.anchor.x = 0.5;
        return highScoreText;
    }


    showFinalScore() {
        this._stopScene();

        let resetButton = this._createResetButton();
        let highScoreText = this._createHighScore();
        let finalScore = this._createFinalScore();
        let accuracy = new PIXI.Text(accuracyStyle);

        resetButton.on('pointerdown', () => {
            resetButton.destroy();
            highScoreText.destroy();
            finalScore.destroy();
            accuracy.destroy();
            this._reset()
        });

        this.app.stage.addChild(resetButton);
        this.app.stage.addChild(highScoreText);
        this.app.stage.addChild(finalScore);

        if (totalHits + totalClicks > 0) {
            accuracy = this._createAccuracy();
            this.app.stage.addChild(accuracy);
        }
        this._validateHighScore(highScoreText);

    }
}

export default FallingEnemy;
