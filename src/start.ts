import { Building } from "./camps/Building";
import { bossCamp } from "./camps/bossCamp";
import { campsStaticUnits, populateCamps } from "./camps/camps";
import { CampsState } from "./camps/CampsState";
import { playerCamp } from "./camps/playerCamp";
import { CampSetup } from "./config/CampSetup";
import { EnvSetup } from "./config/EnvSetup";
import { mapSpawnablePos } from "./data/data-layout";
import { arrayMiddle } from "./engine/array";
import { RealDict } from "./engine/RealDict";
import { RelPos } from "./engine/RelPos";
import { Point } from "./engine/Point";
import { Physics } from "./physics/physics";
import { playerInput } from "./player/playerInput";
import { Spawner } from "./player/Spawner";
import { Player } from "./player/Player";
import { Pools, initPools } from "./pool/pools";
import { Gameplay } from "./scenes/Gameplay";
import { EnemySpawnObj } from "./spawn/EnemySpawnObj";
import { State } from "./state";
import { BuildManager } from "./ui/build/BuildManager";
import { SelectorRect } from "./ui/SelectorRect";
import { CircleFactory } from "./units/CircleFactory";
import { Enemies } from "./units/Enemies";
import { InteractionCircle } from "./units/InteractionCircle";
import { PlayerFriend } from "./units/PlayerFriend";
import { WaveController } from "./wave/WaveController";
import { WaveOrder } from "./wave/WaveOrder";
import { WavePopulator } from "./wave/WavePopulator";
import { CampManager } from "./camps/CampManager";

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
            new CircleFactory(
              scene,
              building.campID,
              building.campMask,
              state.physics.addUnit,
              enemies,
              pools.weapons[building.campID]
            ),
            new EnemySpawnObj(spawnDict, enemies),
            state.pathAssigner,
            campsState,
            building.id,
            building.spawnUnit
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
    move: () => void;
  };
  player: Player;
  friends: PlayerFriend[];
  waveOrder: WaveOrder;
  manager: CampManager;
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
