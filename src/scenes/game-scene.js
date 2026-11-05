import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { ASSET_KEYS } from '../common/assets.js';
import { CHARACTER } from '../common/character-date.js'

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
  #lives;
  #collected;
  #livesText;
  #progressText;
  #statusText;
  #character;
  #identityItems;
  


  constructor() {
    super({
      key: SCENE_KEYS.GAME_SCENE,
    });
  }

  init() {
    this.#playerSpeed = 500;
    this.#fallingObjectSpeed = 200;

    this.#fallingObject = [];

    this.#score = 0;
    this.#lives = 3;

    this.#misses = 0;
    this.#maxMisses = 3;
    this.#gameOver = false;

    this.#collected = new Set();

    this.#identityItems = [
      ...CHARACTER.identites,
      ...CHARACTER.distractors
    ]
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

    this.#createAbstractBackground();
    this.#createCharacter();

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

    this.#livesText = this.add.text(
      this.scale.width - 150,
      15,
      'Lives: 3',
      {
        fontSize: '22px',
        color: '#ff7777'
      }
    );
    const progressText = this.add.text(10,55,'Identities: ',textConfig);
    //this.#progressText = this.add.text(10,55,'Identities: ',textConfig);
    this.#progressText = this.add.text(progressText.x + progressText.width, progressText.y, `${this.#collected.size}/${this.#identityItems.length}`, textConfig).setOrigin(0,0);
    this.#livesText.setText(`Lives: ${this.#maxMisses - this.#misses}`);
    

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
    const item = Phaser.Utils.Array.GetRandom(this.#identityItems);
    const x = Phaser.Math.Between(100, this.scale.width - 100)
    const obj = this.add.text(
      x,
      0,
      item.label,
      {
        fontFamily: 'Arial',
        fontSize: '23px',
        fontStyle: 'bold',
        color: '#ffffff',
        backgroundColor: '#352078',
        padding: {
          x: 12,
          y: 8,
        },
      }
    );
    obj.setOrigin(0.5)

    obj.setData('identity',item);
    this.#fallingObject.push(obj);
  }

  #createAbstractBackground() {
    const {width,height} = this.scale;
    const graphics = this.add.graphics();

    graphics.fillGradientStyle(
      0x171044,
      0x171044,
      0x352078,
      0x352078,
      1
    )

    graphics.fillRect(0, 0, width, height);

    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(0,width)
      const y = Phaser.Math.Between(0,height)
      const radius = Phaser.Math.Between(10,50)

      graphics.fillStyle(0x9361ff, 0.12)
      graphics.fillCircle(x,y,radius)
    }

    graphics.lineStyle(4, 0xb45cff, 0.9);

    graphics.lineBetween(
      0,
      height - 25,
      width,
      height - 25
    )

    graphics.setDepth(-10);
  }

  #handleGameOver() {
    this.#gameOver = true;
    this.#timeEvent.remove();
    this.add.text(this.scale.width /2, this.scale.height /2, 'Game Over', textConfig).setOrigin(0.5);
    this.input.once(Phaser.Input.Events.POINTER_DOWN, () => {this.scene.restart()});
  }


  #createCharacter() {
    const { width, height } = this.scale;
    this.#character = this.add.text(
      width / 2,
      height / 2 - 80,
      '🧑🏻‍🦱',
      {
        fontSize: '220px',
      }
    );

    this.#character.setOrigin(0.5);

    // Ghost appearance
    this.#character.setAlpha(0.18);
    this.#character.setDepth(0);

    // Floating animation
    this.tweens.add({
      targets: this.#character,
      y: this.#character.y - 15,
      duration: 2500,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  }
}
