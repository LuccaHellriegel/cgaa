import damage from "../../assets/audio/damage.mp3";
import hit from "../../assets/audio/hit.mp3";
import step from "../../assets/audio/step.mp3";
import { Gameplay } from "./gameplay";

export function preloadFunc(scene: Gameplay) {
    scene.load.audio("damage", damage);
    scene.load.audio("hit", hit);
    scene.load.audio("step", step);
}
