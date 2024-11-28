class rain extends Phaser.Scene{

    constructor() {
        super({key:'Rain'});

        this.emitter;
    }

    preload(){

        this.load.image('bg','./assets/forest_background.jpg');
        this.load.image('raindrop','./assets/rain_particle.png');

    }

    create(){
        //background, starts nice and easy!
        this.add.image(400, 300, 'bg').setDepth(0);

        //now for the awkard bit.
        const particles = this.add.particles('raindrop');
        const emitter = particles.createEmitter({
            x: {min: 0, max:800}, //so it's across the whole screen.
            y: 0, //i should hope that all rain comes from the sky!
            speedY: 1000,
            lifespan: 1000, //this is in milliseconds.
            quantity: 1,
            alpha: {
                start: 0.3,
                end: 0.1,
            },
            depth: 1,
        });
        emitter.setScaleX(0.05);
        emitter.setScaleY(3);
    }

    update(){

    }

}

const config = {
    parent: 'game-container',
    type:Phaser.AUTO,
    width: 800, 
    height: 600,
    transparency: true,
    scene: rain,
    physics: {
        default: 'arcade',
    }
}

const game = new Phaser.Game(config);