class Bat extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {

        super(scene, x, y);
   
        const body = scene.add.image(0, 0, 'assets', 'Body02_01');
        const wing1 = scene.add.image(-50, 10, 'assets', 'Wing02_01').setOrigin(1, 0.5);
        const wing2 = scene.add.image(50, 10, 'assets', 'Wing02_02').setOrigin(0, 0.5);
        this.add([wing2, body, wing1]);
        this.body = body;
        this.wing1 = wing1;
        this.wing2 = wing2;
        scene.add.existing(this);
        body.setInteractive(new Phaser.Geom.Circle(170, 170, 100), Phaser.Geom.Circle.Contains);
        body.once('pointerdown', () => this.kill());
        this.fly();
    }

    fly() {
        const y = this.y - Phaser.Math.Between(150, 280);
    
        this.scene.tweens.add({
            targets: this,
            y,
            ease: 'back.inout',
            yoyo: true,
            delay: Phaser.Math.Between(500, 1600),
            repeat: -1,
            duration: Phaser.Math.Between(900, 1600)
        });
    
        this.scene.tweens.add({
            targets: this.wing1,
            angle: { start: -20, to: 20 },
            ease: 'sine.inout',
            yoyo: true,
            repeat: -1,
            duration: 200
        });
        this.scene.tweens.add({
            targets: this.wing2,
            angle: { start: 20, to: -20 },
            ease: 'sine.inout',
            yoyo: true,
            repeat: -1,
            duration: 200
        });
    }
    kill() {
        this.scene.tweens.killTweensOf([this, this.wing1, this.wing2]);
        
        this.wing1.setAngle(20);
        this.wing2.setAngle(-20);
        this.body.setFrame('Body02_02');
        
        this.scene.tweens.timeline({
            targets: this,
            tweens: [
                {
                    y: '-=100',
                    angle: 270,
                    scale: 0.3,
                    duration: 500
                },
                {
                    angle: 180,
                    y: 800,
                    ease: 'power1',
                    duration: 500
                }
            ],
            onComplete: () => {
                const x = Phaser.Math.Between(100, 700);
                const y = Phaser.Math.Between(300, 500);
                const scale = Phaser.Math.FloatBetween(0.4, 1);
        
                new Bat(this.scene, x, y).setScale(scale);
        
                this.destroy();
            }
        });
    }
}

class Example extends Phaser.Scene {

    constructor() {
        super({ key: 'Example' });
    }

    preload() {
        this.load.atlas('assets', './assets/tweenparts.png', './assets/tweenparts.json');
        this.load.image('bg', './assets/spooky.png');
    }

    create() {
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(100, 700);
            const y = Phaser.Math.Between(300, 500);
            const scale = Phaser.Math.FloatBetween(0.4, 1);

            new Bat(this, x, y).setScale(scale);
        }
    }

    update(){


    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: Example
};

const game = new Phaser.Game(config);
