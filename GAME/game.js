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
    }

    create(){
        var gameController = MicrogameJamController(1, 3, true);
        gameController.SetMaxTimer(15, () => {
            // This is the callback function that is called when the timer runs out
            // IF THEY GET HIT GAME OVER IF NOT VICTORY
            this.scene.start('Victory');
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
                // Add the projectile to the projectiles array
                this.projectiles.push(projectile);
                
            }
        });



        // to check for second third platform
      

        // Create the player
        this.player = new Player(this, 80, 450,'player');
        this.add.text(300, 0, 'Bolt Barrage', this.fontproperties);

        this.platforms = this.physics.add.staticGroup();

        const bottomPlatform = this.addPlatform(100, 530, 200, 20);
        const secondPlatform = this.addPlatform(100, 350, 200, 20);
        const thirdPlatform = this.addPlatform(100, 180, 200, 20);
        const fourthPlatform = this.addPlatform(100, 10, 200, 20);

        const enemyPlatform = this.addPlatform(850, 270, 200, 500);
        // Set up collision between player and platforms
        this.physics.add.collider(this.player, this.platforms, (player, platform) => {
            // Collision with bottom platform
            if (platform === bottomPlatform) {
                // move player to top of platform
                player.y = 100;
            } else if (platform === secondPlatform) {
                player.y = 250;
              
            } else if (platform === thirdPlatform) {
                player.y = 100;
            } else if (platform === fourthPlatform) {
                player.y = 450;
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
                projectile.onPlayerCollision();
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
        this.add.text(300, 0, 'You have won the game', this.fontproperties);
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
            debug: true, // Set to true for debugging collision
        }
    },
    parent: 'game-container',
    scene: [ConfigureScene,GameOver, Victory,GameScene],
};

const game = new Phaser.Game(config);
