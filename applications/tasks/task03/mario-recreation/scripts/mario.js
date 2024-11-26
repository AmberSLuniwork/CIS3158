class PhaserTutorialSessionTwo extends Phaser.Scene{

   
    constructor() {
        super();
        //class variables here
        this.mario = null;
        this.cursors = null;
        this.floorBlocksOne = null;
        this.floorBlocksTwo = null;
        this.bricks = null;
        this.itemboxes = null;
    }

    //functions when needed go here
    preload()
    {
        this.load.image('block', './assets/block.png');
        this.load.image('brick', './assets/brick.png');
        this.load.image('bush', './assets/bush.png');
        this.load.image('cloud', './assets/cloud.png');
        this.load.image('coin', './assets/coin.png');
        this.load.image('goomba', './assets/goomba.png');
        this.load.image('itembox', './assets/itembox.png');
        this.load.image('mario', './assets/mario.png');
        this.load.image('mountain', './assets/mountain.png');
        this.load.image('pipe', './assets/pipe.png');
        this.load.image('itembox_used', './assets/itemboxused.png')
        this.load.image('mushroom', './assets/mushroom.png')

        this.load.spritesheet('itemboxsprite', './assets/itemboxsprite.png', {frameWidth:16, frameHeight:16})
    }

    create()
    {
        //Likely all need to be scaled to two because they're small.
        //blocks
            this.floorBlocksOne = this.physics.add.staticGroup({
                key: 'block',
                repeat: 27,
                setXY: { x: -12, y: 584 , stepX: 32 }
            })
            this.floorBlocksOne.children.iterate((block) => {
                block.setScale(2);
                block.refreshBody();
            })
            this.floorBlocksTwo = this.physics.add.staticGroup({
                key: 'block',
                repeat: 27,
                setXY: { x: -12, y: 552 , stepX: 32 }
            })
            this.floorBlocksTwo.children.iterate((block) => {
                block.setScale(2);
                block.refreshBody();
            })

        //3 bricks
            this.bricks = this.physics.add.staticGroup()
            this.bricks.create(600, 400, 'brick').setScale(2).refreshBody();
            this.bricks.create(536, 400, 'brick').setScale(2).refreshBody();
            this.bricks.create(664, 400, 'brick').setScale(2).refreshBody();

        //4 itemboxes
            this.itemboxes = this.physics.add.staticGroup()
            this.itemboxes.create(600, 250, 'itemboxsprite').setScale(2).refreshBody();
            this.itemboxes.create(568, 400, 'itemboxsprite').setScale(2).refreshBody();
            this.itemboxes.create(632, 400, 'itemboxsprite').setScale(2).refreshBody();
            this.itemboxes.create(320, 400, 'itemboxsprite').setScale(2).refreshBody();

        //other bg elements
            this.add.image(670, 520, 'bush').setScale(2);
            this.add.image(220, 520, 'bush').setScale(2);
            this.add.image(160, 520, 'bush').setScale(2);
            this.add.image(100, 520, 'bush').setScale(2);
            this.add.image(360, 502, 'mountain').setScale(2);
            this.add.image(545, 125, 'cloud').setScale(2);
        
        //text
            this.add.text(75,50,'MARIO', {fill: '#ffffff', fontSize: '28px'});
            this.add.image(285, 92, 'coin').setScale(2);
            this.add.text(300,75,'x00', {fill: '#ffffff', fontSize: '28px'});
            this.add.text(500,50,'WORLD', {fill: '#ffffff', fontSize: '28px'});
            this.add.text(675,50,'TIME', {fill: '#ffffff', fontSize: '28px'});
            this.add.text(75,75,'000000', {fill: '#ffffff', fontSize: '28px'});
            this.add.text(520,75,'1-1', {fill: '#ffffff', fontSize: '28px'});
            this.add.text(695,75,'382', {fill: '#ffffff', fontSize: '28px'});
        
        //mario and goomba! keeping separate in case sprites are needed instead.
            this.mario = this.physics.add.image (400, 430, 'mario').setScale(2);
            this.mario.setGravityY(1000);
            this.mario.setCollideWorldBounds(true);

            this.goomba = this.physics.add.group()
            this.goomba.create(554, 520, 'goomba').setScale(2).refreshBody();

        //mushrooms
            this.mushrooms = this.physics.add.group();
            //leave empty for now, need it for collider stuff

            this.physics.add.overlap(this.mario, this.goomba,  this.marioDeath, null, this);
            
            this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {

        //mario animations
        if (this.cursors.left.isDown) {
            this.mario.setVelocityX(-160);
        } 
        else if (this.cursors.right.isDown) {
            this.mario.setVelocityX(160);
        }
        else if(this.cursors.space.isDown) {
            this.mario.setVelocityY(-500);
        }
        else {
            this.mario.setVelocityX(0);
        }

        //collisions
        this.physics.add.collider(this.mario, this.floorBlocksTwo);
        this.physics.add.collider(this.mario, this.bricks);
        this.physics.add.collider(this.mario, this.itemboxes, this.hitItemboxBottom, null, this);
        //overlaps
       
        this.physics.add.overlap(this.mario, this.mushrooms, this.marioGrow, null, this);
    }
    marioDeath(mario, goomba)
    {
        //stop the game! he's dead!
        this.physics.pause();

        //game over text
        const gameOverText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'GAME OVER', {fontSize: '80px'}).setOrigin(.5, .5);
    }

    hitItemboxBottom(mario, itembox)
    {
        //IF the BODY (that box around the sprite) TOUCHES the box AND the part being touched is the BOTTOM, this happens.
        if(mario.body.touching.down && mario.getBounds().top <= itembox.getBounds().bottom){
            itembox.setTexture('itembox_used');
            //no more collisions to stop infinite mushrooms
            this.physics.world.colliders.getActive().forEach(collider => {
                collider.active = false;
            });

            //mushroom time!
            this.time.delayedCall(500, () => {
            //the -40 means it'll spawn ABOVE the box.
            const mushroom = this.mushrooms.create(itembox.x, itembox.y - 40, 'mushroom').setScale(2).refreshBody();
            });
        }
    }
    
    marioGrow(mario, mushroom){
        mushroom.destroy();
        mario.setScale(mario.scale * 2);
        mario.refreshBody();
    };


}


//Game config
const config = {
    parent: 'game-container',
    type:Phaser.AUTO,
    width: 800, 
    height: 600,
    //https://stackoverflow.com/questions/59332460/how-to-set-background-color-of-phaser-3-game-during-runtime
    backgroundColor: '#5c94fc',
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