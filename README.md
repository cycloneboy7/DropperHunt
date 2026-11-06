# Dropper Hunt (In Development )

**Read ME file is not yet full Upto date with Developement**.
**Dropper Hunt** is a 2D identity-hunting arcade game built with **JavaScript and Phaser 3**.

The player controls a collector at the bottom of the screen and catches falling objects to identify a target character named Alex. Players must distinguish correct identity clues from distractors while managing their score and remaining lives.

---

## 🎮 Game Concept

A character has a specific identity consisting of different visual attributes:

- Hair
- Glasses
- Hoodie
- Cap
- Jacket

The player must collect the correct identity clues while avoiding incorrect ones.

The game combines falling text and image-based objects to make identification more challenging.

## ✨ Features Implemented

### 1. Player Movement

- Player-controlled collector using keyboard arrow keys.
- Horizontal movement across the game screen.
- Screen-boundary restrictions.

### 2. Falling Objects

Two types of objects can fall from the top of the screen:

- **Text objects:** Names of identity attributes, such as Black Hair and Blue Hoodie.
- **Image objects:** Actual visual assets representing caps, jackets, hairstyles, glasses, and hoodies.

The game randomly chooses whether to spawn an image or text object.

### 3. Identity System

The target character is named **Alex**.

The identity data is maintained separately in `character-data.js`.

Current correct identity:

| Attribute | Correct identity |
| --------- | ---------------- |
| Hair      | Black Hair       |
| Glasses   | Black Glasses    |
| Hoodie    | Blue Hoodie      |

Distractors include alternative colours and styles of caps, jackets, hair, glasses, and hoodies.

### 4. Lives and Progress Tracking

- Tracks remaining lives.
- Tracks collected identity clues.
- Updates the HUD using the existing `textConfig`.
- Ends the game when the maximum number of misses is reached.

### 5. Game States

- Active gameplay
- Game over
- Identity verification / win condition

---

## Technology Stack

| Technology   | Purpose                           |
| ------------ | --------------------------------- |
| JavaScript   | Game logic                        |
| Phaser 3     | 2D game engine                    |
| HTML5        | Game structure                    |
| CSS3         | Styling                           |
| JSON         | Texture atlas and sprite metadata |
| Git & GitHub | Version control                   |

---

## Project Structure

```text
DropperHunt/
│
├── assets/
│   ├── images/
│   │   ├── background.png
│   │   ├── jar.png
│   │   ├── spritesheet.png
│   │   └── spritesheet.json
│   │
│   └── style.css
│
├── src/
│   ├── common/
│   │   ├── assets.js
│   │   ├── scene-keys.js
│   │   └── character-data.js
│   │
│   ├── scenes/
│   │   ├── preload-scene.js
│   │   └── game-scene.js
│   │
│   └── main.js
│
├── index.html
└── README.md
```

_The project structure may include additional files as development continues._

---

## Identity Asset System

The identity collectibles are stored in a texture atlas.

Current categories:

| Category   | Variations |
| ---------- | ---------: |
| Caps       |          6 |
| Jackets    |          6 |
| Hairstyles |          6 |
| Glasses    |          6 |
| Hoodies    |          6 |
| **Total**  |     **30** |

The atlas JSON defines individual frame names and their coordinates.

Example frame names:

```text
cap_black.png
cap_red.png
hair_black.png
hair_blonde.png
glasses_black.png
glasses_round.png
hoodie_blue.png
hoodie_purple.png
jacket_denim.png
jacket_yellow.png
```

The game uses these frames to display individual collectible images without requiring a separate image file for every variation.

---

## 🕹️ How to Play

1. Start the game.
2. Move the collector using the arrow keys.
3. Catch falling identity clues.
4. Collect Alex's correct identity attributes.
5. Avoid distractors.
6. Don't let too many objects fall past the collector.
7. Collect all required identities to win.

---

## 🚧 Development Roadmap

### Completed

- [x] Phaser game setup
- [x] Preload and game scenes
- [x] Player movement
- [x] Falling text objects
- [x] Identity data structure
- [x] Correct and distractor identities
- [x] Texture atlas for identity items
- [x] Falling image objects
- [x] Mixed random text/image spawning
- [x] Collision detection
- [x] Score and lives tracking
- [x] Identity collection progress
- [x] Integrate Alex's 20-pose character spritesheet
- [x] Display Alex as a background identity reference
- [x] Randomize character appearance between rounds

### In Progress

### Planned

- [ ] Dynamic identity verification

---

## 🎯 Project Goal

The goal of Dropper Hunt is to create a simple but engaging identity-recognition arcade game.

The project explores:

- 2D game development with Phaser
- Sprite sheets and texture atlases
- Object spawning and collision detection
- Data-driven game mechanics
- Randomized gameplay
- Score and state management

---

## 👨‍💻 Development

Built with JavaScript and Phaser 3.

**Project:** Dropper Hunt  
**Repository:** https://github.com/cycloneboy7/DropperHunt

---

_Dropper Hunt — Catch the clues. Identify the character._
