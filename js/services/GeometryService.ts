import { wallPartRadius } from "../global";

export class GeometryService {
    private constructor(){}
    static calculateBorderObjectFromPartsAndSize(parts,width,height){
        let borderX = parts[0][0].x + wallPartRadius;
        let borderY = parts[0][0].y + wallPartRadius;
        let borderWidth = width - 4 * wallPartRadius;
        let borderHeight = height - 4 * wallPartRadius;
        return { borderX, borderY, borderWidth, borderHeight };
      } 
}