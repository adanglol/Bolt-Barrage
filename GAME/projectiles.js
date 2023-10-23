// Where we will define projectiles for players to dodge

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        // Add the player to the scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;

        // set projectile size and physics properties
        this.setVelocityX(-200);
        this.setCollideWorldBounds(false);
         // Set the size of the hitbox for the projectile (adjust these values as needed)
         this.setSize(20, 20);

         const hitboxWidthRatio = 0.03; // Adjust this value
         const hitboxHeightRatio = 0.02; // Adjust this value
 
         // Calculate the hitbox size based on the sprite's size
         const hitboxWidth = this.displayWidth * hitboxWidthRatio;
         const hitboxHeight = this.displayHeight * hitboxHeightRatio;
 
         // Calculate the offset to align the hitbox with the sprite
         const xOffset = (this.displayWidth - hitboxWidth) *.12;
         const yOffset = (this.displayHeight - hitboxHeight) * .71;
 
         // Set the hitbox size and offset
         this.body.setSize(hitboxWidth, hitboxHeight);
         this.body.setOffset(xOffset, yOffset);
          
    }
    onPlayerCollision(){
        this.destroy();
        console.log("Player hit!");
    }
}

