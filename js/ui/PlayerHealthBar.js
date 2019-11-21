import { HealthBar } from "./HealthBar"

export class PlayerHealthBar extends HealthBar {
    constructor(scene, x, y) {
        super(scene, x, y, 3 * 46, 3 * 12)
    }
}
