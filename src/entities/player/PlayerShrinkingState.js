import PlayerState from './PlayerState.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import { timer, sounds } from '../../globals.js';
import SoundName from '../../enums/SoundName.js';
import Player from './Player.js';

export default class PlayerShrinkingState extends PlayerState {
    constructor(player) {
        super(player);
    }

    enter() {
        this.player.currentAnimation = this.player.animations.shrink;
        sounds.play(SoundName.Pipe);
        this.player.isBig = false;   
    }

    exit() {
		this.player.currentAnimation = this.player.animations.idle;
	}

    update(dt) {
        super.update(dt);
		this.checkTransitions();
    }

    checkTransitions() {		
		if (this.player.currentAnimation.isDone()) {
            this.player.dimensions.y  = 24;
			this.player.position.y += 8;
			this.player.stateMachine.change(PlayerStateName.Idling);
		}
	}
}
