import { Gameplay } from "../app/gameplay";
import { ChainWeapon } from "../weapon/ChainWeapon";

export class ChainWeaponGenerator {
    chainWeapon: ChainWeapon;
    graphics: Phaser.GameObjects.Graphics;
    tempWeaponGroup: Phaser.Physics.Arcade.Group;
    scene: Gameplay;
    arrowHeadPolygonHeight: number;
    middlePolygonHeight: number;
    finalPolygonHeight: number;

    constructor(hexColor: number, scene: Gameplay){
        this.graphics = scene.add.graphics({
            fillStyle: {
                color: hexColor
            }
        });
        this.tempWeaponGroup = scene.physics.add.group();
        this.scene = scene

        let biggerThanWeapon = 300

        this.chainWeapon = new ChainWeapon(scene,biggerThanWeapon,biggerThanWeapon,this.tempWeaponGroup,5,2)
    
    }

    generate(){
        this.setPolygonHeightsForEasierPositioning()
        this.setPositionsForWeaponPolygonsForDrawing()
        this.drawChainWeaponPolygons()
        this.generateChainWeaponTexture()
        this.addFramesToChainWeaponTexture()
        this.destroyUsedObjects()
    }

    generateChainWeaponTexture(){
        let arrowHeadWidth = this.chainWeapon.polygon.getWidth()
        this.graphics.generateTexture("chainWeapon",arrowHeadWidth*3, this.finalPolygonHeight);

    }

    setPolygonHeightsForEasierPositioning(){
        this.arrowHeadPolygonHeight = this.chainWeapon.polygon.getHeight()
        this.middlePolygonHeight = this.chainWeapon.polygonArr[1].getHeight()
        this.finalPolygonHeight = this.chainWeapon.polygonArr[2].getHeight()
    }

    setPositionsForWeaponPolygonsForDrawing(){
        let newX = this.chainWeapon.polygon.getWidth() / 2

        let newY = this.finalPolygonHeight - this.arrowHeadPolygonHeight / 2
        this.chainWeapon.polygon.setPosition(newX,newY)

        newY = this.finalPolygonHeight - (this.middlePolygonHeight / 2)
        this.chainWeapon.polygonArr[1].setPosition(3*newX,newY)

        newY = this.finalPolygonHeight / 2
        this.chainWeapon.polygonArr[2].setPosition(5*newX,newY)
    }

    drawChainWeaponPolygons(){
        this.chainWeapon.polygon.draw(this.graphics,0)   
        this.chainWeapon.polygonArr[1].draw(this.graphics,0)
        this.chainWeapon.polygonArr[2].draw(this.graphics,0)
    }

    addFramesToChainWeaponTexture(){
        let topLeftX = 0
        let topLeftY = this.finalPolygonHeight - this.arrowHeadPolygonHeight
        let arrowHeadWidth = this.chainWeapon.polygon.getWidth()

        this.scene.textures.list["chainWeapon"].add(1, 0, topLeftX, topLeftY, arrowHeadWidth, this.arrowHeadPolygonHeight)   
        
        topLeftX += arrowHeadWidth
        topLeftY = this.finalPolygonHeight - this.middlePolygonHeight
        this.scene.textures.list["chainWeapon"].add(2, 0, topLeftX, topLeftY, arrowHeadWidth, this.middlePolygonHeight)
        
        topLeftX += arrowHeadWidth
        topLeftY = 0
        this.scene.textures.list["chainWeapon"].add(3, 0, topLeftX, topLeftY, arrowHeadWidth, this.finalPolygonHeight)
    }

    destroyUsedObjects(){
        //this.graphics.destroy()
        this.chainWeapon.destroy()
        this.tempWeaponGroup.destroy()
    }
    
}
