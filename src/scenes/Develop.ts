import { ClickModes } from "../engine/ui/modes/ClickModes";

export class Develop extends Phaser.Scene {
	// cgaa: CGAA;
	// cgaaInteraction: Function;
	// cgaaMovement: Movement;
	// cgaaStartWaves: Function;
	// constructor() {
	// 	super("Develop");
	// }
	// preload() {
	// 	GameGraphics(this);
	// 	GameAnimation(this.anims);
	// 	const config: CGAAData = {
	// 		campIDs: CampSetup.campIDs,
	// 		buildingsPerCamp: CampSetup.numbOfBuildings,
	// 		mapDefaultSymbol: EnvSetup.walkableSymbol,
	// 		mapWallSymbol: EnvSetup.wallSymbol,
	// 		mapBuildingSymbol: EnvSetup.buildingSymbol,
	// 		areaLayout: Layouts.areaPositions,
	// 		areaSymbol: 1,
	// 		areaSize: EnvSetup.areaSize,
	// 		exitLayout: Layouts.exitSides,
	// 	};
	// 	const gameData = GameData(config);
	// 	const gameState = GameState(this, gameData, (data) => {
	// 		return data.gameMapMiddle;
	// 	});
	// 	const physics = GamePhysics(this, gameState.cooperation);
	// 	const cgaa = GameStart(this, { ...gameState, physics });
	// 	this.cgaa = cgaa;
	// 	this.cgaaMovement = cgaa.input.movement;
	// 	this.cgaaStartWaves = cgaa.startWaves;
	// 	this.cgaaInteraction = function interactWithCircle(interactCircle: InteractionCircle) {
	// 		let id = interactCircle.campID;
	// 		//Can not accept quests from rivals
	// 		if (!this.cgaa.quests.get(this.cgaa.rivalries.getRival(id)).isActiveOrSuccess()) {
	// 			if (!interactCircle.quest.isActiveOrSuccess()) interactCircle.quest.setActive();
	// 			if (interactCircle.quest.isSuccess()) {
	// 				// check if id has cooperation with player, because id would need to be rerouted
	// 				if (this.cgaa.cooperation.hasCooperation(id, CampSetup.playerCampID)) {
	// 					this.cgaa.router.reroute(id);
	// 				} else {
	// 					this.cgaa.cooperation.activateCooperation(id, CampSetup.playerCampID);
	// 				}
	// 			}
	// 		}
	// 	}.bind(this);
	// }
	// setModes(modes: ClickModes) {
	// 	this.cgaa.diplomats.forEach((arr) =>
	// 		arr.forEach((diplomat) => {
	// 			modes.addTo(diplomat);
	// 		})
	// 	);
	// 	this.cgaa.input.spawners.forEach((spawner) => {
	// 		spawner.setModes(modes);
	// 	});
	// }
	// update() {
	// 	this.cgaaMovement.update();
	// }
	// create() {}
}
