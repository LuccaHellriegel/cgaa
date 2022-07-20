import { Building } from "./buildings/Building";
import { bossCamp } from "./camps/boss/bossCamp";
import { campsStaticUnits, populateCamps } from "./camps/camps";
import { CampsState } from "./camps/CampsState";
import { playerCamp } from "./camps/playerCamp";
import { CampSetup } from "./config/CampSetup";
import { EnvSetup } from "./config/EnvSetup";
import { EventSetup } from "./config/EventSetup";
import { mapSpawnablePos } from "./data/data-layout";
import { arrayMiddle } from "./engine/array";
import { RealDict } from "./engine/RealDict";
import { Quest } from "./engine/quest/Quest";
import { Quests } from "./engine/quest/Quests";
import { RelPos } from "./engine/RelPos";
import { Point } from "./engine/types-geom";
import { Physics } from "./physics/physics";
import { Movement } from "./player/input/Movement";
import { playerInput } from "./player/input/playerInput";
import { Spawner } from "./player/input/Spawner";
import { Player } from "./player/Player";
import { DangerousCirclePool } from "./pool/CirclePool";
import { Pools, initPools } from "./pool/pools";
import { Gameplay } from "./scenes/Gameplay";
import { EnemySpawnObj } from "./spawn/EnemySpawnObj";
import { Rivalries } from "./state/Rivalries";
import { State } from "./state/state";
import { BuildManager } from "./ui/build/BuildManager";
import { SelectorRect } from "./ui/SelectorRect";
import { CircleFactory } from "./units/CircleFactory";
import { Enemies } from "./units/Enemies";
import { InteractionCircle } from "./units/InteractionCircle/InteractionCircle";
import { PlayerFriend } from "./units/PlayerFriend";
import { WaveController } from "./wave/WaveController";
import { WaveOrder } from "./wave/WaveOrder";
import { WavePopulator } from "./wave/WavePopulator";

class WallSide extends Phaser.Physics.Arcade.Image {
  constructor(scene: Gameplay, x: number, y: number, width, height, addEnv) {
    super(scene, x, y, "");
    scene.add.existing(this);
    addEnv(this);
    this.setSize(width, height).setVisible(false).setActive(false);
  }
}

function addWallside(scene: Gameplay, addEnv, partPositions: Point[]) {
  partPositions.forEach((partPosition) => {
    scene.add.image(partPosition.x, partPosition.y, "wallPart");
  });

  const firstPositionX = partPositions[0].x;
  const lastPositionX = partPositions[partPositions.length - 1].x;
  const width = lastPositionX - firstPositionX + EnvSetup.gridPartSize;

  const firstPositionY = partPositions[0].y;
  const lastPositionY = partPositions[partPositions.length - 1].y;
  const height = lastPositionY - firstPositionY + EnvSetup.gridPartSize;

  const middleX = firstPositionX + width / 2 - EnvSetup.halfGridPartSize;
  const middleY = firstPositionY + height / 2 - EnvSetup.halfGridPartSize;
  new WallSide(scene, middleX, middleY, width, height, addEnv);
}

function initQuests(
  scene,
  rivalries: Rivalries,
  quests: Quests,
  diplomats: InteractionCircle[][]
) {
  CampSetup.ordinaryCampIDs.forEach((id) => {
    const rivalID = rivalries.getRival(id);
    const amountToKill = CampSetup.numbOfDiplomats + CampSetup.numbOfBuildings;
    const quest = Quest.killQuest(
      scene,
      rivalries,
      quests,
      id,
      scene.events,
      EventSetup.unitKilledEvent,
      rivalID,
      amountToKill,
      EventSetup.essentialUnitsKilled,
      rivalID
    );
    quests.set(id, quest);

    for (const diplomatArr of diplomats) {
      for (const diplomat of diplomatArr) {
        if (diplomat.campID == id) {
          diplomat.setQuest(quest);
        }
      }
    }
  });
}

