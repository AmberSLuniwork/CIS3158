//this scene serves as an introduction to moving and interacting with the environment.
    //side note - my laptop's g key is missing, but I copy/paste it in where i can - expect odd spelling.
export default class outsideScene extends Phaser.Scene {
    constructor() {
        //you need the super for imports!
        super('outsideScene');
        //class variables
        this.player;
        this.cursors;
        this.gameMenuContainer;
        this.HUDcontainer;
        this.items;
        this.coinCount = 0; //not really a score, it's to keep track of player coins.
        this.isDoorOpen = false;
    }
    //functions
    preload(){

    }

    create(){
        //hud loadin in!
        if (!this.scene.isActive('HUDScene')) {
            this.scene.launch('HUDScene');
            this.scene.bringToTop('HUDScene');
        }

        //stuff for hud, needs to be continuous.
        this.registry.set('coins', 0);
        this.registry.set('inventory', []);

        this.stormAmbiance = this.sound.add('stormambiance', {
            loop: true, 
            volume: 0.4,
            seek: 3 // so the track plays three seconds in - no weird start up noise.
        });
        this.stormAmbiance.play();

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

        //spritesheet
        this.player = this.physics.add.sprite(300, 350, 'player').setScale(2).setDepth(200);
        this.player.setCollideWorldBounds(false);
        this.player.setGravityY(400)

        //camera for player
        this.cameras.main.setSize(800, 600);
        this.cameras.main.setBounds(0, 0, 1500, screen.height);
        this.cameras.main.startFollow(this.player, true, 0.1, 0, 0,100)

        //animations
            //player
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
            //shiny thin to indicate item
        this.anims.create({
            key:'shine',
            frames:this.anims.generateFrameNumbers('shiny', {start:0, end:7}),
            frameRate:8,
            repeat:-1,
            repeatDelay:5000
        })
        
        //invisible walls to left / riht of world
        this.leftWall = this.physics.add.staticImage(-10, this.scale.width/2, 'invisible');
        this.leftWall.setSize(5, screen.height);
        this.leftWall.setVisible(false);
        this.rightWall = this.physics.add.staticImage(1510, this.scale.width/2, 'invisible');
        this.rightWall.setSize(5, screen.height);
        this.rightWall.setVisible(false);

        //floor!
        this.pavement = this.add.tileSprite(400, 460, 1500, 32, 'pavement').setScale(2).setDepth(90);
        const pavementBody = this.physics.add.staticImage(this.scale.width/2, this.pavement.y, null);
        pavementBody.setSize(screen.width * 2, 66)

        //question mark. appears when player is near a shiny.
        this.indicator = this.add.text(this.player.x, this.player.y - 100, '?', {
            fill:'#ffffff'
        });
        this.indicator.setOrigin(0.5).setDepth(199);
        this.indicator.setVisible(false); //shouldn't be immediately visible.

        //functions
        this.makeBackground();
        this.makeRain();
        this.placeItems();
        this.add.image(1250, 300, 'schoolex').setScale(2);

        this.schoolDoor = this.physics.add.image(1400, 370, 'schooldoor').setScale(2);
        this.isDoorOpen = false; 

        //collisions
            //player with floor
        this.physics.add.collider(this.player, pavementBody);
            //player with invisible walls
        this.physics.add.collider(this.player, this.leftWall);
        this.physics.add.collider(this.player, this.rightWall);
            //player interactin with shiny
        this.physics.add.overlap(this.player, this.items, this.shinyPlayerOverlap, null, this);
        this.physics.add.overlap(this.player, this.schoolDoor, this.checkDoor, null, this)
    }

