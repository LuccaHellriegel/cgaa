export class ArrowHeadPolygon {
  static points(x, y, width, height) {
    x = x - width / 2;
    y = y - height / 2;

    let ceilThirdWidth = Math.ceil(width / 3);
    let arrowLegLength = ceilThirdWidth;
    let emptySpaceBetweenLegs = width - 2 * ceilThirdWidth;

    let bottomLeft = { x: x, y: y + height };
    let bottomLeftMiddle = { x: x + arrowLegLength, y: y + height };

    let bottomTop = {
      x: x + arrowLegLength + emptySpaceBetweenLegs / 2,
      y: y + height - Math.floor(height / 3),
    };

    let bottomRightMiddle = {
      x: x + arrowLegLength + emptySpaceBetweenLegs,
      y: y + height,
    };
    let bottomRight = {
      x: x + arrowLegLength + emptySpaceBetweenLegs + arrowLegLength,
      y: y + height,
    };

    let top = { x: x + width / 2, y: y };

    return [
      bottomLeft,
      bottomLeftMiddle,
      bottomTop,
      bottomRightMiddle,
      bottomRight,
      top,
    ];
  }
}
