class Example extends Phaser.Scene {
    preload() {
        //do this first so i don't forget...
        this.load.atlas('assets', './assets/tweenparts.png', 'assets/tweenparts.json');
        
        this.load.image('sky','./assets/sky.png')
        this.load.image('clouds','./assets/clouds.png')
        this.load.image('waves','./assets/waves.png')
    }

    create() {
        this.add.image(400, 300, 'sky');
        const clouds = this.add.tileSprite(400, 300, 800, 600, 'clouds');
        const waves = this.add.tileSprite(400, 400, 800, 600, 'waves');
        
        const fish1 = this.add.image(0, 700, 'assets', 'fishing_134_t');
        const fish2 = this.add.image(800, 700, 'assets', 'fishing_128_t');


        //tween time!
        //env tweens
        this.tweens.add({
            targets: clouds,
            tilePositionX: 800,
            duration: 9000,
            ease: 'circular',
            repeat: -1,
        });
        
        this.tweens.add({
            targets: waves,
            tilePositionY: 100,
            duration: 2000,
            ease: 'sine.inout',
            yoyo: true,
            repeat: -1,
            onUpdate: () => {
                waves.tilePositionX += 4;
            },
        });

        //fish tweens
        this.tweens.timeline({
            tweens: [
                // Fish1 movements
                {
                    targets: fish1,
                    x: 400,
                    y: 200,
                    angle: 40,
                    duration: 1000,
                    ease: 'sine.out',
                },
        
                {
                // ... (other movements for fish1)
                },
                {
                    targets: fish2,
                    x: 400,
                    y: 200,
                    angle: -30,
                    duration: 1000,
                    ease: 'sine.out',
                },
                {
                // ... (other movements for fish2)
                }
            ],
            loop: -1,
        });
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
