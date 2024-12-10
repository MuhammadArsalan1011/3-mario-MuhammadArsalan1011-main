import PlayerState from './PlayerState.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import { sounds, timer } from '../../globals.js';
import SoundName from '../../enums/SoundName.js';
import Player from './Player.js';

export default class PlayerGrowingState extends PlayerState {
	constructor(player) {
		super(player);
	}
	
	enter() {
		this.player.currentAnimation = this.player.animations.grow;
		this.player.isBig = true;
		this.player.dimensions.y = 32;
		this.player.position.y -= 8;
	}

	exit() {
		this.player.currentAnimation = this.player.animations.idle;
	}

	update(dt) {
		super.update(dt);
		this.checkTransitions();
	}

	/**
	 * Checks for state transitions.
	 */
	checkTransitions() {
		if (this.player.currentAnimation.isDone()) {
			this.player.stateMachine.change(PlayerStateName.Idling);
		}
	}
}
