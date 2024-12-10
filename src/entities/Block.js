import Entity from './Entity.js';
import Sprite from '../../lib/Sprite.js';
import { objectSpriteConfig } from '../../config/SpriteConfig.js';
import Tile from '../services/Tile.js';
import { sounds, timer } from '../globals.js';
import Easing from '../../lib/Easing.js';
import Graphic from '../../lib/Graphic.js';
import SoundName from '../enums/SoundName.js';
import Coin from './Coin.js';
import Map from '../services/Map.js';
import Mushroom from './Mushroom.js';
/**
 * Represents a block in the game world.
 * @extends Entity
 */
export default class Block extends Entity {
	/**
	 * @param {number} x - The x-coordinate of the block.
	 * @param {number} y - The y-coordinate of the block.
	 * @param {Graphic} spriteSheet - The sprite sheet for the block.
	 * @param {Map} map - Reference to the game map to access coins.
	 */
	constructor(x, y, spriteSheet, map) {
		super(x, y, Tile.SIZE, Tile.SIZE);

		this.spriteSheet = spriteSheet;
		this.sprites = objectSpriteConfig.block.map(
			(frame) =>
				new Sprite(
					spriteSheet,
					frame.x,
					frame.y,
					frame.width,
					frame.height
				)
		);
		this.currentSprite = this.sprites[0];
		this.isHit = false;
		this.map = map;
	}

	/**
	 * Renders the block.
	 */
	render() {
		this.currentSprite.render(this.position.x, this.position.y);
	}

	/**
	 * Handles the block being hit.
	 * @returns {Promise<boolean>} A promise that resolves to true if the block was hit, false otherwise.
	 */
	async hit() {
		if (!this.isHit) {
			this.isHit = true;
			sounds.play(SoundName.Bump);

			await timer.tweenAsync(
				this.position,
				{ y: this.position.y - 5 },
				0.1,
				Easing.easeInOutQuad
			);
			await timer.tweenAsync(
				this.position,
				{ y: this.position.y + 5 },
				0.1,
				Easing.easeInOutQuad
			);			
			this.currentSprite = this.sprites[1];						
			const mushroom = Math.random() < 0.4;
			if (mushroom) {
				this.spawnMushroom();
			} else {
				this.spawnCoin();
			}
			return true;
		}

		return false;
	}

	/**
 * Spawns a mushroom power-up above the block.
 */
	spawnMushroom() {
		const mushroom = new Mushroom(
			this.position.x,
			this.position.y - this.dimensions.y,
			Tile.SIZE,
			Tile.SIZE,
			this.spriteSheet,
			this.map
		);
		this.map.mushrooms.push(mushroom); // Add to map mushrooms array
	}

	async spawnCoin() {
		const coinX = this.position.x; // Coin's x-coordinate matches the block's x
		const coinY = this.position.y - Tile.SIZE; // Coin appears one tile above the block

		// Create a new Coin instance at the block's position
		const coin = new Coin(coinX, coinY, Tile.SIZE, Tile.SIZE, this.spriteSheet, true);
		this.map.coins.push(coin);

		// Move the coin upwards using tween and then remove it
		await timer.tweenAsync(
			coin.position,
			{ y: coin.position.y - 30 }, // Move the coin up 30 pixels
			0.5, // Duration of the animation in seconds
			Easing.easeOutQuad
		);
		await timer.tweenAsync(
			coin.position,
			{ y: coin.position.y + 20 }, // Move the coin up 30 pixels
			0.5, // Duration of the animation in seconds
			Easing.easeOutQuad
		);
		sounds.play(SoundName.Coin);

		// Remove the coin from the map after the tween is complete
		this.map.coins = this.map.coins.filter((mapCoin) => mapCoin !== coin);
	}
}
