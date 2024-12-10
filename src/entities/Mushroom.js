import Entity from './Entity.js';
import Animation from '../../lib/Animation.js';
import { mushroomSpriteConfig, objectSpriteConfig } from '../../config/SpriteConfig.js';
import Sprite from '../../lib/Sprite.js';
import { sounds, timer } from '../globals.js';
import SoundName from '../enums/SoundName.js';
import Easing from '../../lib/Easing.js';
import Tile from '../services/Tile.js';
import Graphic from '../../lib/Graphic.js';
import Map from '../services/Map.js';

export default class Mushroom extends Entity {
	/**
	 * Creates a new Mushroom instance.
	 * @param {number} x - The x-coordinate of the Mushroom.
	 * @param {number} y - The y-coordinate of the Mushroom.
	 * @param {number} width - The width of the Mushroom.
	 * @param {number} height - The height of the Mushroom.
	 * @param {Graphic} spriteSheet - The sprite sheet containing Mushroom graphics.
	 * @param {Map} map - The game map instance.
	 */
	constructor(x, y, width, height, spriteSheet, map) {
		super(x, y, width, height);

		this.map = map; 
		this.sprite = new Sprite(
			spriteSheet,
			mushroomSpriteConfig.mushroom[0].x,
			mushroomSpriteConfig.mushroom[0].y,
			mushroomSpriteConfig.mushroom[0].width,
			mushroomSpriteConfig.mushroom[0].height
		);

		this.mushroomAnimation = new Animation([this.sprite], 1); 

		this.verticalSpeed = 0;
		this.speed = 30; 
		this.direction = 1; 
		this.gravity = 800; 
		this.isCollected = false;
		this.isSpawning = true;

		this.opacity = 1; 
		this.flickerInterval = 0.1; 
		this.initMushroom();
	}

	/**
	 * Initializes the mushroom by playing the spawn sound and a small spawn animation.
	 */
	async initMushroom() {
		sounds.play(SoundName.SproutItem);
		await timer.tweenAsync(
			this.position,
			{ y: this.position.y - this.dimensions.y },
			0.3,
			Easing.easeOutQuad 
		);
		this.isSpawning = false;
		this.setLifetime(); 
	}

	/**
	 * Updates the Mushroom's state.
	*/
	update(dt) {
		if (this.isCollected) return;

		this.verticalSpeed += this.gravity * dt;
		this.position.y += this.verticalSpeed * dt;

		if (!this.isSpawning) {
			this.position.x += this.direction * this.speed * dt;
		}

		this.checkCollisions();
		this.mushroomAnimation.update(dt);
	}

	/**
	 * Renders the Mushroom on the canvas.
	 */
	render(context) {
		if (!this.isCollected) {
			context.save();
			context.globalAlpha = this.opacity;
			this.mushroomAnimation.getCurrentFrame().render(this.position.x, this.position.y);
			context.globalAlpha = 1;
			context.restore();
		}
	}

	/**
	 * Checks for collisions with walls and ground.
	 */
	checkCollisions() {		
		if (this.onGround()) {
			this.position.y = Math.floor(this.position.y / this.map.tileSize) * this.map.tileSize;
			this.verticalSpeed = 0;
		}

		if (this.isCollidingWithWall()) {
			this.direction *= -1;
		}
	}

	onGround() {
		const bottomTile = Math.floor((this.position.y + this.dimensions.y) / Tile.SIZE);
		const leftTile = Math.floor(this.position.x / Tile.SIZE);
		const rightTile = Math.floor((this.position.x + this.dimensions.x) / Tile.SIZE);

		return (
			this.map.isSolidTileAt(leftTile, bottomTile) ||
			this.map.isSolidTileAt(rightTile, bottomTile)
		);
	}

	/**
	 * Checks if the mushroom is colliding with a wall.	
	 */
	isCollidingWithWall() {
		const topTile = Math.floor(this.position.y / Tile.SIZE);
		const bottomTile = Math.floor((this.position.y + this.dimensions.y - 1) / Tile.SIZE);
		const sideTile = Math.floor(
			(this.position.x + (this.direction > 0 ? this.dimensions.x : 0)) / Tile.SIZE
		);

		return (
			this.map.isSolidTileAt(sideTile, topTile) ||
			this.map.isSolidTileAt(sideTile, bottomTile)
		);
	}

	/**
	 * Handles collision with the player, triggering the power-up effect.
	 */
	onCollideWithPlayer(player) {
		if (!this.isCollected) {
			this.isCollected = true;
			if(!player.isBig)
			{
				sounds.play(SoundName.Powerup);
				player.grow();
			}
		}
	}

	/**
 	* Sets a lifetime for the mushroom and makes it flicker before disappearing.
 	*/
	async setLifetime() {
		const lifetime = 7; 
		const flickerDuration = 3; 
		await timer.wait(lifetime); 
		
		let elapsedTime = 0;

		while (elapsedTime < flickerDuration) {
			this.opacity = this.opacity === 1 ? 0 : 1;
			await timer.wait(this.flickerInterval);
			elapsedTime += this.flickerInterval;
		}

		this.isCollected = true;
	}

}
