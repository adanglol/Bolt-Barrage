// Loading our game
console.log('game.js has loaded');

// Player
import Player from './player.js';

// Projectiles
import Projectile from './projectiles.js';

class ConfigureScene extends Phaser.Scene {
    constructor(scenekey){
        super(scenekey);
        this.fontproperties = {fontSize: '48px', fontFamily: 'Pixelify Sans'};
    }

    preload(){
        // Preload our font
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        // Adding our microgamejamcontroller.js file script
        this.load.script('microgamejamcontroller', 'LIB/microgamejamcontroller.js');
        // Adding Bolt audio
        this.load.audio('twang','ASSETS/Twang.mp3');
        // music for game
        this.load.audio('music','ASSETS/Gam_Jam_Song_loop.mp3');
        // Adding our player sprite
        this.load.image('player','ASSETS/Char.PNG')
        // Adding BG 
        this.load.image('background','ASSETS/starBG.PNG')
        // Ship
        this.load.image('ship','ASSETS/SHIP.PNG')
        // Adding our projectile sprite
        this.load.image('projectile','ASSETS/BOLT.PNG')
        // Adding our platform sprite
        this.load.image('platform','ASSETS/platform.png')
    }

    create(){
        WebFont.load({
            google: {
                families: ['Pixelify Sans']
            },
            active: () => {
                this.scene.start('GameScene');
            },
        });
    }
}

class GameScene extends ConfigureScene {
    constructor(){
        super('GameScene');
        this.gotHit = false;
    }

    create(){

        // const gameWidth = this.scale.width;
        // const gameHeight = this.scale.height;
        const background = this.add.sprite(0,0, 'background');
        background.setOrigin(0,0);

        // add music to game
        this.sound.add('music');
        const music = this.sound.play('music');
        var gameController = MicrogameJamController(1, 3, true);
        gameController.SetMaxTimer(15, () => {
            // this.sounds.stop('music');
            // This is the callback function that is called when the timer runs out
            // IF THEY GET HIT GAME OVER IF NOT VICTORY
            this.sound.stopAll();
            if (!this.gotHit) {
                // gameController.WinGame();
                this.scene.start('Victory');
                // this.scene.restart();
            }
        });


        
        this.projectiles = [];
        
        // Create a timer that spawns projectiles every second
        this.projectileTimer = this.time.addEvent({
            delay : 1000,
            loop : true,
            callback: () => {
                // Define the range for the random Y position
                const minY = 100; // Minimum Y position
                const maxY = 400; // Maximum Y position

                // Generate a random Y position within the specified range
                const randomY = Phaser.Math.Between(minY, maxY);
                // Create a new projectile
                const projectile = new Projectile(this, 960, randomY, 'projectile');

                // projectile.setSize(20, 20);
                // projectile.setOffset(960, randomY);
                // Add the projectile to the projectiles array
                this.projectiles.push(projectile);
                // add sound to projectile
                this.sound.add('twang');
                this.sound.play('twang');
                
            }
        });



        // to check for second third platform
      

        // Create the player
        this.player = new Player(this, 0,0,'player');
        this.add.text(300, 0, 'Bolt Barrage', this.fontproperties);

        this.platforms = this.physics.add.staticGroup();

        const bottomPlatform = this.addPlatform(100, 530, 200, 20);
        const secondPlatform = this.addPlatform(100, 350, 200, 20);
        const thirdPlatform = this.addPlatform(100, 180, 200, 20);
        const fourthPlatform = this.addPlatform(100, 10, 200, 20);

        bottomPlatform.setVisible(false);
        secondPlatform.setVisible(false);
        thirdPlatform.setVisible(false);
        fourthPlatform.setVisible(false);
        const platformGroup = this.physics.add.group();

        const platform = this.add.sprite(0,0, 'platform');
        platform.setOrigin(0.04,-.27);
        this.physics.world.enable(platform);
        platform.body.immovable = false;
        platformGroup.add(platform);
        // Change the width of the platform
        const newWidth = 1500; // Set your desired width
        platform.setScale(newWidth / platform.displayWidth, 1);
        

        const platform2 = this.add.sprite(0,0, 'platform'); 
        platform2.setOrigin(.04,.05);
        this.physics.world.enable(platform2);
        platform2.body.immovable = false;
        platformGroup.add(platform);
        platform2.setScale(newWidth / platform2.displayWidth, 1);


        const platform3 = this.add.sprite(0,0, 'platform');
        platform3.setOrigin(.04,.35);
        this.physics.world.enable(platform3);
        platform3.body.immovable = false;
        platformGroup.add(platform);
        platform3.setScale(newWidth / platform3.displayWidth, 1);

        const platform4 = this.add.sprite(0,0, 'platform');
        platform4.setOrigin(.04,.65);
        this.physics.world.enable(platform4);
        platform4.body.immovable = false;
        platformGroup.add(platform);
        platform4.setScale(newWidth / platform4.displayWidth, 1);



        // const enemyPlatform = this.addPlatform(850, 270, 200, 500);
        const enemyShip = this.add.sprite(0,0, 'ship');
        enemyShip.setOrigin(0,0);
       

        // Set up collision between player and platforms
        this.physics.add.collider(this.player, this.platforms, (player, platform) => {
            // Collision with bottom platform
            if (platform === bottomPlatform) {
                // move player to top of platform
                // player.y = 200;
                player.body.y = 20;
            } else if (platform === secondPlatform) {
                // player.x = 400;
                // player.body.y = 0;
                player.body.y = 400;
              
            } else if (platform === thirdPlatform) {
                player.body.y = 200;    
            } else if (platform === fourthPlatform) {
                player.body.y = 400;
            }
        });

    }
    update(){
        // Call the player's update method to handle movement
        this.player.update();
        // Check for collision between player and projectiles
        this.projectiles.forEach((projectile) => {
            if (projectile.x < 0) {
                // Remove projectiles that go out of bounds
                projectile.destroy();
            }
        
            if (this.physics.overlap(projectile, this.player)) {
                // Handle collision with the player using the custom behavior
                this.sound.stopAll();
                projectile.onPlayerCollision();
                // Set gotHit to true
                this.gotHit = true;
                // gameController.LoseGame();
                this.scene.start('GameOver');
            }
        });

        

    }
    addPlatform(x, y, width, height){
        // Create a static rectangle for the platform
        const platform = this.add.rectangle(x, y, width, height, 0x0000ff);
        // SetAlpha is optional, and you can remove it if you don't want transparency
        platform.setAlpha(1);
        // Add the platform to the group
        this.platforms.add(platform);
        // Enable physics for the platform
        this.physics.world.enable(platform);
        // return the platform
        return platform;
    }
}

class GameOver extends ConfigureScene {
    constructor(){
        super('GameOver');
    }
    create(){
        const gameText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Looks like you have been hit game over maybe next time!', {fontSize: '30px', fontFamily: this.fontproperties.fontFamily,});
        gameText.setOrigin(0.5, 0.5);
    }
}

class Victory extends ConfigureScene {
    constructor(){
        super('Victory');
    }
    create(){
        const gameText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Congratz on dodging the boltz!', {fontSize: '30px', fontFamily: this.fontproperties.fontFamily,});
        gameText.setOrigin(0.5, 0.5);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // Customize gravity as needed
            debug: false, // Set to true for debugging collision
        }
    },
    parent: 'game-container',
    scene: [ConfigureScene,GameOver, Victory,GameScene],
};

const game = new Phaser.Game(config);