function createBuildingSpawnableDictsPerBuilding(buildingPos: {
  spawnPos: RelPos[];
  positionInMap: RelPos;
}): RealDict {
  let arr = [];
  buildingPos.spawnPos.forEach((pos) => {
    let point = pos.toPoint();
    arr.push([point, EnvSetup.walkableSymbol]);
  });
  return new RealDict(arr);
}

function waveProducer(
  scene,
  campsState: CampsState,
  state: FinalState,
  pools: Pools,
  enemies: Enemies,
  waveOrder: WaveOrder,
  staticUnits
) {
  for (const units of staticUnits) {
    for (const building of units.buildings) {
      for (const pos of state.camps.get((building as Building).campID)
        .buildingPositionsInMap) {
        const point = pos.positionInMap.toPoint();
        if (building.x == point.x && building.y == point.y) {
          const spawnDict = createBuildingSpawnableDictsPerBuilding(pos);
          new WavePopulator(
            scene,
            building.campID,
            new DangerousCirclePool(
              scene,
              8,
              new CircleFactory(
                scene,
                building.campID,
                building.mask,
                state.physics.addUnit,
                enemies,
                pools.weapons[building.campID]
              ),
              enemies,
              building.spawnUnit
            ),
            new EnemySpawnObj(spawnDict, enemies),
            state.pathAssigner,
            campsState,
            building.id
          );
          break;
        }
      }
    }
  }

  return () => {
    new WaveController(scene, waveOrder);
  };
}

export interface FinalState extends State {
  physics: Physics;
}

export interface CGAA extends FinalState {
  startWaves: Function;
  diplomats: InteractionCircle[][];
  input: {
    spawners: Spawner[];
    selectorRect: SelectorRect;
    build: BuildManager;
    movement: Movement;
  };
  player: Player;
  friends: PlayerFriend[];
  waveOrder: WaveOrder;
}

export function GameStart(scene, state: FinalState): CGAA {
  state.wallSides.forEach((wallSide) => {
    addWallside(
      scene,
      state.physics.addEnv,
      wallSide.positionsInMap.map((pos) => pos.toPoint())
    );
  });

  const enemies = new Enemies();

  // Assumes player camp has only one exit
  const playerExit = arrayMiddle(
    state.camps.get(CampSetup.playerCampID).exitPositionsInMap[0].positionsInMap
  ).toPoint();
  const player = Player.withChainWeapon(scene, playerExit.x, playerExit.y);
  state.physics.addUnit(player);

  const pools = initPools(
    scene,
    state.physics.addTower,
    state.physics.addBullet,
    player
  );

  const staticUnits = campsStaticUnits(
    scene,
    state.camps,
    state.physics,
    enemies,
    pools.weapons
  );
  const campsState = new CampsState(
    scene,
    staticUnits.map((units) => {
      return units.buildings;
    })
  );

  const mapSpawnPos = mapSpawnablePos(
    state.gameMap,
    state.mapDefaultSymbol,
    state.exits
  );
  populateCamps(
    scene,
    state.camps,
    enemies,
    campsState,
    mapSpawnPos,
    state,
    pools
  );

  bossCamp(scene, state, enemies, pools, campsState, mapSpawnPos);

  const friends = playerCamp(
    scene,
    state.camps.get(CampSetup.playerCampID).areaMapMiddle.toPoint(),
    pools,
    state,
    enemies
  );
  const input = playerInput(scene, player, mapSpawnPos, enemies, pools);

  const diplomats = staticUnits.map((units) => {
    return units.diplomats;
  });
  initQuests(scene, state.rivalries, state.quests, diplomats);

  const waveOrder = new WaveOrder(campsState);

  return {
    ...state,
    input,
    diplomats,
    startWaves: waveProducer(
      scene,
      campsState,
      state,
      pools,
      enemies,
      waveOrder,
      staticUnits
    ),
    player,
    waveOrder,
    friends,
  };
}
