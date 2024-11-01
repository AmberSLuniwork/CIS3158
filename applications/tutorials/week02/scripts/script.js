class PhaserTutorialSessionTwo extends Phaser.Scene {
    constructor() {
        super();
        //class variables
        this.player;
        this.cursors;
        this.text;
        this.platforms;
        this.stars;
        this.score = 0;
        this.scoreText;
    }
    //functions
    preload()
    {
        this.load.image('platform', './assets/platform.png');
        this.load.image('sky', './assets/sky.png');
        this.load.image('star', './assets/star.png');

        this.load.spritesheet('dude', './assets/dude.png', {frameWidth:32, frameHeight:48});
    }

    create(){
        //images
        this.add.image(400,300, 'sky');
        //ground
        this.add.image(400,568, 'platform').setScale(2);
        //other platforms
        this.add.image(10,200, 'platform');
        this.add.image(500,400, 'platform');
        //text
        this.text = this.add.text(300, 25, 'Introduction to Phaser', {fill:'#ffffff'});
        //spritesheet
        this.player = this.physics.add.sprite(100, 512, 'dude').setScale(2);
        this.player.setCollideWorldBounds(true);

        //animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {start:0, end:3}),
            frameRate:10,
            repeat:-1,
        });
        this.anims.create({
            key: 'turn',
            frames: this.anims.generateFrameNumbers('dude', {start:4, end:4}),
            frameRate:10,
            repeat:-1,
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {start:5, end:8}),
            frameRate:10,
            repeat:-1, 
        });
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(){
        //player movement
        if(this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right');
        } else if (this.cursors.space.isDown) {
            this.player.setVelocityY(-160);
            this.player.anims.play('turn');
        } else {
            this.player.setVelocityX(0);
            this.player.setVelocityY(240);
            this.player.anims.play('turn');
        }
    }
}

//config

const config = {
    type:Phaser.AUTO,
    width:800,
    height:600,
    transparency: true,
    parent: 'game-container',
    scene: PhaserTutorialSessionTwo,
    physics: {
        default: 'arcade',
            arcade: {
                debug: true
            }
    }
};

const game = new Phaser.Game(config);