import Entity from './Entity.js';
import Animation from '../../lib/Animation.js';
import { coinSpriteConfig } from '../../config/SpriteConfig.js';
import Sprite from '../../lib/Sprite.js';
import { sounds } from '../globals.js';
import SoundName from '../enums/SoundName.js';
import Graphic from '../../lib/Graphic.js';

export default class Coin extends Entity {
	/**
	 * Creates a new Coin instance.
	 * @param {number} x - The x-coordinate of the Coin.
	 * @param {number} y - The y-coordinate of the Coin.
	 * @param {number} width - The width of the Coin.
	 * @param {number} height - The height of the Coin.
	 * @param {Graphic} spriteSheet - The sprite sheet containing Coin graphics.
     * @param {boolean} isBlockSpawned - Indicates if the coin is spawned from a block.
	 */
	constructor(x, y, width, height, spriteSheet, isBlockSpawned = false) {
		super(x, y, width, height);

		this.collected = false; 
        this.isBlockSpawned = isBlockSpawned; 
		
		this.coinAnimation = new Animation(
			coinSpriteConfig.coin.map(
				(frame) => new Sprite(spriteSheet, frame.x, frame.y, frame.width, frame.height)
			),
			0.2
		);
	}

	/**
	 * Updates the Coin's state.	
	 */
	update(dt) {
		this.coinAnimation.update(dt);
	}

	/**
	 * Renders the Coin on the canvas.
	 */
	render() {
		if (!this.collected) {
			this.coinAnimation.getCurrentFrame().render(this.position.x, this.position.y);
		}
	}

	/**
	 * Handles collision with the player, marking the coin as collected.
	 */
	onCollideWithPlayer() {
		if (!this.collected && !this.isBlockSpawned) {
			this.collect(); 
		}
	}

	/**
	 * Sets the coin as collected and plays the coin collection sound.
	 */
	collect() {
		this.collected = true;
		sounds.play(SoundName.Coin); 
	}
}
