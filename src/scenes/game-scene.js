import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { ASSET_KEYS } from '../common/assets.js';

export class GameScene extends Phaser.Scene {
  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  // @ts-ignore
  #cursorKeys;
  /** @type {Phaser.GameObjects.Image} */
  // @ts-ignore
  #player;
  // @ts-ignore
  #playerSpeed;

  constructor() {
    super({
      key: SCENE_KEYS.GAME_SCENE,
    });
  }

  init() {
    this.#playerSpeed = 500;
  }

  /**
   * @public
   * Tied to the Phaser Scene lifecycle. Will run one time after the PRELOAD
   * logic is finished. Runs each time the Phaser Scene restarts.
   * @returns {void}
   */
  create() {
    const { width, height } = this.scale;
    // add game background
    this.add.image(this.scale.width / 2, this.scale.height / 2, ASSET_KEYS.BACKGROUND);

    this.#player = this.add.image(width / 2, height, ASSET_KEYS.JAR);

    this.add.image(width/2, height/2, ASSET_KEYS.OBJECTS);
    this.add.image(width/2, height/3, ASSET_KEYS.OBJECTS, "button2.png").setScale(2);

    // @ts-ignore
    this.#cursorKeys = this.input.keyboard.createCursorKeys();
  }

  update(time, delta) {
    console.log(time, delta);
    const movStep = (delta / 1000) * this.#playerSpeed;
    if (this.#cursorKeys.left.isDown) {
      this.#player.x -= movStep;
    } else if (this.#cursorKeys.right.isDown) {
      this.#player.x += movStep;
    }

    if(this.#player.x - this.#player.width/2 < 0) {
      this.#player.x = this.#player.width/2;
    } else if (this.#player.x + this.#player.width/2 > this.scale.width) {
      this.#player.x = this.scale.width - this.#player.width/2;
    }
  }
}
