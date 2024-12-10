import Sprite from '../../lib/Sprite.js';
import ImageName from '../enums/ImageName.js';
import Tile from './Tile.js';
import Layer from './Layer.js';
import { debugOptions, images } from '../globals.js';
import Block from '../entities/Block.js';
import Goomba from '../entities/Goomba.js';
import Coin from '../entities/Coin.js';

/**
 * Represents the game map, including layers, blocks, and entities.
 */
export default class Map {
	/**
	 * The index of the foreground layer in the layers array.
	 * @type {number}
	 */
	static FOREGROUND_LAYER = 0;

	/**
	 * Creates a new Map instance.
	 * @param {Object} mapDefinition - The map definition object, typically loaded from a JSON file.
	 */
	constructor(mapDefinition) {
		this.width = mapDefinition.width;
		this.height = mapDefinition.height;
		this.tileSize = mapDefinition.tilewidth;
		this.tilesets = mapDefinition.tilesets;

		// Generate sprites from the tileset image
		const sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Tiles),
			this.tileSize,
			this.tileSize
		);

		// Create Layer instances for each layer in the map definition
		this.layers = mapDefinition.layers.map(
			(layerData) => new Layer(layerData, sprites)
		);
		this.foregroundLayer = this.layers[Map.FOREGROUND_LAYER];

		// Initialize arrays to store special entities
		this.blocks = [];
		this.goombas = [];
		this.coins = [];
		this.mushrooms = []; 
		// Process the map to create special entities
		this.initializeSpecialTiles();
	}

	/**
	 * Initializes special tiles (blocks, goombas) from the foreground layer.
	 */
	initializeSpecialTiles() {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const tileId = this.foregroundLayer.getTile(x, y)?.id;

				switch (tileId) {
					case Tile.BLOCK:
						// Create a block entity and pass the map reference
						const block = new Block(
							x * this.tileSize,
							y * this.tileSize,
							images.get(ImageName.Tiles),
							this
						);						
						this.blocks.push(block);
						this.foregroundLayer.setTileId(x, y, Tile.BLANK); // Replace the block tile with a blank tile
						continue;
					case Tile.GOOMBA:
						this.goombas.push(
							new Goomba(
								x * this.tileSize,
								y * this.tileSize,
								this.tileSize,
								this.tileSize,
								images.get(ImageName.Tiles),
								this							
							)
						);
						this.foregroundLayer.setTile(x, y, null); // Remove the goomba tile
						continue;
					case Tile.COIN:
						// Add a new Coin at the specified position
						this.coins.push(
							new Coin(
								x * this.tileSize, 
								y * this.tileSize, 
								this.tileSize, 
								this.tileSize, 
								images.get(ImageName.Tiles)
							)
						);
						this.foregroundLayer.setTile(x, y, null); // Remove the coin tile from the map
						continue;                    
				}
			}
		}
	}

	/**
	 * Updates all entities in the map.
	 * @param {number} dt - The time passed since the last update.
	 */
	update(dt) {
		this.blocks.forEach((block) => block.update(dt));
		this.goombas.forEach((goomba) => goomba.update(dt));
		this.goombas = this.goombas.filter((goomba) => !goomba.isDead);
		this.coins.forEach((coin) => coin.update(dt));
		this.mushrooms.forEach((mushroom) => mushroom.update(dt)); // Update all mushrooms

		// Remove collected mushrooms
		this.mushrooms = this.mushrooms.filter((mushroom) => !mushroom.isCollected);
	}

	/**
	 * Renders the map and all its entities.
	 * @param {CanvasRenderingContext2D} context - The rendering context.
	 */
	render(context) {
		this.foregroundLayer.render();
		this.blocks.forEach((block) => block.render(context));
		this.goombas.forEach((goomba) => goomba.render(context));
		this.coins.forEach((coin) => coin.render(context));
		this.mushrooms.forEach((mushroom) => mushroom.render(context)); // Render all mushrooms

		if (debugOptions.mapGrid) {
			this.renderGrid(context);
		}
	}

	/**
	 * Retrieves a block at the specified coordinates.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {Block|undefined} The block at the specified position, if any.
	 */
	getBlockAt(x, y) {
		return this.blocks.find(
			(block) =>
				x >= block.position.x &&
				x < block.position.x + block.dimensions.x &&
				y >= block.position.y &&
				y < block.position.y + block.dimensions.y
		);
	}

	/**
	 * Gets a tile from a specific layer at the given column and row.
	 * @param {number} layerIndex - The index of the layer.
	 * @param {number} col - The column of the tile.
	 * @param {number} row - The row of the tile.
	 * @returns {Tile|null} The tile at the specified position, or null if no tile exists.
	 */
	getTileAt(layerIndex, col, row) {
		return this.layers[layerIndex].getTile(col, row);
	}

	/**
	 * Checks if there's a solid tile at the specified column and row.
	 * @param {number} col - The column to check.
	 * @param {number} row - The row to check.
	 * @returns {boolean} True if there's a solid tile, false otherwise.
	 */
	isSolidTileAt(col, row) {
		const tile = this.foregroundLayer.getTile(col, row);
		// Exclude platform tiles from the standard solid check
		return (
			tile !== null &&
			tile.id !== -1 &&
			tile.id !== Tile.PLATFORM_LEFT &&
			tile.id !== Tile.PLATFORM_RIGHT
		);
	}

	isPlatformTileAt(col, row) {
		const tile = this.foregroundLayer.getTile(col, row);
		return tile !== null && (tile.id === Tile.PLATFORM_LEFT || tile.id === Tile.PLATFORM_RIGHT);
	}


	/**
	 * Renders a debug grid over the map.
	 * @param {CanvasRenderingContext2D} context - The rendering context.
	 */
	renderGrid(context) {
		context.save();
		context.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // White with transparency
		context.lineWidth = 0.5;

		// Render vertical lines
		for (let x = 0; x <= this.width; x++) {
			context.beginPath();
			context.moveTo(x * this.tileSize, 0);
			context.lineTo(x * this.tileSize, this.height * this.tileSize);
			context.stroke();
		}

		// Render horizontal lines
		for (let y = 0; y <= this.height; y++) {
			context.beginPath();
			context.moveTo(0, y * this.tileSize);
			context.lineTo(this.width * this.tileSize, y * this.tileSize);
			context.stroke();
		}

		context.restore();
	}
}
