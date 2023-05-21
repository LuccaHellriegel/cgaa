import { EnemySize } from "./data/EnemySize";
import { HealthBar } from "./gameobjects/HealthBar";
import { Point } from "./geom/Point";
import { ChainWeapon } from "./gameobjects/ChainWeapon";
import { Circle } from "./gameobjects/Circle";
import { SelectorRect } from "./gameobjects/SelectorRect";
import { GameObjects } from "phaser";

//Drawing, physics and animation managed by PhaserJS
//PhaserJS objects completely stripped of any Game Logic

export type EntityID = number;
type EntityIDs = EntityID[];
type EntityToValueMap = Record<EntityID, number>;
type EntityToEntityMap = Record<EntityID, EntityID>;

type EntityState = {
  campIDAssignments: Record<EntityID, string>; //TODO: make number
  health: EntityToValueMap;
  weapons: Record<EntityID, ChainWeapon>;
  weaponDamage: EntityToValueMap;
  attacking: EntityIDs;
  weaponOverlap: EntityToEntityMap;
  damagePairs: [EntityID, EntityID][];
  killedEntities: [EntityID, EntityID][];
  selectorRect: SelectorRect;
  ai: any;
  // ai: Record<EntityID, CircleControl>;
  entityObjects: Record<EntityID, Phaser.Physics.Arcade.Sprite>;
  unitSizes: Record<EntityID, EnemySize>;
  healthbars: Record<EntityID, HealthBar>;
  cursorPositions: Point[];
};

export const components: EntityState = {
  campIDAssignments: {},
  health: {},
  weapons: {},
  weaponDamage: {},
  ai: {},
  entityObjects: {},
  unitSizes: {},
  healthbars: {},
  selectorRect: null,
  //TEMP
  damagePairs: [],
  killedEntities: [],
  weaponOverlap: {},
  attacking: [],
  cursorPositions: [],
};

export function prepareStateForNextFrame() {
  components.weaponOverlap = {};
  components.damagePairs = [];
  components.killedEntities = [];
  components.cursorPositions = [];
}

export const counterState = {
  entityCounter: 1,
  playerSouls: 200,
};

export function getNextEntityId(): number {
  counterState.entityCounter++;
  return counterState.entityCounter;
}

export function handleAttacks() {
  const newAttacking: EntityIDs = [];

  for (let i = 0; i < components.attacking.length; i++) {
    const attacker = components.attacking[i];
    const overlapped = components.weaponOverlap[attacker];

    let damaged = false;
    //is attacking and has weapon overlap
    if (overlapped !== undefined) {
      //not the same camp - might need to change this to collab status to disable all friendly fire
      if (
        components.campIDAssignments[attacker] !==
        components.campIDAssignments[overlapped]
      ) {
        components.damagePairs.push([overlapped, attacker]);
        damaged = true;
      }
    }

    //can only do single damage with one attack
    if (!damaged) {
      newAttacking.push(attacker);
    }
  }

  components.attacking = newAttacking;
}

export function handleDamages() {
  for (let index = 0; index < components.damagePairs.length; index++) {
    const element = components.damagePairs[index];
    const attacked = element[0];
    const attacker = element[1];
    const weaponDamage = components.weaponDamage[attacker];
    const attackedHealth = components.health[attacked];
    const newHealth = attackedHealth - weaponDamage;
    if (newHealth <= 0) {
      components.killedEntities.push(element);
    } else {
      //update AI
      const circleControl = components.ai[attacked];
      if (circleControl !== undefined) {
        const object = components.entityObjects[attacker];
        circleControl.spotted = object;
        circleControl.obstacle = object;
      }
      //update health
      components.health[attacked] = newHealth;
      components.healthbars[attacked].draw(
        components.entityObjects[attacked].x,
        components.entityObjects[attacked].y,
        newHealth
      );
    }
  }
}

const entityMaps: (keyof EntityState)[] = [
  "campIDAssignments",
  "health",
  "weaponDamage",
  "ai",
  "entityObjects",
  "unitSizes",
  "healthbars",
];

export function handleKilled() {
  entityMaps.forEach((key) => {
    const map = components[key];
    components.killedEntities.forEach((entity) => {
      delete map[entity[0]];
    });
  });
}

let WASD;
const playerVelocity = 500;
export function handlePlayer(scene: Phaser.Scene) {
  //player velocity
  let { left, right, up, down } = WASD();
  const player = components.entityObjects[0];
  if (left) {
    player.setVelocityX(-playerVelocity);
  }
  if (right) {
    player.setVelocityX(playerVelocity);
  }
  if (up) {
    player.setVelocityY(-playerVelocity);
  }
  if (down) {
    player.setVelocityY(playerVelocity);
  }
  let noButtonDown = !left && !right && !up && !down;
  if (noButtonDown) {
    player.setVelocityX(0);
    player.setVelocityY(0);
  }

  //selector rect
  if (components.cursorPositions.length > 0) {
    const pointer =
      components.cursorPositions[components.cursorPositions.length - 1];
    let newX = pointer.x + scene.cameras.main.scrollX;
    let newY = pointer.y + scene.cameras.main.scrollY;
    let correctionForPhasersMinus90DegreeTopPostion = (Math.PI / 180) * 90;
    let rotation =
      Phaser.Math.Angle.Between(player.x, player.y, newX, newY) +
      correctionForPhasersMinus90DegreeTopPostion;
    player.setRotation(rotation);
    components.selectorRect.setPosition(newX, newY);
  }

  //soul gain
  for (let index = 0; index < components.killedEntities.length; index++) {
    const element = components.killedEntities[index];
    const killedBy = element[1];
    if (killedBy === 0) {
      // EventSetup.gainSouls(scene, entityState.unitSizes[element[0]]);
    }
  }
}

export function setupPlayer(scene: Phaser.Scene) {
  components.selectorRect = new SelectorRect(scene, 100, 100);
  const player = Circle.player(scene, 100, 100);
  components.entityObjects[0] = player;
  scene.cameras.main.startFollow(player);
  scene.input.on("pointermove", (pointer: Point) => {
    components.cursorPositions.push(pointer);
  });
  const cursors = scene.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
  }) as any;
  const left = cursors.left;
  const right = cursors.right;
  const up = cursors.up;
  const down = cursors.down;

  WASD = () => ({
    left: left.isDown,
    right: right.isDown,
    up: up.isDown,
    down: down.isDown,
  });
}

export function runSystems(scene: Phaser.Scene) {
  handleAttacks();
  handleDamages();
  handlePlayer(scene);
  handleKilled();
  prepareStateForNextFrame();
}
