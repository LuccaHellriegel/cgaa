import damage from "/assets/audio/damage.mp3";
import hit from "/assets/audio/hit.mp3";
import step from "/assets/audio/step.mp3";
export function preload() {
    this.load.audio("damage", damage);
    this.load.audio("hit", hit);
    this.load.audio("step", step);
}
