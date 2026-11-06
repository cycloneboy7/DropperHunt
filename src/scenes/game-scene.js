import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { ASSET_KEYS } from '../common/assets.js';
import { CHARACTER } from '../common/character-date.js'

const textConfig = {
  fontFamily: 'Arial, sans-serif',
  fontSize: '28px',
  fontStyle: 'bold',
  color: '#ffffff',
};

const labelConfig = {
  fontFamily: 'Arial, sans-serif',
  fontSize: '13px',
  fontStyle: 'bold',
  color: '#b9a9e8',
};

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
  #misses;
  #maxMisses;
  #gameOver;
  #timeEvent;
  #collected;
  #livesText;
  #progressText;
  #progressBar;
  #restartButton;
  #character;
  #identityItems;

  #backgroundCharacter;


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

    this.#misses = 0;
    this.#maxMisses = 3;
    this.#gameOver = false;

    this.#collected = new Set();

    this.#identityItems = [
      ...CHARACTER.identities,
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

    this.#player = this.add.image(width / 2, height, ASSET_KEYS.JAR).setDepth(1);

    // @ts-ignore
    this.#cursorKeys = this.input.keyboard.createCursorKeys();

    const randomPose = Phaser.Math.Between(0, 19);

    this.#backgroundCharacter = this.add.sprite(
      this.scale.width/2,
      this.scale.height/2,
      'ALEX_POSES',
      randomPose
    )
    this.#backgroundCharacter.setScale(0.65)
    this.#backgroundCharacter.setAlpha(0.22)
    this.#backgroundCharacter.setDepth(0.1)


    this.#fallingObject = [];

    this.#fallingObjectFrames = Object.keys(this.textures.get(ASSET_KEYS.OBJECTS).frames).filter((name) => name !== '__BASE');

    this.#timeEvent = this.time.addEvent({
      delay: 1000,
      callback: this.#spawnFallObject,
      callbackScope: this,
      loop: true,
    });

    this.#createHud();
    this.#updateHud();


  }

  update(time, delta) {
    if (this.#gameOver) {
      return;
    }
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

      if (overLapPoints.length > 0) {
        const identity = obj.getData('identity');
        obj.destroy();
        this.#fallingObject.splice(i, 1);
        this.#score += 1;

        if (identity.correct) {
          this.#collected.add(identity.id);
        }

        this.#updateHud();
        continue;
      }

      if (obj.y > this.scale.height) {
        obj.destroy();
        this.#fallingObject.splice(i, 1);
        this.#misses += 1;
        this.#updateHud();
      }
    }

    if (this.#misses >= this.#maxMisses && !this.#gameOver) {
      this.#handleGameOver();
    }
  }

  #spawnFallObject() {
    const item = Phaser.Utils.Array.GetRandom(this.#identityItems);
    const x = Phaser.Math.Between(100, this.scale.width - 100)
    const showImage = Phaser.Math.Between(0,1) === 1;

    let obj;

    if (showImage) {
      obj = this.add.image(
        x,
        0,
        ASSET_KEYS.OBJECTS,
        item.frame
      ).setScale(0.5).setOrigin(0.5);
    } else {
      obj = this.add.text(
        x,
        0,
        item.label,
        {
          ...textConfig,
          fontSize: '22px',
          fontStyle: 'bold',
          color: '#ffffff',
          backgroundColor: '#352078',
          padding: { x: 10, y: 8 },
        }
      ).setOrigin(0.5);
    }
    obj.setData('identity', item);
    this.#fallingObject.push(obj);
  }

  #createHud() {
    const { width } = this.scale;
    const hudY = 22;
    const cardHeight = 76;
    const cardStyle = { fillColor: 0x211943, fillAlpha: 0.92 };
    const addCard = (x, cardWidth) => this.add.rectangle(x, hudY, cardWidth, cardHeight, cardStyle.fillColor, cardStyle.fillAlpha)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x654e9c, 0.8)
      .setDepth(2);

    addCard(24, 176);
    addCard(214, 410);
    addCard(638, 176);

    this.add.text(44, 34, 'SCORE', labelConfig).setDepth(3);
    this.#scoreTextGameObject = this.add.text(44, 52, '0', textConfig).setDepth(3);

    this.add.text(238, 32, 'IDENTITIES FOUND', labelConfig).setDepth(3);
    this.#progressText = this.add.text(590, 30, '', {
      ...labelConfig,
      fontSize: '16px',
      color: '#ffffff',
    }).setOrigin(1, 0).setDepth(3);
    this.add.rectangle(238, 66, 362, 8, 0x453766)
      .setOrigin(0, 0)
      .setDepth(3);
    this.#progressBar = this.add.rectangle(238, 66, 362, 8, 0xb58cff)
      .setOrigin(0, 0)
      .setDepth(4);

    this.add.text(660, 34, 'LIVES', labelConfig).setDepth(3);
    this.#livesText = this.add.text(660, 52, '', {
      ...textConfig,
      fontSize: '22px',
      color: '#ffc6d1',
    }).setDepth(3);

    this.#restartButton = this.add.text(width - 24, 34, 'RESTART', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#ffffff',
      backgroundColor: '#7047c8',
      padding: { x: 20, y: 16 },
    })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true })
      .setDepth(8);

    this.#restartButton.on('pointerover', () => this.#restartButton.setStyle({ backgroundColor: '#8a62df' }));
    this.#restartButton.on('pointerout', () => this.#restartButton.setStyle({ backgroundColor: '#7047c8' }));
    this.#restartButton.on('pointerdown', () => this.scene.restart());
  }

  #updateHud() {
    this.#scoreTextGameObject.setText(`${this.#score}`);
    this.#livesText.setText(`${this.#maxMisses - this.#misses} / ${this.#maxMisses}`);
    this.#progressText.setText(`${this.#collected.size} / ${CHARACTER.identities.length}`);
    this.#progressBar.setScale(this.#collected.size / CHARACTER.identities.length, 1);
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
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x0b0815, 0.72).setDepth(5);
    this.add.rectangle(width / 2, height / 2, 500, 220, 0x211943, 0.98)
      .setStrokeStyle(2, 0x8c6bd0)
      .setDepth(6);
    this.add.text(width / 2, height / 2 - 48, 'GAME OVER', {
      ...textConfig,
      fontSize: '32px',
    }).setOrigin(0.5).setDepth(7);
    this.add.text(width / 2, height / 2 + 4, `Score: ${this.#score}    Identities: ${this.#collected.size} / ${CHARACTER.identities.length}`, {
      ...labelConfig,
      fontSize: '18px',
      color: '#e6ddfa',
    }).setOrigin(0.5).setDepth(7);
    this.add.text(width / 2, height / 2 + 48, 'Press RESTART to play again', {
      ...labelConfig,
      fontSize: '15px',
    }).setOrigin(0.5).setDepth(7);
  }
}
