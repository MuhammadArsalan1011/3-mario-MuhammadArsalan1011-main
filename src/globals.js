import Debug from '../lib/Debug.js';
import Fonts from '../lib/Fonts.js';
import Images from '../lib/Images.js';
import Input from '../lib/Input.js';
import Sounds from '../lib/Sounds.js';
import StateMachine from '../lib/StateMachine.js';
import Timer from '../lib/Timer.js';

export const canvas = document.createElement('canvas');
export const context =
	canvas.getContext('2d') || new CanvasRenderingContext2D();
const assetDefinition = await fetch('./config/assets.json').then((response) =>
	response.json()
);

// Replace these values according to how big you want your canvas.
export const TILE_SIZE = 16;
export const CANVAS_WIDTH = TILE_SIZE * 20;
export const CANVAS_HEIGHT = TILE_SIZE * 15;

const resizeCanvas = () => {
	const scaleX = window.innerWidth / CANVAS_WIDTH;
	const scaleY = window.innerHeight / CANVAS_HEIGHT;
	const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

	canvas.style.width = `${CANVAS_WIDTH * scale}px`;
	canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
};

// Listen for canvas resize events
window.addEventListener('resize', resizeCanvas);

resizeCanvas(); // Call once to scale initially

export const input = new Input(canvas);
export const images = new Images(context);
export const fonts = new Fonts();
export const stateMachine = new StateMachine();
export const timer = new Timer();
export const sounds = new Sounds();
export const debug = new Debug();

// Load all the assets from their definitions.
sounds.load(assetDefinition.sounds);
images.load(assetDefinition.images);
fonts.load(assetDefinition.fonts);

// Debug options
export const debugOptions = {
	mapGrid: false,
	cameraCrosshair: false,
	playerCollision: false,
	watchPanel: false,
};

// Function to toggle a debug option
export function toggleDebugOption(option) {
	debugOptions[option] = !debugOptions[option];
	localStorage.setItem(`debug_${option}`, debugOptions[option]);
}

// Function to initialize debug options from localStorage
function initializeDebugOptions() {
	Object.keys(debugOptions).forEach((option) => {
		const storedValue = localStorage.getItem(`debug_${option}`);
		if (storedValue !== null) {
			debugOptions[option] = storedValue === 'true';
		}
	});
}

// Event listener for debug checkboxes
initializeDebugOptions();

const debugCheckboxes = document.querySelectorAll(
	'#controlPanel .debug input[type="checkbox"]'
);

debugCheckboxes.forEach((checkbox) => {
	checkbox.checked = debugOptions[checkbox.name];

	checkbox.addEventListener('change', () => {
		toggleDebugOption(checkbox.name);
	});
});
