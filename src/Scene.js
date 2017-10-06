const PIXI = require('pixi.js');

class SceneObject{
    constructor(positionX, velocity, destroy) {
        this.positionX = positionX;
        this.positionY = 0;
        this.velocity = velocity;
        this.destroy = destroy;
    }

    move() {
        this.positionY += this.velocity;
    }
}

class Catalanian extends SceneObject {
    constructor(positionX, destroy, sprite) {
        super(positionX, 1, destroy);
        this.sprite = sprite;
    }
}

class Scene {
    constructor() {
        this.objects = [];
        this.iteration = 0;
    }

    move() {
        this.objects.forEach(object => {
            object.move();
        });
        if (this.iteration%500 === 0){
            this._generate();
        }

        this.iteration++;
    }

    _generate() {
        let offset = 100;

        let drawableCatalanian = new PIXI.Sprite(resources.catalanian.texture);
        drawableCatalanian.anchor.x = 0.5;
        drawableCatalanian.anchor.y = 0.5;
        drawableCatalanian.interactive = true;
        drawableCatalanian.buttonMode = true;
        drawableCatalanian.on('pointerover', onMouseDown);
        app.stage.addChild(drawableCatalanian);

        for (let i = 0; i < 5; i++) {
            let catalanian = new Catalanian(i * offset, () => delete this.objects[this.objects.length]);
            this.objects.push(catalanian);
        }
    }

}

export default Scene;
