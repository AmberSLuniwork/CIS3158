class asteroidExplosion extends Phaser.Scene{

    preload(){

    }
    
    create(){

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
    scene: asteroidExplosion,
    physics: {
        default: 'arcade',
    }
}

const game = new Phaser.Game(config);