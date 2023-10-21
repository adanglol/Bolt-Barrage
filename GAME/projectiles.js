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
    }
    onPlayerCollision(){
        this.destroy();
        console.log("Player hit!");
    }
}

