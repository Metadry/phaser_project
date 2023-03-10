import BulletStash from './BulletStash'
import Hud from '../hud/Hud'

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
        this.health = 160;
        this.maxHealth = 160;
        this.ammo = 5;
        this.maxAmmo = 5;
        this.speed = 200;
        this.minSpeed = 200;
        this.maxSpeed = 400;
        this.jumpSpeed = 265;
        this.bulletStash = new BulletStash(this.scene, 15, -200, 300);
        this.hud = new Hud(scene);
        this.shotDelay = 500;
        this.nextShot = 0;

        // Flags
        this.jumping = false;
        this.onAir = false;
        this.receivingHit = false;
        this.shootBoostEnabled = false;
        this.midAirJumpEnabled = false;

        // Direction
        this.direction = -1;

        // Colliders
        this.setSize(28, 50);
        this.setOffset(22.5, 16);

        this.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNames('spritesPlayer',
                { start: 1, end: 4, prefix: 'idle-' }),
            frameRate: 6,
            repeat: -1
        });

        // Animations
        this.depth = 10;

        this.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNames('spritesPlayer',
                { start: 1, end: 8, prefix: 'run-' }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'runSprint',
            frames: this.scene.anims.generateFrameNames('spritesPlayer',
                { start: 1, end: 8, prefix: 'run-' }),
            frameRate: 18,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.scene.anims.generateFrameNames('spritesPlayer',
                { start: 1, end: 4, prefix: 'jump-' }),
            frameRate: 8
        });

        this.anims.create({
            key: 'fall',
            frames: this.scene.anims.generateFrameNames('spritesPlayer',
                { start: 4, end: 4, prefix: 'jump-' }),
            frameRate: 20
        });

        this.anims.create({
            key: 'shoot',
            frames: this.scene.anims.generateFrameNames('spritesPlayer',
                { start: 1, end: 1, prefix: 'shoot-' }),
            duration: 1000
        });

        this.anims.create({
            key: 'runShoot',
            frames: this.scene.anims.generateFrameNames('spritesPlayer',
                { start: 1, end: 8, prefix: 'run-shoot-' }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'runShootSprint',
            frames: this.scene.anims.generateFrameNames('spritesPlayer',
                { start: 1, end: 8, prefix: 'run-shoot-' }),
            frameRate: 18,
            repeat: -1
        });

        this.anims.create({
            key: 'hurt',
            frames: this.scene.anims.generateFrameNames('spritesPlayer',
                { start: 1, end: 1, prefix: 'hurt-' }),
            duration: 500
        });

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "hurt", function () {
            this.receivingHit = false;
        }, this);
    }

    update() {
        if (this.isAlive()) {
            if (!this.receivingHit) {
                this.move();
                this.jump();
                this.shoot();
            }
        }
        else {
            this.scene.resetLevel();
        }
    }

    speedControl() {
        if (this.body.onFloor()) {
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
        this.speedControl();

        if (this.onAir && this.body.onFloor()) {
            this.scene.sound.play('ground', {volume: 0.2});
        }

        this.onAir = !this.body.onFloor();

        if (this.cursors.left.isDown) {
            this.setFlipX(true);
            this.direction = 1;
            this.setVelocityX(-this.speed);
        }
        else if (this.cursors.right.isDown) {
            this.setFlipX(false);
            this.direction = -1;
            this.setVelocityX(this.speed);
        }
        else {
            this.setVelocityX(0);
        }

        this.moveAnims();
    }

    moveAnims() {
        if (!this.body.onFloor()) {
            if (!this.jumping) {
                this.anims.play('fall', true);
            }
        }
        else {
            this.midAirJumpEnabled = false;
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
        if (Phaser.Input.Keyboard.JustDown(this.jumpBtn) && (this.body.onFloor() || this.midAirJumpEnabled)) {
            this.scene.sound.play('jump', {volume: 0.2});
            this.setVelocityY(-this.jumpSpeed);
            this.anims.play('jump', true);
            this.midAirJumpEnabled = false;
            this.jumping = true;
        }
    }

    shoot() {
        if (this.nextShot > this.scene.time.now) {
            return;
        }
        else if (this.shootBtn.isDown) {
            if (!this.body.onFloor()) {
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

            let delay;
            if (!this.shootBoostEnabled) {
                delay = this.shotDelay;
            }
            else {
                delay = this.shotDelay / 2;
            }

            this.nextShot = this.scene.time.now + delay;

            if (this.ammo > 0 || this.shootBoostEnabled) {
                if (!this.shootBoostEnabled) {
                    this.ammo -= 1;
                    this.hud.updateAmmoBar(this.ammo);
                }

                this.scene.sound.play('shoot', {volume: 0.2});
                this.bulletStash.fire(this.x, this.y, this.flipX);
            }
            else {
                this.scene.sound.play('noAmmo', {volume: 0.2});
            }
        }
    }

    receiveHit(damage) {
        if (!this.receivingHit && this.health > 0) {
            this.setVelocity(this.speed * 0.7 * this.direction, this.body.velocity.y * -0.7);
            this.receivingHit = true;
            this.shootBoostEnabled = false;
            this.hud.notInfinite();
            this.health -= damage;
            
            if (this.health <= 0) {
                this.setVelocity(0);
            } else{
                this.hud.updateHealthBar(this.health);
            }

            this.scene.sound.play('hurt', {volume: 0.2});
            this.anims.play('hurt', true);
        }
    }

    refillAmmo() {
        this.ammo = this.maxAmmo;
        this.hud.setMaxAmmo();
    }

    reset(position) {
        this.setVelocity(0);
        this.setX(position.x);
        this.setY(position.y);

        this.health = this.maxHealth;
        this.refillAmmo();
        this.hud.updateHealthBar(160);
        this.hud.setMaxAmmo();
        this.hud.notInfinite();

        this.shootBoostEnabled = false;
        this.midAirJumpEnabled = false;
    }

    isAlive() {
        return this.health > 0;
    }

}