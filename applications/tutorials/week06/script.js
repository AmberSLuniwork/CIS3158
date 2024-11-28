class GameScene extends Phaser.Scene {

    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('bg', './assets/background.png');
        this.load.image('crate', './assets/crate.png');
    }

    create() {
        this.add.image(400, 300, 'bg');

        this.cameras.main.setSize(800, 500);
        this.cameras.main.setPosition(0, 100);

        for (let i = 0; i < 64; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            const box = this.add.image(x, y, 'crate');
            box.setInteractive();
        }

        this.input.on('gameobjectup', this.clickHandler, this);
    }

    clickHandler(pointer, box) {
        box.input.enabled = false;
        box.setVisible(false);
        this.events.emit('addScore');
    }

    update() 
    {

    }
}

class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: true });
        this.score = 0;
    }

    create() {
        //this displays the score
        const info = this.add.text(10, 10, 'Score: 0', { font: '48px Arial', fill: '#ffffff' });
        //this checks with the game scene for the add score event
        const ourGame = this.scene.get('GameScene');

        ourGame.events.on('addScore', function () {
            this.score += 10;
            //need backticks here, not quotation marks :]
            info.setText(`Score: ${this.score}`);
        }, this);
    }
}

//config
const config = {
    type: Phaser.AUTO,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: [GameScene, UIScene],
};

const game = new Phaser.Game(config);