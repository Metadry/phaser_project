import BulletStash from './BulletStash'

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, spriteName) {
        super(scene, x, y, spriteName);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.jumpBtn = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.sprintBtn = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.shootBtn = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        // Stats
        this.health = 10;
        this.speed = 200;
        this.minSpeed = 200;
        this.maxSpeed = 400;
        this.jumpSpeed = 200;
        this.bulletStash = new BulletStash(this.scene, 5, -200, 300);
        this.shotDelay = 500;
        this.nextShot = 0;

        // Flags
        this.jumping = false;
        this.receivingHit = false;

        // Animations and colliders
        this.spriteName = spriteName;
        this.setSize(28, 50);
        this.setOffset(22.5, 16);
    }

    create() {
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers(this.spriteName, { start: 16, end: 19 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers(this.spriteName, { start: 0, end: 7 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'runSprint',
            frames: this.anims.generateFrameNumbers(this.spriteName, { start: 0, end: 7 }),
            frameRate: 18,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers(this.spriteName, { start: 20, end: 23 }),
            frameRate: 8
        });

        this.anims.create({
            key: 'fall',
            frames: [{ key: this.spriteName, frame: 23 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'shoot',
            frames: [{ key: this.spriteName, frame: 39 }],
            duration: 1000
        });

        this.anims.create({
            key: 'runShoot',
            frames: this.anims.generateFrameNumbers(this.spriteName, { start: 8, end: 15 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'runShootSprint',
            frames: this.anims.generateFrameNumbers(this.spriteName, { start: 8, end: 15 }),
            frameRate: 18,
            repeat: -1
        });

        this.anims.create({
            key: 'hurt',
            frames: [{ key: this.spriteName, frame: 31 }],
            duration: 500
        });

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "hurt", function () {
            this.receivingHit = false;
        }, this);
    }

    update() {
        if (!this.receivingHit && this.isAlive()) {
            this.speedControl();
            this.move();
            this.moveAnims();
            this.jump();
            this.shoot();
        }
    }

    speedControl() {
        if (this.body.touching.down) {
            if (this.sprintBtn.isDown) {
                this.speed = this.maxSpeed;
            }
            else {
                this.speed = this.minSpeed;
            }
        }
        else {
            if ((this.cursors.left.isDown && this.body.velocity.x == this.maxSpeed)
                || (this.cursors.right.isDown && this.body.velocity.x == -this.maxSpeed)) {
                this.speed = this.minSpeed;
            }
        }
    }

    move() {
        if (this.cursors.left.isDown) {
            this.setFlipX(true);
            this.setVelocityX(-this.speed);
        }
        else if (this.cursors.right.isDown) {
            this.setFlipX(false);
            this.setVelocityX(this.speed);
        }
        else {
            this.setVelocityX(0);
        }
    }

    moveAnims() {
        if (!this.body.touching.down) {
            if (!this.jumping) {
                this.anims.play('fall', true);
            }
        }
        else {
            this.jumping = false;
            if (this.shootBtn.isUp) {
                if (this.cursors.left.isDown || this.cursors.right.isDown) {
                    if (Math.abs(this.body.velocity.x) == this.maxSpeed) {
                        this.anims.play('runSprint', true);
                    }
                    else {
                        this.anims.play('run', true);
                    }
                }
                else {
                    this.anims.play('idle', true);
                }
            }
        }
    }

    jump() {
        if (this.body.touching.down && Phaser.Input.Keyboard.JustDown(this.jumpBtn)) {
            // Jump sound
            this.setVelocityY(-this.jumpSpeed);
            this.anims.play('jump', true);
            this.jumping = true;
        }
    }

    shoot() {
        if (this.nextShot > this.scene.time.now) {
            return;
        }
        else if (this.shootBtn.isDown) {
            if (!this.body.touching.down) {
                this.anims.play('fall', true);
            }
            else {
                if (!this.jumping && (this.cursors.left.isDown || this.cursors.right.isDown)) {
                    if (Math.abs(this.body.velocity.x) == this.maxSpeed) {
                        this.anims.play('runShootSprint', true);
                    }
                    else {
                        this.anims.play('runShoot', true);
                    }
                }
                else {
                    this.anims.play('shoot', true);
                }
            }

            if (this.bulletStash.getAmmo() > 0) {
                // Shot sound
                this.nextShot = this.scene.time.now + this.shotDelay;
                this.bulletStash.fire(this.x, this.y, this.flipX);
            }
            else {
                // No ammo sound
            }
        }
    }

    receiveHit(damage) {
        if (!this.receivingHit && this.health > 0) {
            this.setVelocity(-this.body.velocity.x / 2, -this.body.velocity.y / 2);
            this.receivingHit = true;

            this.health -= damage;
            // Hurt sound
            this.anims.play('hurt', true);
        }
    }

    isAlive() {
        return this.health > 0;
    }

}