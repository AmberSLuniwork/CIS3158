<<<<<<< HEAD
class PhaserTutorialSessionTwo extends Phaser.Scene{

   
    constructor() {
        super('GameScene');
        //class variables here
        this.player = null;
        this.cursors = null;
        this.platforms = null;
        this.starsCollected = 0;
        this.score = null;
        this.cam;
    }

    //functions when needed go here
    preload()
    {
        this.load.image('platform', './assets/platform.png');
        this.load.image('sky', './assets/environment.jpg');
        this.load.image('star', './assets/star.png');
        this.load.image('secondscene', './assets/scene2.png');

        this.load.spritesheet('checkpoint', './assets/checkpoint.png', {frameWidth: 1920,frameHeight:1080})
        this.load.spritesheet('dude', './assets/dude.png', {frameWidth:32, frameHeight:48});
    }

    create()
    {
        this.add.image(960, 270, 'sky');
        this.add.text(200,50,'Introduction to Phaser', {fill: '#ffffff'});
        //score here
        this.score = this.add.text(500, 50, 'Stars: 0', this.starsCollected);

        this.player = this.physics.add.sprite(100,400,'dude').setScale(2);
        this.player.setGravityY(400);
        this.player.setBounceY(0.4);
        this.player.setCollideWorldBounds(true);

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(10, 200, 'platform');
        this.platforms.create(500, 400, 'platform');
        this.platforms.create(400, 568, 'platform').setScale(2).refreshBody();

        this.stars = this.physics.add.group({
            collideWorldBounds: true,
            gravityY: 300,
            bounceY: 0.2,
            key: 'star',
            repeat: 10,
            setXY: { x: 20, y: 0, stepX: 75 },
        });
        
        this.checkpoint = this.physics.add.sprite(100,130, 'checkpoint').setScale(0.1).refreshBody();

        //collisions
        //star collect
        this.physics.add.overlap(this.player, this.stars,  this.collectStar, null, this);
        //reached checkpoint
        this.physics.add.overlap(this.player, this.checkpoint, this.reachedCheckpoint, null, this);
        
        //animations
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

        // Camera
        this.cam = this.cameras.main.setSize(800, 600);
        this.cam.setZoom(1);
        this.cameras.main.setBounds(0, 0, 1920,600);
        this.cam.startFollow(this.player, false, 50, 50);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {

        //animations for player
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
        else if(this.cursors.space.isDown) {
            this.player.setVelocityY(-160);
            this.player.anims.play('turn');
        }
        else {
            //no need for a gravity force if there's already one.
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        //collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);

        
    }
    
    collectStar (player, star)
        {
            star.disableBody(true, true);
             //counter here!
            this.starsCollected++;
            this.score.setText('Stars: ' + this.starsCollected);
            star.destroy();
        }

    reachedCheckpoint(){
        this.scene.start('scene2');
    }

}

class NextLevel extends Phaser.Scene{
    constructor ()
    {
        super({key: 'scene2'});
    }

    preload()
    {
        this.load.image('scene2', './assets/scene2.png');
    }

    create()
    {
        this.active = true;
        this.add.image(400, 300, 'scene2');
        this.add.text(200, 100, 'This is Scene B', {fontSize: '32px', fill: '#000'});
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

=======
class PhaserTutorialSessionTwo extends Phaser.Scene{

   
    constructor() {
        super('GameScene');
        //class variables here
        this.player = null;
        this.cursors = null;
        this.platforms = null;
        this.starsCollected = 0;
        this.score = null;
        this.cam;
    }

    //functions when needed go here
    preload()
    {
        this.load.image('platform', './assets/platform.png');
        this.load.image('sky', './assets/environment.jpg');
        this.load.image('star', './assets/star.png');
        this.load.image('secondscene', './assets/scene2.png');

        this.load.spritesheet('checkpoint', './assets/checkpoint.png', {frameWidth: 1920,frameHeight:1080})
        this.load.spritesheet('dude', './assets/dude.png', {frameWidth:32, frameHeight:48});
    }

    create()
    {
        this.add.image(960, 270, 'sky');
        this.add.text(200,50,'Introduction to Phaser', {fill: '#ffffff'});
        //score here
        this.score = this.add.text(500, 50, 'Stars: 0', this.starsCollected);

        this.player = this.physics.add.sprite(100,400,'dude').setScale(2);
        this.player.setGravityY(400);
        this.player.setBounceY(0.4);
        this.player.setCollideWorldBounds(true);

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(10, 200, 'platform');
        this.platforms.create(500, 400, 'platform');
        this.platforms.create(400, 568, 'platform').setScale(2).refreshBody();

        this.stars = this.physics.add.group({
            collideWorldBounds: true,
            gravityY: 300,
            bounceY: 0.2,
            key: 'star',
            repeat: 10,
            setXY: { x: 20, y: 0, stepX: 75 },
        });
        
        this.checkpoint = this.physics.add.sprite(100,130, 'checkpoint').setScale(0.1).refreshBody();

        //collisions
        //star collect
        this.physics.add.overlap(this.player, this.stars,  this.collectStar, null, this);
        //reached checkpoint
        this.physics.add.overlap(this.player, this.checkpoint, this.reachedCheckpoint, null, this);
        
        //animations
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

        // Camera
        this.cam = this.cameras.main.setSize(800, 600);
        this.cam.setZoom(1);
        this.cameras.main.setBounds(0, 0, 1920,600);
        this.cam.startFollow(this.player, false, 50, 50);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {

        //animations for player
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
        else if(this.cursors.space.isDown) {
            this.player.setVelocityY(-160);
            this.player.anims.play('turn');
        }
        else {
            //no need for a gravity force if there's already one.
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        //collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);

        
    }
    
    collectStar (player, star)
        {
            star.disableBody(true, true);
             //counter here!
            this.starsCollected++;
            this.score.setText('Stars: ' + this.starsCollected);
            star.destroy();
        }

    reachedCheckpoint(){
        this.scene.start('scene2');
    }

}

class NextLevel extends Phaser.Scene{
    constructor ()
    {
        super({key: 'scene2'});
    }

    preload()
    {
        this.load.image('scene2', './assets/scene2.png');
    }

    create()
    {
        this.active = true;
        this.add.image(400, 300, 'scene2');
        this.add.text(200, 100, 'This is Scene B', {fontSize: '32px', fill: '#000'});
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

>>>>>>> 4df1b3d58d5d304c4416dd7fcddade92a243ba54
const game = new Phaser.Game(config);