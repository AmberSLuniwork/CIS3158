export default class menuScene extends Phaser.Scene{

    constructor(){
        super('menuScene');
        this.cursors;
    }

    preload(){
    }

    create(){
        //images
        this.add.image(400, 300, 'menubg').setScale(2);

        //main music
        this.menuMusic = this.sound.add('menumusic', {
            loop: true, 
            volume: 0.2});
        this.menuMusic.play();
        //ambiance
        this.busAmbiance = this.sound.add('busambiance', {
            loop: true, 
            volume: 0.3});
        this.busAmbiance.play();
        //i found out how to use functions! no more swathes of code for me :D 
        this.createMenu();
        //text
        this.add.text(30,575,'Produced as coursework for CIS3158', {fill: '#ffffff', fontSize: '16px'});
    }

    update(){

    }

    //makes the actual menu.
    createMenu() {
        // Menu text elements
        this.playText = this.add.text(30, 50, 'PLAY', { 
            fill: '#ffffff', fontSize: '32px', resolution: 2 
        }).setInteractive();

        this.optionsText = this.add.text(30, 125, 'OPTIONS', { 
            fill: '#ffffff', fontSize: '32px', resolution: 2 
        }).setInteractive();

        this.creditsText = this.add.text(30, 200, 'CREDITS', { 
            fill: '#ffffff', fontSize: '32px', resolution: 2 
        }).setInteractive();

        //hover and click events for menu items
        this.menuInteractions();
    }

    menuInteractions() {
        // PLAY button
        this.playText.on('pointerover', () => {
            this.playText.setStyle({fontStyle: 'bold' });
            this.sound.play('menuhover', { volume: 0.3 });
        });

        this.playText.on('pointerout', () => {
            this.playText.setStyle({fontStyle: 'normal' });
        });

        this.playText.on('pointerdown', () => {
            this.busAmbiance.stop();
            this.menuMusic.stop();
            this.sound.play('menuselect', { volume: 0.3 });
            this.scene.start('introScene'); // this starts the ame!
        });

        //OPTIONS button
        this.optionsText.on('pointerover', () => {
            this.optionsText.setStyle({ fontStyle: 'bold' });
            this.sound.play('menuhover', { volume: 0.3 });
        });

        this.optionsText.on('pointerout', () => {
            this.optionsText.setStyle({ fontStyle: 'normal' });
        });

        this.optionsText.on('pointerdown', () => {
            this.showOptions();
            this.sound.play('menuselect', { volume: 0.3 })
        });

        // CREDITS button
        this.creditsText.on('pointerover', () => {
            this.creditsText.setStyle({ fontStyle: 'bold' });
            this.sound.play('menuhover', { volume: 0.3 });
        });

        this.creditsText.on('pointerout', () => {
            this.creditsText.setStyle({ fontStyle: 'normal' });
        });

        this.creditsText.on('pointerdown', () => {
            this.showCredits();
            this.sound.play('menuselect', { volume: 0.3 })
        });
    }

    showOptions(){

    }

    showCredits(){
        //remove other text
        this.playText.destroy();
        this.optionsText.destroy();
        this.creditsText.destroy();

        //backround darker so can see text easier
        this.darken = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

        //back button!
        this.backText = this.add.text(30, 50, 'BACK', { 
            fill: '#ffffff', fontSize: '32px', resolution: 2 
        }).setInteractive();
        this.backText.on('pointerover', () => {
            this.backText.setStyle({ fontStyle: 'bold' });
            this.sound.play('menuhover', { volume: 0.3 });
        });
        this.backText.on('pointerout', () => {
            this.backText.setStyle({fontStyle: 'normal' });
        });
        this.backText.on('pointerdown', () => {
            this.showMenu();
            this.sound.play('menuselect', { volume: 0.3 });
        });

        //actual credits content here
        //need to format the lists weirdly otherwise the indentations go funky
        this.creditsTextContent = this.add.text(100, 100, 
            `Menu music:
    Signal To Noise
    Composer: Scott Buckley
    Website: https://youtube.com/user/musicbyscottb
    License: Free To Use YouTube license
    Music powered by BreakingCopyright

Bus ambiance:        
    Sound Effect by freesound_community from Pixabay

Menu sound effects:
    Driken Stan from Pixabay`, 
            { 
                fill: '#ffffff', 
                fontSize: '18px', 
            });
    }

    showMenu() {
        // Remove credits elements
        this.creditsTextContent.destroy();
        this.backText.destroy();
        this.darken.destroy();

        // Recreate menu
        this.createMenu();
    }
}