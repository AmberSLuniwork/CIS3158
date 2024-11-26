class PhaserTutorialSessionTwo extends Phaser.Scene{

   
    constructor() {
        super();
        //class variables here
        this.player = null;
        //don't need cursor variable if i'm not using it.
        //this.cursors = null;
        this.pointer = null;

    }

    //functions when needed go here
    preload()
    {
        this.load.image('platform', './assets/platform.png');
        this.load.image('sky', './assets/sky.png');
        this.load.image('star', './assets/star.png');

        this.load.spritesheet('dude', './assets/dude.png', {frameWidth:32, frameHeight:48});
    }

    create()
    {
        this.add.image(400, 300, 'sky');
        this.add.image(10, 200, 'platform');
        this.add.image(500, 400, 'platform');
        this.add.image(400, 568, 'platform').setScale(2);
        this.add.text(300,50,'Introduction to Phaser', {fill: '#ffffff'});

        this.player = this.physics.add.sprite(100,512,'dude').setScale(2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {start:0, end:3}),
            frameRate:10,
            repeat: -1,
        })
        this.anims.create({
            key: 'turn',
            frames: this.anims.generateFrameNumbers('dude', {start:4, end:4}),
            frameRate:10,
            repeat: -1,
        })
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {start:5, end:8}),
            frameRate:10,
            repeat: -1,
        })
        //Don't need this if I'm using a pointer.
        //this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        this.pointer = this.input.activePointer;
        //sprite follows mouse now!
        this.player.x = this.pointer.x;

        //not sure how to make animations work with following mouse.

        //change from up/space to a mouse click to jump. Not sure why, but it didn't like leftButton. Have left it as pointer so I at least have something to show for it.
        if(this.pointer.isDown) {
            this.player.setVelocityY(-160);
            this.player.anims.play('turn');
        }
        else {
            //this is gravity!
            this.player.setVelocityX(0);
            this.player.setVelocityY(240);
            this.player.anims.play('turn');
        }
    }



}


//Game config
const config = {
    parent: 'game-container',
    type:Phaser.AUTO,
    width: 800, 
    height: 600,
    transparency: true,
    scene: PhaserTutorialSessionTwo,
    physics: {
        default: 'arcade',
        arcade: {
            debug:true
        }
    }

}

const game = new Phaser.Game(config);