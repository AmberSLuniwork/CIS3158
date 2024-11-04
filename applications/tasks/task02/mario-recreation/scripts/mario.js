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
    }

    create()
    {
        //images, likely all need to be scaled to two because they're small.
        //blocks. SO MANY BLOCKS 
        //first row
            this.add.image(820, 584, 'block').setScale(2);
            this.add.image(788, 584, 'block').setScale(2);
            this.add.image(756, 584, 'block').setScale(2);
            this.add.image(724, 584, 'block').setScale(2);
            this.add.image(692, 584, 'block').setScale(2);
            this.add.image(660, 584, 'block').setScale(2);
            this.add.image(628, 584, 'block').setScale(2);
            this.add.image(596, 584, 'block').setScale(2);
            this.add.image(564, 584, 'block').setScale(2);
            this.add.image(532, 584, 'block').setScale(2);
            this.add.image(500, 584, 'block').setScale(2);
            this.add.image(468, 584, 'block').setScale(2);
            this.add.image(436, 584, 'block').setScale(2);
            this.add.image(404, 584, 'block').setScale(2);
            this.add.image(372, 584, 'block').setScale(2);
            this.add.image(340, 584, 'block').setScale(2);
            this.add.image(308, 584, 'block').setScale(2);
            this.add.image(276, 584, 'block').setScale(2);
            this.add.image(244, 584, 'block').setScale(2);
            this.add.image(212, 584, 'block').setScale(2);
            this.add.image(244, 584, 'block').setScale(2);
            this.add.image(180, 584, 'block').setScale(2);
            this.add.image(148, 584, 'block').setScale(2);
            this.add.image(116, 584, 'block').setScale(2);
            this.add.image(84, 584, 'block').setScale(2);
            this.add.image(52, 584, 'block').setScale(2);
            this.add.image(20, 584, 'block').setScale(2);
            this.add.image(-12, 584, 'block').setScale(2);
        //second row
            this.add.image(820, 552, 'block').setScale(2);
            this.add.image(788, 552, 'block').setScale(2);
            this.add.image(756, 552, 'block').setScale(2);
            this.add.image(724, 552, 'block').setScale(2);
            this.add.image(692, 552, 'block').setScale(2);
            this.add.image(660, 552, 'block').setScale(2);
            this.add.image(628, 552, 'block').setScale(2);
            this.add.image(596, 552, 'block').setScale(2);
            this.add.image(564, 552, 'block').setScale(2);
            this.add.image(532, 552, 'block').setScale(2);
            this.add.image(500, 552, 'block').setScale(2);
            this.add.image(468, 552, 'block').setScale(2);
            this.add.image(436, 552, 'block').setScale(2);
            this.add.image(404, 552, 'block').setScale(2);
            this.add.image(372, 552, 'block').setScale(2);
            this.add.image(340, 552, 'block').setScale(2);
            this.add.image(308, 552, 'block').setScale(2);
            this.add.image(276, 552, 'block').setScale(2);
            this.add.image(244, 552, 'block').setScale(2);
            this.add.image(212, 552, 'block').setScale(2);
            this.add.image(244, 552, 'block').setScale(2);
            this.add.image(180, 552, 'block').setScale(2);
            this.add.image(148, 552, 'block').setScale(2);
            this.add.image(116, 552, 'block').setScale(2);
            this.add.image(84, 552, 'block').setScale(2);
            this.add.image(52, 552, 'block').setScale(2);
            this.add.image(20, 552, 'block').setScale(2);
            this.add.image(-12, 552, 'block').setScale(2);
        //3 bricks
            this.add.image(600, 400, 'brick').setScale(2);;
            this.add.image(536, 400, 'brick').setScale(2);;
            this.add.image(664, 400, 'brick').setScale(2);;
        //4 itemboxes
            //top one. this is near the cloud, go from that as a ref point.
            this.add.image(600, 250, 'itembox').setScale(2);;
            //rest of em in a row.
            this.add.image(568, 400, 'itembox').setScale(2);;
            this.add.image(632, 400, 'itembox').setScale(2);;
            this.add.image(320, 400, 'itembox').setScale(2);;
        //other bg elements
            this.add.image(670, 520, 'bush').setScale(2);
            this.add.image(220, 520, 'bush').setScale(2);
            this.add.image(160, 520, 'bush').setScale(2);
            this.add.image(100, 520, 'bush').setScale(2);
            this.add.image(360, 502, 'mountain').setScale(2);
            this.add.image(545, 125, 'cloud').setScale(2);
        //text
            this.add.text(75,50,'MARIO', {fill: '#ffffff'}).setScale(2);
            this.add.image(285, 92, 'coin').setScale(2);
            this.add.text(300,75,'x00', {fill: '#ffffff'}).setScale(2);
            this.add.text(500,50,'WORLD', {fill: '#ffffff'}).setScale(2);
            this.add.text(675,50,'TIME', {fill: '#ffffff'}).setScale(2);
            this.add.text(75,75,'000000', {fill: '#ffffff'}).setScale(2);
            this.add.text(520,75,'1-1', {fill: '#ffffff'}).setScale(2);
            this.add.text(695,75,'382', {fill: '#ffffff'}).setScale(2);
        //mario and goomba! keeping separate in case sprites are needed instead.
            this.add.image(400, 430, 'mario').setScale(2);
            this.add.image(554, 520, 'goomba').setScale(2);
    }

    update() {
    }



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