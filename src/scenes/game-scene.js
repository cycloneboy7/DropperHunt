import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { ASSET_KEYS } from '../common/assets.js';

const textConfig = {
      fontSize: '32px',
      color: '#000',
    }
export class GameScene extends Phaser.Scene {
  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  // @ts-ignore
  #cursorKeys;
  /** @type {Phaser.GameObjects.Image} */
  // @ts-ignore
  #player;
  // @ts-ignore
  #playerSpeed;
  #fallingObjectFrames;
  #fallingObject;
  #fallingObjectSpeed;
  #score;
  #scoreTextGameObject;
  #misses
  #maxMisses
  #gameOver
  #timeEvent

  constructor() {
    super({
      key: SCENE_KEYS.GAME_SCENE,
    });
  }

  init() {
    this.#playerSpeed = 500;
    this.#fallingObjectSpeed = 200;
    this.#score = 1;
    this.#misses = 0;
    this.#maxMisses = 3;
    this.#gameOver = false;
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

    this.#player = this.add.image(width / 2, height, ASSET_KEYS.JAR).setDepth(1);

    
    // this.add.image(width/2, height/3, ASSET_KEYS.OBJECTS, "button2.png").setScale(2);
    // @ts-ignore
    this.#cursorKeys = this.input.keyboard.createCursorKeys();
    
    this.#fallingObject = [];

    this.#fallingObjectFrames = Object.keys(this.textures.get(ASSET_KEYS.OBJECTS).frames).filter((name) => name != '__BASE');
    
    this.#timeEvent = this.time.addEvent({
      delay: 1000,
      callback: this.#spawnFallObject,
      callbackScope: this,
      loop: true,
    });
    const scoreTextPrefix = this.add.text(10, 10, 'Score: ', textConfig); 

    this.#scoreTextGameObject = this.add.text(scoreTextPrefix.x + scoreTextPrefix.width, scoreTextPrefix.y, `${this.#score}`, textConfig).setOrigin(0, 0);
  }

  update(time, delta) {
    if (this.#gameOver) {
      return;
    }
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

    for(let i = this.#fallingObject.length - 1; i >= 0; i--) {
      const obj = this.#fallingObject[i];
      obj.y += (delta / 1000) * this.#fallingObjectSpeed;
      
      const overLapPoints = Phaser.Geom.Intersects.GetRectangleToRectangle(
        this.#player.getBounds(),
        obj.getBounds()
      );

      if(overLapPoints.length > 0) {
        obj.destroy();
        this.#fallingObject.splice(i, 1);
        this.#score += 1;
        this.#scoreTextGameObject.setText(`${this.#score}`);
      }

      if (obj.y > this.scale.height) {
        obj.destroy();
        this.#fallingObject.splice(i, 1);
        this.#misses += 1;
        this.#scoreTextGameObject.setText(`${this.#score}`);
      }
    }

    if (this.#misses >= this.#maxMisses && !this.#gameOver) {
      this.#handleGameOver();
    }
  }

  #spawnFallObject() {
    const randomFrame = Phaser.Utils.Array.GetRandom(this.#fallingObjectFrames);
    const obj = this.add.image(
      Phaser.Math.RND.between(0, this.scale.width - 50),
      0,
      ASSET_KEYS.OBJECTS,
      randomFrame
    );
    this.#fallingObject.push(obj);
  }

  #handleGameOver() {
    this.#gameOver = true;
    this.#timeEvent.remove();
    this.add.text(this.scale.width /2, this.scale.height /2, 'Game Over', textConfig).setOrigin(0.5);
    this.input.once(Phaser.Input.Events.POINTER_DOWN,() => {
      this.scene.restart
    })
  }
}
