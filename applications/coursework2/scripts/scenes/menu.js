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
            volume: 0.2,
            seek: 2
        });
        this.menuMusic.play();
        //ambiance
        this.busAmbiance = this.sound.add('busambiance', {
            loop: true, 
            volume: 0.3
        });
        this.busAmbiance.play();
        this.stormAmbiance = this.sound.add('stormambiance', {
            loop: true, 
            volume: 0.2
        });
        this.stormAmbiance.play();
        //i found out how to use functions! no more swathes of code for me :D 
        this.createMenu();
        //text
        this.add.text(30,575,'Produced as coursework for CIS3158', {fill: '#ffffff', fontSize: '16px' });
    }

    update(){
    }

    //makes the actual menu.
    createMenu() {
        // Menu text elements
        this.playText = this.add.text(30, 30, 'PLAY', { 
            fill: '#ffffff', fontSize: '32px', resolution: 2 
        }).setInteractive();

        this.howtoText = this.add.text(30, 90, 'HOW TO PLAY', {
            fill: '#ffffff', fontSize: '32px', resolution: 2 
        }).setInteractive();

        this.optionsText = this.add.text(30, 150, 'OPTIONS', { 
            fill: '#ffffff', fontSize: '32px', resolution: 2 
        }).setInteractive();

        this.creditsText = this.add.text(30, 210, 'CREDITS', { 
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
            this.stormAmbiance.stop();
            this.sound.play('menuselect', { volume: 0.3 });
            this.scene.start('outsideScene'); // this starts the ame!
        });

        //HOW TO PLAY button
        this.howtoText.on('pointerover', () => {
            this.howtoText.setStyle({ fontStyle: 'bold' });
            this.sound.play('menuhover', { volume: 0.3 });
        });

        this.howtoText.on('pointerout', () => {
            this.howtoText.setStyle({ fontStyle: 'normal' });
        });

        this.howtoText.on('pointerdown', () => {
            this.showHowTo();
            this.sound.play('menuselect', { volume: 0.3 })
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

    showHowTo(){
        this.playText.destroy();
        this.howtoText.destroy();
        this.optionsText.destroy();
        this.creditsText.destroy();

        //backround darker so can see text easier
        this.darken = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

        //back button!
        this.backText = this.add.text(30, 30, 'BACK', { 
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
            this.howtoTextContent.destroy();
            this.sound.play('menuselect', { volume: 0.3 });
        });

        //content!
        this.howtoTextContent = this.add.text(75, 75, 
`Movement
    To move, use the ARROW KEYS.
    To sprint, hold SHIFT while using the ARROW KEYS
        \n
Interaction
    When close enough to interact with objects, press E.
            `, 
                        { 
                            fill: '#ffffff', 
                            fontSize: '18px', 
                        });

    }

    showOptions(){
        this.playText.destroy();
        this.howtoText.destroy();
        this.optionsText.destroy();
        this.creditsText.destroy();

        //backround darker so can see text easier
        this.darken = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

        //back button!
        this.backText = this.add.text(30, 30, 'BACK', { 
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
        })
    }

    showCredits(){
        //remove other text
        this.playText.destroy();
        this.howtoText.destroy();
        this.optionsText.destroy();
        this.creditsText.destroy();

        //backround darker so can see text easier
        this.darken = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

        //back button!
        this.backText = this.add.text(30, 30, 'BACK', { 
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
            this.creditsTextContent.destroy();
            this.sound.play('menuselect', { volume: 0.3 });
        });

        //actual credits content here
        //need to format the lists weirdly otherwise the indentations go funky
        this.creditsTextContent = this.add.text(75, 75, 
`Music
    Menu
        Signal To Noise
        Composer: Scott Buckley
        Website: https://youtube.com/user/musicbyscottb
        License: Free To Use YouTube license
        Music powered by BreakingCopyright
        \n
Effects
    Bus ambiance | Thunderstorm
        Sound Effect by freesound_community from Pixabay
        \n
Sound effects
    Menu selection & hovers
        Driken Stan from Pixabay`, 
            { 
                fill: '#ffffff', 
                fontSize: '18px', 
            });
    }

    showMenu() {
        // Remove credits elements
        this.backText.destroy();
        this.darken.destroy();

        // Recreate menu
        this.createMenu();
    }
}