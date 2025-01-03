class PhaserTutorialSessionTwo extends Phaser.Scene{

   
    constructor() {
        super();
        //class variables here
        this.player = null;
        this.cursors = null;

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

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } 
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else if(this.cursors.down.isDown) {
            this.player.setVelocityY(160);
            this.player.anims.play('turn');
        }
        else if(this.cursors.up.isDown) {
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