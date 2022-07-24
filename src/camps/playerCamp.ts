import { CircleFactory, EnemySize, veloConfigs } from "../units/CircleFactory";
import { Enemies } from "../units/Enemies";
import { PlayerFriend } from "../units/PlayerFriend";
import { Point } from "../engine/Point";
import { GuardComponent } from "../ai/GuardComponent";
import { CampSetup } from "../config/CampSetup";
import { EnvSetup } from "../config/EnvSetup";
import { Pools } from "../pool/pools";
import { FinalState } from "../start";
import { Scene } from "phaser";

//TODO: make Enemies once they are in the PlayerCamp search these units?
//TODO: Friend Kills should give the player money
export function playerCamp(
  scene: Scene,
  realMiddlePos: Point,
  pools: Pools,
  state: FinalState,
  enemies: Enemies
) {
  const friendPools = {
    Big: pools.friendWeapons,
    Small: null,
    Normal: null,
  };

  const friends: PlayerFriend[] = [];
  const baseConfig = {
    size: "Big",
  };

  const friendConfigs = [
    //First column
    { ...baseConfig, x: realMiddlePos.x, y: realMiddlePos.y },
    {
      ...baseConfig,
      x: realMiddlePos.x,
      y: realMiddlePos.y - EnvSetup.gridPartSize,
    },
    {
      ...baseConfig,
      x: realMiddlePos.x,
      y: realMiddlePos.y + EnvSetup.gridPartSize,
    },
    //Middle column
    {
      ...baseConfig,
      x: realMiddlePos.x - EnvSetup.gridPartSize,
      y: realMiddlePos.y,
    },
    {
      ...baseConfig,
      x: realMiddlePos.x - EnvSetup.gridPartSize,
      y: realMiddlePos.y - EnvSetup.gridPartSize,
    },
    {
      ...baseConfig,
      x: realMiddlePos.x - EnvSetup.gridPartSize,
      y: realMiddlePos.y + EnvSetup.gridPartSize,
    },
    //Right column
    {
      ...baseConfig,
      x: realMiddlePos.x + EnvSetup.gridPartSize,
      y: realMiddlePos.y,
    },
    {
      ...baseConfig,
      x: realMiddlePos.x + EnvSetup.gridPartSize,
      y: realMiddlePos.y - EnvSetup.gridPartSize,
    },
    {
      ...baseConfig,
      x: realMiddlePos.x + EnvSetup.gridPartSize,
      y: realMiddlePos.y + EnvSetup.gridPartSize,
    },
  ];

  const createFriend = (size: EnemySize) => {
    let weapon = CircleFactory.createWeapon(friendPools, 0, 0, size);

    let circle = new PlayerFriend(
      scene,
      0,
      0,
      CampSetup.playerCampID + size + "Circle",
      CampSetup.playerCampID,
      CampSetup.playerCampMask,
      weapon,
      size as EnemySize,
      CircleFactory.createHealthBar(scene, 0, 0, size),
      veloConfigs[size]
    );
    state.physics.addUnit(circle);

    circle.weapon.setOwner(circle);
    scene.children.bringToTop(circle.healthbar.bar);
    enemies.addEnemy(circle);

    return circle;
  };

  friendConfigs.forEach((config) => {
    let circle = createFriend(config.size as EnemySize);
    circle.stateHandler.setComponents([
      new GuardComponent(circle, circle.stateHandler),
    ]);
    circle.setPosition(config.x, config.y);
    friends.push(circle);
  });
  return friends;
}
