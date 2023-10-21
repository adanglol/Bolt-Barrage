
export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        // Add the player to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set player size and physics properties
        // this.setSize(50, 50); // Set the size of the player
        this.setCollideWorldBounds(true); // Enable world bounds collision

        // Add the player to the scene
        scene.add.existing(this);
        this.keys = scene.input.keyboard.createCursorKeys();

    }

    update() {
        // Player movement logic
        // Example: Move up when the 'UP' key is pressed
        if (this.keys.up.isDown) {
            this.setVelocityY(-200);
        } else if (this.keys.down.isDown) {;
            this.setVelocityY(200);
        } else if (this.keys.up.isUp) {
            this.setVelocityY(0);
        } else if (this.keys.down.isUp) {
            this.setVelocityY(0);
        }

    }
}
