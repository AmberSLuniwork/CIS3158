class coinSpin extends Phaser.Scene{

    constructor() {
        super({key:'coinSpin'});
    }

    preload(){
        this.load.atlas('assets', './assets/tweenparts.png', 'assets/tweenparts.json');

    }
    
    create() {
        const coin = this.add.sprite(400, 300, 'assets', 'GoldCoinPNGSequence0001');
    
        this.anims.create({
            key: 'spin',
            frames: [
                { key: 'assets', frame: 'GoldCoinPNGSequence0001' },
                { key: 'assets', frame: 'GoldCoinPNGSequence0002' },
                { key: 'assets', frame: 'GoldCoinPNGSequence0003' },
                { key: 'assets', frame: 'GoldCoinPNGSequence0004' },
                { key: 'assets', frame: 'GoldCoinPNGSequence0005' },
                { key: 'assets', frame: 'GoldCoinPNGSequence0006' },
            ],
            frameRate: 12,
            repeat: -1
        });
    
        coin.play('spin');
    }

    update(){

    }
    
}

const config = {
    parent: 'game-container',
    type:Phaser.AUTO,
    width: 800, 
    height: 600,
    transparency: true,
    scene: coinSpin,
    physics: {
        default: 'arcade',
    }
}

const game = new Phaser.Game(config);