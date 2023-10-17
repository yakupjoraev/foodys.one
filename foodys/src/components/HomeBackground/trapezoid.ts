import { SVGCommand, roundCommands } from "svg-round-corners";

const TRAPEZOID_CORNER_RADIUS = 40;
const BREAKPOINT_TABLET = 768;
const BREAKPOINT_MOBILE = 680;

class Point {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Rectangle {
  public width: number;
  public height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

function getTrapezoidTopLeft(rectangle: Rectangle) {
  if (rectangle.width <= BREAKPOINT_MOBILE) {
    const x = 0;
    const y = 425;
    return new Point(x, y);
  }
  if (rectangle.width <= BREAKPOINT_TABLET) {
    const x = Math.floor(rectangle.width * 0.525); // offset left: 52.5%
    const y = 100;
    return new Point(x, y);
  }

  const x = Math.floor(rectangle.width * 0.525); // offset left: 52.5%
  const y = 0;
  return new Point(x, y);
}

function getTrapezoidTopRight(rectangle: Rectangle) {
  if (rectangle.width <= BREAKPOINT_MOBILE) {
    const x = rectangle.width;
    const y = 425;
    return new Point(x, y);
  }
  if (rectangle.width <= BREAKPOINT_TABLET) {
    const x = rectangle.width;
    const y = 100;
    return new Point(x, y);
  }

  const x = rectangle.width;
  const y = 0;
  return new Point(x, y);
}

function getTrapezoidBottomRight(rectangle: Rectangle) {
  const x = rectangle.width;
  const y = rectangle.height;
  return new Point(x, y);
}

function getTrapezoidBottomLeft(rectangle: Rectangle) {
  if (rectangle.width <= BREAKPOINT_MOBILE) {
    const x = 0;
    const y = rectangle.height;
    return new Point(x, y);
  }
  const x = Math.floor(rectangle.width * 0.425); // offset left: 42.5%
  const y = rectangle.height;
  return new Point(x, y);
}

export function rebuildTrapezoid(canvasRectangle: Rectangle): string | null {
  if (!canvasRectangle.width || !canvasRectangle.height) {
    return null;
  }

  const topLeft = getTrapezoidTopLeft(canvasRectangle);
  const topRight = getTrapezoidTopRight(canvasRectangle);
  const bottomRight = getTrapezoidBottomRight(canvasRectangle);
  const bottomLeft = getTrapezoidBottomLeft(canvasRectangle);

  let trapezoidPath;
  if (canvasRectangle.width <= BREAKPOINT_MOBILE) {
    const topRightCornerCommands: [SVGCommand, SVGCommand, SVGCommand] = [
      { marker: "M", values: { x: topLeft.x, y: topLeft.y } },
      { marker: "L", values: { x: topRight.x, y: topRight.y } },
      { marker: "L", values: { x: bottomRight.x, y: bottomRight.y } },
    ];

    const roundedTopRightCorner = roundCommands(
      topRightCornerCommands,
      TRAPEZOID_CORNER_RADIUS
    );

    trapezoidPath =
      roundedTopRightCorner.path +
      "L" +
      bottomLeft.x.toString() +
      "," +
      bottomLeft.y.toString() +
      "Z";
  } else {
    const topRightCornerCommands: [SVGCommand, SVGCommand, SVGCommand] = [
      { marker: "M", values: { x: bottomLeft.x, y: bottomLeft.y } },
      { marker: "L", values: { x: topLeft.x, y: topLeft.y } },
      { marker: "L", values: { x: topRight.x, y: topRight.y } },
    ];

    const roundedTopRightCorner = roundCommands(
      topRightCornerCommands,
      TRAPEZOID_CORNER_RADIUS
    );

    trapezoidPath =
      roundedTopRightCorner.path +
      "L" +
      bottomRight.x.toString() +
      "," +
      bottomRight.y.toString() +
      "Z";
  }

  return trapezoidPath;
}
