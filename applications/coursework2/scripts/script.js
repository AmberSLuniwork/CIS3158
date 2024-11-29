class CourseworkTwo extends Phaser.Scene {
    constructor() {
        super();
        //class variables
        this.player;
        this.cursors;
    }
    //functions
    preload()
    {
        this.load.spritesheet('player', './assets/sprites/player-spritesheet.png', {frameWidth:30, frameHeight:45});
        this.load.image('raindrop', './assets/particles/raindrop.png')
    }

    create(){
        //spritesheet
        this.player = this.physics.add.sprite(100, 512, 'player').setScale(2);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(400)

        //animations
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', {start:0, end:3}),
            frameRate:6,
            repeat:-1,
        });
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', {start:8, end:15}),
            frameRate:10,
            repeat:-1,
        });
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', {start:4, end:7}),
            frameRate:4,
            repeat:-1, 
        });
        this.cursors = this.input.keyboard.createCursorKeys();

        const particles = this.add.particles('raindrop');
        const emitter = particles.createEmitter({
            x: {min: 0, max:800}, //so it's across the whole screen.
            y: 0, //i should hope that all rain comes from the sky!
            speedY: Phaser.Math.FloatBetween(1000, 1500),
            speedX: -100,
            lifespan: 1000, //this is in milliseconds.
            quantity: 5,
            alpha: {
                start: 0.9,
                end: 0.1,
            },
            depth: Phaser.Math.FloatBetween(1, 3)
        });
        emitter.setScaleY(Phaser.Math.FloatBetween(4, 6))

    }

    update(){
        //player movement
        //run left
        if (this.cursors.left.isDown && this.cursors.shift.isDown) {
        this.player.setFlipX(true);
        this.player.setVelocityX(-250);
        this.player.anims.play('run', true);
    //run right
        } else if (this.cursors.right.isDown && this.cursors.shift.isDown) {
        this.player.setFlipX(false);
        this.player.setVelocityX(250);
        this.player.anims.play('run', true);
    //walk left
        } else if(this.cursors.left.isDown) {
            this.player.setFlipX(true);
            this.player.setVelocityX(-150);
            this.player.anims.play('walk', true);
    //walk right
        } else if (this.cursors.right.isDown) {
            this.player.setFlipX(false);
            this.player.setVelocityX(150);
            this.player.anims.play('walk', true);
        }
    //no keys down
        else {
            this.player.setVelocityX(0);
            this.player.setVelocityY(240);
            this.player.anims.play('idle',true);
        }
    }
}

//config

const config = {
    type:Phaser.AUTO,
    width:800,
    height:600,
    backgroundColor: '#e6e6e6',
    parent: 'game-container',
    scene: CourseworkTwo,
    physics: {
        default: 'arcade',
            arcade: {
                debug: true
            }
    }
};

const game = new Phaser.Game(config);