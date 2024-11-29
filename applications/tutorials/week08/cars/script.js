class car extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture) {
        super(scene, x,y,texture);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.3);
        this.pathTweenCounter = { t:0, vec: new Phaser.Math.Vector2()};
        this.pathTween = null;
        this.path;
        this.tangent = new Phaser.Math.Vector2();
        this.pathVector = new Phaser.Math.Vector2();
        this.pathOffset;
        this.t = 0;
        this.maxSpeed = 0.002;
        this.speed = 0;
        this.acceleration = 0;
    }

    preUpdate(time,delta){
        super.preUpdate(time, delta);
        this.pathUpdate();
    }

    pathUpdate(){
        const tween = this.pathTween;
        if (tween && tween.isPlaying()) {
            this.t = tween.getValue();
        } else {
            this.speed = Phaser.Math.Clamp(this.speed + this.acceleration, 0, this.maxSpeed);
            this.t = this.t + this.speed <= 1 ? this.t + this.speed : 0;
        }
        this.path.getPoint(this.t, this.pathVector);
        this.path.getTangent(this.t, this.tangent);
        this.setRotation(this.tangent.angle());
        this.pathVector.add(this.tangent.normalizeRightHand().setLength(this.pathOffset));
        this.setPosition(this.pathVector.x, this.pathVector.y);
    }

    startFollow({path, duration, pathOffset = 0}) {
        this.path = path;
        this.pathOffset = pathOffset;
        if (duration) {
            this.pathTween = this.scene.tweens.addCounter({
                from: 0,
                to: 1,
                duration:duration,
                repeat : -1
            });
        }
    }

}

class main extends Phaser.Scene {
    constructor(){
        super({key: "main"});
        this.track;
    }

    preload() {
        this.load.image('racetrack', './assets/track.jpg');
        this.load.image('redcar', './assets/red_car.png')
        this.load.image('yellowcar', './assets/yellow_car.png')
        this.load.image('policecar', './assets/swat.png')
        this.load.json('circuit', './assets/circuit.json')
    }

    create() {
        this.circuit = new Phaser.Curves.Path(this.cache.json.get('circuit'));
        this.drawCircuit();

        this.redCar = new car(this, 460, 398, 'redcar');
        this.redCar.startFollow({path:this.circuit});
        
        this.yellowCar = new car(this, 0, 0, 'yellowcar');
        this.yellowCar.startFollow({path:this.circuit, duration: 8000, pathOffset: 18});

        this.policeCar = new car(this, 0, 0, 'policecar');
        this.policeCar.startFollow({path:this.circuit, duration: 12000, pathOffset: -18});
    
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.add.text(8,2,["UP Arrow: Accelerate", "DOWN Arrow: Decelerate"], {color: '0x000000'})
    }

    update() {
        this.controlRedcar()
    }

    controlRedcar() {
        this.redCar.acceleration = 0;
        if (this.cursorKeys.down.isDown) {
            this.redCar.acceleration = -0.00001;
        } else if (this.cursorKeys.up.isDown) {
            this.redCar.acceleration = 0.00001;
        }
    }

    drawCircuit(debug = true) {
        this.track = this.add.image(0,0,'racetrack').setOrigin(0,0);
        if (debug) {
            this.track.setVisible(false);
            this.graphics = this.add.graphics();
            this.graphics.lineStyle(2, 0x0000ff, 1);
            this.circuit.draw(this.graphics);
        }
    }
}

const config = {
    width: 900,
    height: 443,
    backgroundColor: 0x000000,
    pixelArt:true,
    physics: {
        default: "arcade",
        arcade:{
            debug: false,
            debugShowVelocity: false
        }
    },
    scene: [main]
};

var game = new Phaser.Game(config);