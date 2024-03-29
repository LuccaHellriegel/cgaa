import { GameData } from "../data/data";
import { Layouts } from "../data/data-layout";
import { ClickModes } from "../ui/modes/ClickModes";
import { state } from "../state";
import { physics } from "../physics/physics";
import { Textures } from "../textures/textures";
import { CGAAData } from "../types";
import { InteractionCircle } from "../units/InteractionCircle";
import { createShooterAnims } from "../towers/createShooterAnims";
import { createCircleAnims } from "../units/circle-anim";
import { createChainWeaponAnims } from "../weapons/chain-weapon-anim";
import { CampSetup } from "../config/CampSetup";
import { EnvSetup } from "../config/EnvSetup";
import { CGAA, GameStart } from "../start";
import { runSystems } from "../dod/data";

export class Gameplay extends Phaser.Scene {
  cgaa: CGAA;
  cgaaInteraction: Function;

  constructor() {
    super("Gameplay");
  }

  preload() {
    Textures(this);
    createChainWeaponAnims(this.anims);
    createCircleAnims(this.anims);
    createShooterAnims(this.anims);

    const config: CGAAData = {
      campIDs: CampSetup.campIDs,
      buildingsPerCamp: CampSetup.numbOfBuildings,

      mapDefaultSymbol: EnvSetup.walkableSymbol,
      mapWallSymbol: EnvSetup.wallSymbol,
      mapBuildingSymbol: EnvSetup.buildingSymbol,

      areaLayout: Layouts.areaPositions,
      areaSymbol: 1,
      areaSize: EnvSetup.areaSize,
      exitLayout: Layouts.exitSides,
    };

    const gameData = GameData(config);

    const gameState = state(this, gameData, (data) => {
      return data.gameMapMiddle;
    });

    const physicsObj = physics(this, gameState.cooperation);

    const cgaa = GameStart(this, { ...gameState, physics: physicsObj });
    this.cgaa = cgaa;

    this.cgaaInteraction = function interactWithCircle(
      interactCircle: InteractionCircle
    ) {
      let id = interactCircle.campID;
      let mask = interactCircle.campMask;
      if (cgaa.manager.setActive(id) && cgaa.manager.success(id)) {
        // check if id has cooperation with player, because id would need to be rerouted
        if (cgaa.cooperation.has(mask, CampSetup.playerCampMask)) {
          cgaa.manager.reroute(id);
        } else {
          cgaa.cooperation.activate(mask, CampSetup.playerCampMask);
        }
      }
    }.bind(this);
  }

  setModes(modes: ClickModes) {
    this.cgaa.diplomats.forEach((arr) =>
      arr.forEach((diplomat) => {
        modes.addTo(diplomat);
      })
    );
    this.cgaa.input.spawners.forEach((spawner) => {
      spawner.setModes(modes);
    });
  }

  update() {
    this.cgaa.entityManager.update();
    this.cgaa.input.move();
    runSystems(this);
  }

  create() {}
}
