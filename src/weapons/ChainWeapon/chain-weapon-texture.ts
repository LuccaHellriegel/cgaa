import { EnemySize } from "../../units/CircleFactory";
import {
  cirlceSizeNames,
  unitArrowHeadConfig,
  ArrowConfig,
  WeaponGeoms,
  chainWeaponColor,
} from "./chain-weapon-base";
import { weaponHeights } from "./chain-weapon-data";
import { weaponGeoms } from "./chain-weapon-geom";

// DRAW
function drawChainWeapon(
  graphics: Phaser.GameObjects.Graphics,
  geoms: WeaponGeoms
) {
  let { frame0, frame1, frame2 } = geoms;
  drawChainWeaponFrame(graphics, frame0);
  drawChainWeaponFrame(graphics, frame1);
  drawChainWeaponFrame(graphics, frame2);
}
function drawChainWeaponFrame(graphics: Phaser.GameObjects.Graphics, geom) {
  if (geom.arrow) graphics.fillPoints(geom.arrow, true, true);
  if (geom.bigChain) {
    for (let joint of geom.bigChain.points)
      graphics.fillCircle(joint.x, joint.y, geom.bigChain.radius);
  }
  if (geom.smallChain) {
    for (let joint of geom.smallChain.points)
      graphics.fillCircle(joint.x, joint.y, geom.smallChain.radius);
  }
}

// TEXTURE
export function weaponTextures(scene: Phaser.Scene) {
  let g = scene.add.graphics({ fillStyle: { color: chainWeaponColor } });
  for (let unitSize of cirlceSizeNames) unitWeaponTexture(scene, unitSize, g);
}
function unitWeaponTexture(
  scene: Phaser.Scene,
  unitSize: EnemySize,
  g: Phaser.GameObjects.Graphics
) {
  let geom = weaponGeoms[unitSize];
  let title = unitSize + "chainWeapon";
  let arrowConfig = unitArrowHeadConfig[unitSize];
  drawChainWeapon(g, geom);
  captureChainWeaponTexture(scene, g, title, unitSize, arrowConfig);
  g.clear();
}
function captureChainWeaponTexture(
  scene: Phaser.Scene,
  graphics: Phaser.GameObjects.Graphics,
  title: string,
  unitSize: EnemySize,
  config: ArrowConfig
) {
  // weapon width = arrow width
  let { width } = config;
  let { frame2 } = weaponHeights[unitSize];
  // needs to be the same graphics object that was used for ALL of the drawing
  // (no game objects allowed, e.g. add.circle)
  // drawing needs to be perfectly alligned with 0,0 being top-left
  graphics.generateTexture(title, width * 3, frame2);
  // capture frames
  // caputure arrow-head frame + empty space
  scene.textures.list[title].add(0, 0, 0, 0, width, frame2);
  // capture arrow-head + big chain + emptyspace
  scene.textures.list[title].add(1, 0, 0 + width, 0, width, frame2);
  // capture full weapon
  // TODO weird endless rectanlge appears below full texture
  scene.textures.list[title].add(2, 0, 0 + 2 * width, 0, width, frame2);
}
