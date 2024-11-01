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
        //paltforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(500, 400, 'platform');
        this.platforms.create(400,568, 'platform').setScale(2).refreshBody();
        this.platforms.create(10,200, 'platform');
        //text
        this.text = this.add.text(300, 25, 'Introduction to Phaser', {fill:'#ffffff'});
        //spritesheet
        this.player = this.physics.add.sprite(100, 490, 'dude').setScale(2);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(400);
        this.player.setBounceY(0.4);
        //stars
        this.stars = this.physics.add.group({
            collideWorldBounds: true,
            gravityY: 300,
            key: 'star',
            repeat: 10,
            setXY: { x: 20, y: 0, stepX: 75 },
        });

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

        //player star collision
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
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
            this.player.setVelocityY(-240);
            this.player.anims.play('turn');
        } else {
            this.player.setVelocityX(0);
            this.player.setVelocityY(240);
            this.player.anims.play('turn');
        }
        //collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
    }

    collectStar (player, star) {
        star.disableBody(true, true);
        star.destroy();
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