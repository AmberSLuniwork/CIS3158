export default class introScene extends Phaser.Scene {
    constructor() {
        super('introScene');
        //class variables
        this.player;
        this.cursors;
        this.gameMenuContainer;
    }
    //functions
    preload(){

    }

    create(){

        //toggle menu on esc key!
        this.input.keyboard.on('keydown-ESC', () => {
            if (this.gameMenuContainer) {
                //if the menu is visible, destroy it
                this.destroyGameMenu();
            } else {
                //if no menu is visible, create it
                this.createGameMenu();
            }
        });

        this.makeBackground();

        //spritesheet
        this.player = this.physics.add.sprite(100, 200, 'player').setScale(2);
        this.player.setCollideWorldBounds(false);
        this.player.setGravityY(400)

        //camera for player
        this.cameras.main.setSize(800, 600);
        this.cameras.main.setBounds(0, 0, 1500, screen.height);
        this.cameras.main.startFollow(this.player, false, 0.1, 0)

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

        //rain
        const particles = this.add.particles('raindrop');
        const emitter = particles.createEmitter({
            x: {min: 0, max: screen.width}, //so it's across the whole screen.
            y: 0, //i should hope that all rain comes from the sky!
            speedY: Phaser.Math.FloatBetween(1500, 2000),
            speedX: -100,
            lifespan: 250, //this is in milliseconds.
            quantity: 4,
            alpha: {
                start: 0.8,
                end: 0.5,
            },
            depth: Phaser.Math.FloatBetween(1, 3)
        });
        emitter.setScaleY(Phaser.Math.FloatBetween(4, 6))

        //floor!
        this.pavement = this.add.tileSprite(400, 460, screen.width, 33, 'pavement').setScale(2);
        const pavementBody = this.physics.add.staticImage(this.scale.width/2, this.pavement.y, null);
        pavementBody.setSize(screen.width * 2, 66)

        //collisions
        //player with floor
        this.physics.add.collider(this.player, pavementBody);
    }

    update(){
        //movin lon stuff out of the update method to make this easier on my eyes.
        //player movement call
        this.movePlayer()

        //so they don't become trapped in the void! If I'm dumb enouh to, so are they!
        if (this.player.y > 800){
            this.player.y = 200
            console.log('oops! you fell out of the world!')
        }

        //cloud parallax!
        const cameraX = this.cameras.main.scrollX;
        this.cloudsBig.tilePositionX = cameraX * 0.05;
        this.cloudsMed.tilePositionX = cameraX * 0.1;
        this.cloudsSmall.tilePositionX = cameraX * 0.25;
        
    }

    //player movement
    movePlayer(){
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

    //menu stuffs
    createGameMenu() {

        //stops multiple menus bein created when the esc key is pressed.
        if (this.gameMenuContainer) {
            return;
        }

        // similar to credits.
        const background = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        const menuText = this.add.text(30, 50, 'PAUSED', { 
            fontSize: '48px', 
            fill: '#ffffff', 
            fontStyle: 'bold'
            
        });

        // Back to Main Menu button
        const mainMenuButton = this.add.text(30, 150, 'Main Menu', { 
            fontSize: '32px', 
            fill: '#ffffff' 
        }).setInteractive();

        mainMenuButton.on('pointerover', () => {
            mainMenuButton.setStyle({fontStyle: 'bold' });
            this.sound.play('menuhover', { volume: 0.3 })
        });

        mainMenuButton.on('pointerout', () => {
            mainMenuButton.setStyle({fontStyle: 'normal' });
        });

        mainMenuButton.on('pointerdown', () => {
            this.scene.start('menuScene');
            this.sound.play('menuselect', { volume: 0.3 });
        });

        // Resume button
        const resumeButton = this.add.text(30, 200, 'Resume', { 
            fontSize: '32px', 
            fill: '#ffffff' 
        }).setInteractive();

        resumeButton.on('pointerover', () => {
            resumeButton.setStyle({fontStyle: 'bold' });
            this.sound.play('menuhover', { volume: 0.3 })
        });

        resumeButton.on('pointerout', () => {
            resumeButton.setStyle({fontStyle: 'normal' });
        });

        resumeButton.on('pointerdown', () => {
            this.destroyGameMenu();
            this.sound.play('menuselect', { volume: 0.3 });
        });

        // Group menu elements
        this.gameMenuContainer = this.add.container(0, 0, [background, menuText, mainMenuButton, resumeButton]);
        this.gameMenuContainer.setPosition(this.cameras.main.scrollX, this.cameras.main.scrollY);

        // Pause game physics and animations
        this.physics.pause();
        this.children.each((child) => {
            if (child.anims) child.anims.pause();
        });
    }
    destroyGameMenu() {
        // Destroy all menu elements
        if (this.gameMenuContainer) {
            this.gameMenuContainer.destroy();
            this.gameMenuContainer = null;

            // Resume game physics and animations
            this.physics.resume();
            this.children.each((child) => {
                if (child.anims) child.anims.resume();
            });
        }
    }

    //backround
    makeBackground(){
        //background image
        this.background = this.add.tileSprite(0, 0, this.cameras.main.width , this.cameras.main.height, 'bg').setScale(2).setOrigin(0);

        this.cloudsBig = this.add.tileSprite(0, -90, this.cameras.main.width * 2, this.cameras.main.height, 'clouds3').setOrigin(0);
        this.cloudsMed = this.add.tileSprite(0, -100, this.cameras.main.width * 2, this.cameras.main.height, 'clouds2').setOrigin(0);
        this.cloudsSmall = this.add.tileSprite(0, -90, this.cameras.main.width * 2, this.cameras.main.height, 'clouds1').setOrigin(0);
    }
}