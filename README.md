# Mario 🍄

# Source Code Taken From (https://github.com/JAC-CS-Game-Programming-F24/3-mario.git/)

# Only Additional Features Implemented By Me which are as follows:


# 🍄 Mario Game - Extended Edition 🪙

Welcome to the **Mario Game - Extended Edition**, a reimagined version of the classic Mario game with exciting new features! This project enhances the original source code by adding **coin collection**, **platform mechanics**, and **mushroom power-ups** to deliver a more engaging gameplay experience.

---

## 📋 Table of Contents
1. [📖 Project Overview](#-project-overview)
2. [✨ Features](#-features)
3. [🛠️ Technologies Used](#-technologies-used)
4. [🎯 Project Context](#-project-context)
5. [🎮 Gameplay Mechanics](#-gameplay-mechanics)

---

## 📖 Project Overview

This **Mario Game - Extended Edition** builds upon an existing Mario game source code with the addition of the following features:

- 🪙 **Coin Collection**: Players can now collect coins from blocks and the map.
- ⬆️ **Platform Mechanics**: Jump through platforms from below and land on them from above.
- 🍄 **Mushroom Power-ups**: Collect mushrooms to grow bigger and stronger, with animations and sound effects.

These features add depth to the gameplay and provide new challenges for players to enjoy.

---

## ✨ Features

### 🪙 Coin Collection
- **Collectible Coins**: Coins appear on the map and spawn when blocks are hit.
- **Audio Feedback**: Plays `coin.wav` when collecting coins and `bump.wav` when hitting a block.
- **Dynamic Behavior**: Coins disappear upon collection, rewarding the player.

### ⬆️ Platforms
- **Platform Tiles**: Players can jump through platforms and land on them.
- **Seamless Movement**: Allows horizontal movement while standing on platforms.
- **Collision Handling**: Platforms allow upward jumping but remain solid when landed on.

### 🍄 Mushroom Power-ups
- **Mushroom Mechanics**:
  - Mushrooms spawn from blocks when hit.
  - Mushrooms move with physics, fall off blocks, and bounce off walls.
- **Audio and Animations**:
  - Plays `sprout-item.wav` when mushrooms appear.
  - Plays `powerup.wav` when collected and `pipe.wav` when the player shrinks.
  - Includes **growing** and **shrinking animations** for the player.
- **Flicker Effect**: Mushrooms flicker and disappear after a set lifetime.

---

## 🛠️ Technologies Used

- **HTML5 Canvas**: For rendering the game visuals.
- **JavaScript**: Core game logic and mechanics.
- **Sound Effects**: `.wav` files for immersive audio feedback.
- **SpriteConfig.js**: Handles animations and sprites.

---

## 🎯 Project Context

This project was developed to:
- Enhance an existing Mario game codebase with additional gameplay mechanics.
- Explore **game development techniques** such as collision detection, animations, and dynamic entity spawning.
- Provide an engaging and polished user experience.

It serves as a **practice exercise** for implementing advanced game features and refining coding skills in game development.

---

## 🎮 Gameplay Mechanics

### Coin Collection
1. Coins are scattered throughout the map.
2. Hit blocks to spawn coins dynamically.
3. Collect coins to increase your score and hear satisfying sound effects.

### Platforms
1. Jump through platforms from below and land on them.
2. Stand and move horizontally across platforms.
3. The platform logic integrates seamlessly with block and ground collisions.

### Mushroom Power-ups
1. Mushrooms spawn when blocks are hit.
2. Mushrooms fall and move until they hit a wall or ground.
3. Collect mushrooms to grow in size and strength.
4. Shrink upon taking damage from enemies, with animations and sound effects.

---

🎉 **Thank you for exploring the Mario Game - Extended Edition!**  
