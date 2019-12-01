import { wallPartHalfSize } from "../globals/globalSizes";

export class GeometryService {
    private constructor(){}
    static calculateBorderObjectFromPartsAndSize(parts,width,height){
        let borderX = parts[0][0].x + wallPartHalfSize;
        let borderY = parts[0][0].y + wallPartHalfSize;
        let borderWidth = width - 4 * wallPartHalfSize;
        let borderHeight = height - 4 * wallPartHalfSize;
        return { borderX, borderY, borderWidth, borderHeight };
      } 
}