import { generate } from "../graphic/generate";
import { createAnims } from "../graphic/anims";
import { spawnRedEnemyCircles } from "../enemy/enemies";
import { Player } from "../player/Player";
import {debugModus} from "./config"
import { PlayerMovement } from "../player/PlayerMovement";

function createUnits(scene){
    scene.player = new Player(scene);
    scene.enemies = spawnRedEnemyCircles(scene, 1);
    scene.physics.add.collider(scene.player, scene.enemies);
}

function setupPlayer(scene){
    scene.cameras.main.startFollow(scene.player);
    scene.playerMovement = new PlayerMovement(scene.player, scene)
}

export function create() {
    generate(this);
    createAnims(this.anims);
    createUnits(this)
    setupPlayer(this)

    if(debugModus){ this.polygonOffset = 0
    }
}
