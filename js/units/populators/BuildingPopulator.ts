import { Populator } from "./Populator";
import { Gameplay } from "../../scenes/Gameplay";
import { Building } from "../../env/Building";
import { PathfindingCircle } from "../circles/PathfindingCircle";
import EasyStar from "easystarjs"
import { wallPartRadius } from "../../global";


export class BuildingPopulator extends Populator {
  easyStar: EasyStar.js;
    constructor(
        scene: Gameplay,
        enemyPhysics: Phaser.Physics.Arcade.Group,
        enemyWeapons: Phaser.Physics.Arcade.Group,
        building: Building, easyStar
      ) {
        super(scene, enemyPhysics, enemyWeapons, building);
        this.easyStar = easyStar
        this.onEvent();
      }

      chooseEnemyClass(){
        return PathfindingCircle.create.bind(PathfindingCircle)
      }

      constructEnemy(randX, randY, enemyClass){
        return enemyClass(
          this.scene,
          randX,
          randY,
          "blueCircle",
          this.enemyPhysics,
          this.enemyWeapons,
          this.easyStar
        );

    
      }
    }