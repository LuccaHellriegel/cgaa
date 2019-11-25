import { generate } from "../graphic/generate";
import { createAnims } from "../graphic/anims";
import { spawnRedEnemyCircles } from "../enemy/enemies";
import { Player } from "../player/Player";
import {debugModus} from "./config"
import { PlayerMovement } from "../player/PlayerMovement";
import {Gameplay} from "./gameplay"

function createUnits(scene: Gameplay){
    scene.player = new Player(scene);
    scene.enemies = spawnRedEnemyCircles(scene, 1);
    scene.physics.add.collider(scene.player, scene.enemies);
}

function setupPlayer(scene: Gameplay){
    scene.cameras.main.startFollow(scene.player);
    scene.playerMovement = new PlayerMovement(scene.player, scene)
}

export function createFunc(scene: Gameplay) {
    generate(scene);
    createAnims(scene.anims);
    createUnits(scene)
    setupPlayer(scene)

    if(debugModus){ scene.polygonOffset = 0
    }
}