    update(){
        //movin lon stuff out of the update method to make this easier on my eyes.
        //player movement call
        this.movePlayer()

        //so they don't become trapped in the void - failsafe.
        if (this.player.y > 800){
            this.player.x = 300
            this.player.y = 350
            console.log('oops! you fell out of the world!')
        }

        //camera related
            //cloud parallax!
        const cameraX = this.cameras.main.scrollX;
        this.cloudsBig.tilePositionX = cameraX * 0.05;
        this.cloudsMed.tilePositionX = cameraX * 0.1;
        this.cloudsSmall.tilePositionX = cameraX * 0.25;

        //make sure indicator follows player
        this.indicator.setPosition(this.player.x, this.player.y - 55)
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
        this.background = this.add.tileSprite(0, 0, this.cameras.main.width , this.cameras.main.height, 'bg').setScale(2).setOrigin(0).setDepth(1);

        this.cloudsBig = this.add.tileSprite(0, -90, this.cameras.main.width * 2, this.cameras.main.height, 'clouds3').setOrigin(0).setDepth(100)
        this.cloudsMed = this.add.tileSprite(0, -100, this.cameras.main.width * 2, this.cameras.main.height, 'clouds2').setOrigin(0)
        this.cloudsSmall = this.add.tileSprite(0, -90, this.cameras.main.width * 2, this.cameras.main.height, 'clouds1').setOrigin(0)

        //addin trees!
        const treeTypes = ['tree1', 'tree2', 'tree3'];
        const treeGroup = this.physics.add.group();
        const numberOfTrees = 8; //i want the place to feel a bit crowded with trees.
        const yPosition = 280;
        const spaceBetweenTrees = Phaser.Math.Between(50, 150);

        let lastTreeX=0;

        for (let i = 0; i < numberOfTrees; i++) {
            const randomX = Phaser.Math.Between(lastTreeX + spaceBetweenTrees, lastTreeX + 2 * spaceBetweenTrees);
            lastTreeX = randomX
            const randomTreeType = Phaser.Math.RND.pick(treeTypes); // Pick a random tree type. could use this rnd.pick function for turn based combat :D

            const tree = this.physics.add.sprite(randomX, yPosition, randomTreeType);
            treeGroup.add(tree);
            tree.setScale(2);
            tree.setRotation(Phaser.Math.FloatBetween(-0.15, 0.15));
            tree.setDepth(6);

            treeGroup.add(tree);
        }

        this.bench = this.add.image(800, 380, 'bench').setScale(2).setOrigin(0);

        this.backgroundContainer = this.add.container(0, 0, [this.background, this.cloudsBig, this.cloudsMed, this.cloudsSmall]);    
        treeGroup.getChildren().forEach(tree => {
            this.backgroundContainer.add(tree);
        });
        this.backgroundContainer.add(this.bench); //the layerin was weird. need to add this last so its on top of everythin.
        //this.backgroundContainer.setVisible(false)
    }
    makeRain(){
        const particles = this.add.particles('raindrop');
        const emitter = particles.createEmitter({
            x: {min: 0, max:screen.width}, //so it's across the whole screen.
            y: 0, //i should hope that all rain comes from the sky!
            speedY: Phaser.Math.FloatBetween(1500, 2000),
            speedX: -90,
            lifespan: 230, //this is in milliseconds.
            quantity: 10,
            alpha: {
                start: 0.8,
                end: 0.5,
            },
            depth: 100000
        });
        emitter.setScaleY(Phaser.Math.FloatBetween(4, 6))
        //console.log(emitter.active) //checkin to see if rain is happenin, it's vanishd for some reason.
    }
    //adds a shiny to where the items are placed. tag means the player can pick up coins OR a key.
    placeItems(){
        this.items = this.physics.add.group();
        const itemData = [
            {x:50, y:425, id:'coins'},
            {x:815, y:402, id:'School Key'}
        ];

        itemData.forEach(data => {
            const shiny = this.add.sprite(data.x, data.y, 'shiny').setScale(2).setDepth(100); //so it always appears on top of everythin.
            shiny.play('shine');
            shiny.itemID = data.id;
            this.items.add(shiny);
        });
    }

    //interactions
    shinyPlayerOverlap(player, shiny){
        console.log('youre on top of the shiny')
        if(shiny.active){
            this.indicator.setVisible(true);
            this.input.keyboard.once('keydown-E', () => {
                if(shiny.active && shiny.visible){
                    //console.log(`collected item: ${shiny.itemID}`);
                    shiny.setActive(false);
                    shiny.destroy();
                    this.indicator.setVisible(false);
                    this.player.inventory = this.player.inventory || []; //the || means that if the array doesn't exist, make it, and if it does, use it!
                    this.player.inventory.push(shiny.itemID);
                    const currentInventory = this.registry.get('inventory') || [];
                    this.registry.set('inventory', [...currentInventory, shiny.itemID]);

                    if(shiny.itemID === 'coins') {
                        console.log(`Hey, there's some loose change here!`)
                        const currentCoins = this.registry.get('coins') || 0;
                        this.registry.set('coins', currentCoins + 5);
                    } else if (shiny.itemID === 'School Key'){
                        console.log('I think this is the key to the school.')
                    }
                } else {
                    this.indicator.setVisible(false);
                }
            });
        }
        
    }
    checkDoor(player, schoolDoor) {
        // When the player overlaps with the door, check if the door is open or not
        if (this.isDoorOpen) {
            // Door is open, proceed to enter or other actions
            console.log(`It's open. I should get inside and wait for this storm to blow over.`);
        } else {
            // Door is closed, initiate the interaction to open it
            this.playerOpenDoor(player, schoolDoor);
        }
    }
    
    playerOpenDoor(player, schoolDoor) {
        // Wait for the 'E' key press to try and open the door
        this.input.keyboard.once('keydown-E', () => {
            // If the player has the key to open the door, unlock it
            if (this.player.inventory.includes('School Key')) {
                console.log('The door opened!');
                const updatedInventory = this.player.inventory.filter(item => item !== 'School Key');
                this.player.inventory = updatedInventory;
                this.registry.set('inventory', updatedInventory);
                this.isDoorOpen = true; // Door state updated to open
            } else {
                console.log('The door is locked. You need a key!');
            }
        });
    }
}