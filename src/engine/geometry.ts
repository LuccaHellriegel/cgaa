export function movePointsPhaser(points: Phaser.GameObjects.Image[], diffX: number, diffY: number) {
	for (let point of points) point.setPosition(point.x + diffX, point.y + diffY);
}

export function movePointPhaser(point: Phaser.GameObjects.Image, diffX: number, diffY: number) {
	point.setPosition(point.x + diffX, point.y + diffY);
}

export function rotatePointsPhaser(points: Phaser.GameObjects.Image[], rotation, x, y) {
	for (let point of points) Phaser.Math.RotateAround(point, x, y, rotation);
}
