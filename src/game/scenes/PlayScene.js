import {Scene} from 'phaser'
import store from "@/store";

import sky from '@/game/assets/sky.png'
import ground from '@/game/assets/platform.png'
import star from '@/game/assets/star.png'
import dude from '@/game/assets/dude.png'

export default class PlayScene extends Scene {
    #player;
    #stars;
    #ground;
    #cursors;
    #platform;

    constructor() {
        super({key: 'PlayScene'})
    }

    preload() {
        this.load.image('sky', sky);
        this.load.image('ground', ground);
        this.load.image('star', star);
        this.load.spritesheet('dude', dude, {frameWidth: 32, frameHeight: 48});
    }

    create() {

        this.add.image(400, 300, 'sky');

        this.#ground = this.physics.add.staticImage(400, 568, 'ground').setScale(2).refreshBody();

        this.#platform = this.physics.add.image(400, 400, 'ground');

        this.#platform.setImmovable(true);
        this.#platform.body.allowGravity = false;

        this.#player = this.physics.add.sprite(100, 450, 'dude');

        this.#player.setBounce(0.2);
        this.#player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{key: 'dude', frame: 4}],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });

        this.#cursors = this.input.keyboard.createCursorKeys();

        this.#stars = this.physics.add.group({
            key: 'star',
            frameQuantity: 12,
            maxSize: 12,
            active: false,
            visible: false,
            enable: false,
            collideWorldBounds: true,
            bounceX: 0.5,
            bounceY: 0.5,
            dragX: 30,
            dragY: 0
        });

        this.physics.add.collider(
            this.#player,
            this.#platform,
            function (_player, _platform) {
                if (_player.body.touching.up && _platform.body.touching.down) {
                    this.createStar(
                        _player.body.center.x,
                        _platform.body.top - 16,
                        _player.body.velocity.x,
                        _player.body.velocity.y * -3
                    );
                }
            }.bind(this));

        this.physics.add.collider(this.#player, this.#ground);
        this.physics.add.collider(this.#stars, this.#ground);
        this.physics.add.collider(this.#stars, this.#platform);

        this.physics.add.overlap(this.#player, this.#stars, this.collectStar, null, this);
    }


    update() {
        if (this.#cursors.left.isDown) {
            this.#player.setVelocityX(-180);

            this.#player.anims.play('left', true);
        } else if (this.#cursors.right.isDown) {
            this.#player.setVelocityX(180);

            this.#player.anims.play('right', true);
        } else {
            this.#player.setVelocityX(0);

            this.#player.anims.play('turn');
        }

        if (this.#cursors.up.isDown && this.#player.body.touching.down) {
            this.#player.setVelocityY(-360);
        }
    }


    collectStar(player, star) {
        star.disableBody(true, true);
        store.commit('increment');
    }

    createStar(x, y, vx, vy) {
        const star = this.#stars.get();

        if (!star) return;

        star
            .enableBody(true, x, y, true, true)
            .setVelocity(vx, vy);
    }
}
