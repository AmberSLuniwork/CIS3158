import menuScene from './scenes/menu.js';
import outsideScene from './scenes/outside.js';
import HUDScene from './scenes/HUD.js';

class loadScene extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // Add a background color
        this.cameras.main.setBackgroundColor('#000');

        // loading bar
        const barWidth = 600;
        const barHeight = 60;
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        const loadingBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(centerX - barWidth / 2, centerY - barHeight / 2, barWidth, barHeight);

        const loadingText = this.add.text(centerX, centerY - 50, 'Loading...', {
            fill: '#ffffff', 
            fontSize: '28px',
        }).setOrigin(0.5);

        const percentText = this.add.text(centerX, centerY, '0%', {
            fill: '#ffffff',
            fontSize: '28px',
        }).setOrigin(0.5);

        // Update the loading bar and percentage text during loading
        this.load.on('progress', (value) => {
            loadingBar.clear();
            loadingBar.fillStyle(0xffffff, 1);
            loadingBar.fillRect(centerX - barWidth / 2, centerY - barHeight / 2, barWidth * value, barHeight);
            percentText.setText(`${Math.floor(value * 100)}%`);
        });

        // Remove loading bar and show "Loading Complete" when done
        this.load.on('complete', () => {
            loadingText.setText('Done!');
            loadingBar.destroy();
            progressBox.destroy();
            percentText.destroy();
            this.scene.start('menuScene');
        });

        //so i have found that if the assets are loaded in one scene, i don't have to load them in the next.
        //therefore...
        //ALL OF THE ASSETS!!!
        //side note: could i store these in a json file instead? could be nice to reduce processin times.

        //audio
        this.load.audio('menumusic','./assets/music/Signal-To-Noise.mp3')
        this.load.audio('menuhover','./assets/soundeffects/retro-select-236670.mp3')
        this.load.audio('menuselect','./assets/soundeffects/retro-blip-236676.mp3')
        this.load.audio('busambiance', './assets/environments/bus-interior-22321.mp3')
        this.load.audio('stormambiance','./assets/environments/thunderstorm-with-heavy-rain1wav-14586.mp3')

        //sprites / items
        this.load.spritesheet('player', './assets/sprites/player-spritesheet.png', {frameWidth:30, frameHeight:45})
        this.load.spritesheet('shiny','./assets/sprites/shiny-thing.png',{frameWidth:11, frameHeight:17})
        this.load.image('coin', './assets/items/coin.png')

        //other images
        this.load.image('raindrop', './assets/particles/raindrop.png')
        this.load.image('menubg', './assets/environments/main-menu-cover.png')
        this.load.image('pavement', './assets/environments/pavement.png')
        this.load.image('bg', './assets/environments/background.png')
        this.load.image('invisible', './assets/invisiblewall.png')
        this.load.image('bench', './assets/environments/bench.png')
        this.load.image('schoolex', './assets/environments/school-exterior.png')
        this.load.image('schooldoor', './assets/environments/school-door.png')

        //trees
        this.load.image('tree1','./assets/environments/tree-1.png')
        this.load.image('tree2', './assets/environments/tree-2.png')
        this.load.image('tree3', './assets/environments/tree-3.png')

        //clouds
        this.load.image('clouds1', './assets/environments/clouds-1.png')
        this.load.image('clouds2', './assets/environments/clouds-2.png')
        this.load.image('clouds3', './assets/environments/clouds-3.png')
    }
}

//config

const config = {
    type:Phaser.AUTO,
    width:800,
    height:600,
    backgroundColor: '#e6e6e6',
    parent: 'game-container',
    scene: [
        loadScene,
        menuScene,
        HUDScene,
        outsideScene,
    ],
    physics: {
        default: 'arcade',
            arcade: {
                debug: true
            }
    },
    //this makes my pixel art actually look nice! yay!!
    render: {
        pixelArt:true
    }
};

const game = new Phaser.Game(config);