

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        // Add the player to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set player size and physics properties
        this.setSize(100, 50); // Set the size of the player hitbox
        this.setCollideWorldBounds(true); // Enable world bounds collision
        this.setOrigin(0, -0.17);

        // Define the ratio for hitbox width and height (adjust as needed)
        const hitboxWidthRatio = 0.04; // Adjust this value
        const hitboxHeightRatio = 0.15; // Adjust this value

        // Calculate the hitbox size based on the sprite's size
        const hitboxWidth = this.displayWidth * hitboxWidthRatio;
        const hitboxHeight = this.displayHeight * hitboxHeightRatio;

        // Calculate the offset to align the hitbox with the sprite
        const xOffset = (this.displayWidth - hitboxWidth) *.07;
        const yOffset = (this.displayHeight - hitboxHeight) * .7;

        // Set the hitbox size and offset
        this.body.setSize(hitboxWidth, hitboxHeight);
        this.body.setOffset(xOffset, yOffset);

        // Add the player to the scene
        this.keys = scene.input.keyboard.createCursorKeys();
    }

    update() {
        // Player movement logic
        // Example: Move up when the 'UP' key is pressed
        if (this.keys.up.isDown) {
            this.setVelocityY(-200);
        } else if (this.keys.down.isDown) {
            this.setVelocityY(200);
        } else {
            this.setVelocityY(0);
        }
    }
}
