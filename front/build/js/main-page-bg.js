(function () {
  /*****************************************************************************
   *                                                                            *
   *  SVG Path Rounding Function                                                *
   *  Copyright (C) 2014 Yona Appletree                                         *
   *                                                                            *
   *  Licensed under the Apache License, Version 2.0 (the "License");           *
   *  you may not use this file except in compliance with the License.          *
   *  You may obtain a copy of the License at                                   *
   *                                                                            *
   *      http://www.apache.org/licenses/LICENSE-2.0                            *
   *                                                                            *
   *  Unless required by applicable law or agreed to in writing, software       *
   *  distributed under the License is distributed on an "AS IS" BASIS,         *
   *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
   *  See the License for the specific language governing permissions and       *
   *  limitations under the License.                                            *
   *                                                                            *
   *****************************************************************************/

  /**
   * SVG Path rounding function. Takes an input path string and outputs a path
   * string where all line-line corners have been rounded. Only supports absolute
   * commands at the moment.
   *
   * @param pathString The SVG input path
   * @param radius The amount to round the corners, either a value in the SVG
   *               coordinate space, or, if useFractionalRadius is true, a value
   *               from 0 to 1.
   * @param useFractionalRadius If true, the curve radius is expressed as a
   *               fraction of the distance between the point being curved and
   *               the previous and next points.
   * @returns A new SVG path string with the rounding
   */
  function roundPathCorners(pathString, radius, useFractionalRadius) {
    function moveTowardsLength(movingPoint, targetPoint, amount) {
      var width = targetPoint.x - movingPoint.x;
      var height = targetPoint.y - movingPoint.y;

      var distance = Math.sqrt(width * width + height * height);

      return moveTowardsFractional(
        movingPoint,
        targetPoint,
        Math.min(1, amount / distance)
      );
    }
    function moveTowardsFractional(movingPoint, targetPoint, fraction) {
      return {
        x: movingPoint.x + (targetPoint.x - movingPoint.x) * fraction,
        y: movingPoint.y + (targetPoint.y - movingPoint.y) * fraction,
      };
    }

    // Adjusts the ending position of a command
    function adjustCommand(cmd, newPoint) {
      if (cmd.length > 2) {
        cmd[cmd.length - 2] = newPoint.x;
        cmd[cmd.length - 1] = newPoint.y;
      }
    }

    // Gives an {x, y} object for a command's ending position
    function pointForCommand(cmd) {
      return {
        x: parseFloat(cmd[cmd.length - 2]),
        y: parseFloat(cmd[cmd.length - 1]),
      };
    }

    // Split apart the path, handing concatonated letters and numbers
    var pathParts = pathString.split(/[,\s]/).reduce(function (parts, part) {
      var match = part.match("([a-zA-Z])(.+)");
      if (match) {
        parts.push(match[1]);
        parts.push(match[2]);
      } else {
        parts.push(part);
      }

      return parts;
    }, []);

    // Group the commands with their arguments for easier handling
    var commands = pathParts.reduce(function (commands, part) {
      if (parseFloat(part) == part && commands.length) {
        commands[commands.length - 1].push(part);
      } else {
        commands.push([part]);
      }

      return commands;
    }, []);

    // The resulting commands, also grouped
    var resultCommands = [];

    if (commands.length > 1) {
      var startPoint = pointForCommand(commands[0]);

      // Handle the close path case with a "virtual" closing line
      var virtualCloseLine = null;
      if (commands[commands.length - 1][0] == "Z" && commands[0].length > 2) {
        virtualCloseLine = ["L", startPoint.x, startPoint.y];
        commands[commands.length - 1] = virtualCloseLine;
      }

      // We always use the first command (but it may be mutated)
      resultCommands.push(commands[0]);

      for (var cmdIndex = 1; cmdIndex < commands.length; cmdIndex++) {
        var prevCmd = resultCommands[resultCommands.length - 1];

        var curCmd = commands[cmdIndex];

        // Handle closing case
        var nextCmd =
          curCmd == virtualCloseLine ? commands[1] : commands[cmdIndex + 1];

        // Nasty logic to decide if this path is a candidite.
        if (
          nextCmd &&
          prevCmd &&
          prevCmd.length > 2 &&
          curCmd[0] == "L" &&
          nextCmd.length > 2 &&
          nextCmd[0] == "L"
        ) {
          // Calc the points we're dealing with
          var prevPoint = pointForCommand(prevCmd);
          var curPoint = pointForCommand(curCmd);
          var nextPoint = pointForCommand(nextCmd);

          // The start and end of the cuve are just our point moved towards the previous and next points, respectivly
          var curveStart, curveEnd;

          if (useFractionalRadius) {
            curveStart = moveTowardsFractional(
              curPoint,
              prevCmd.origPoint || prevPoint,
              radius
            );
            curveEnd = moveTowardsFractional(
              curPoint,
              nextCmd.origPoint || nextPoint,
              radius
            );
          } else {
            curveStart = moveTowardsLength(curPoint, prevPoint, radius);
            curveEnd = moveTowardsLength(curPoint, nextPoint, radius);
          }

          // Adjust the current command and add it
          adjustCommand(curCmd, curveStart);
          curCmd.origPoint = curPoint;
          resultCommands.push(curCmd);

          // The curve control points are halfway between the start/end of the curve and
          // the original point
          var startControl = moveTowardsFractional(curveStart, curPoint, 0.5);
          var endControl = moveTowardsFractional(curPoint, curveEnd, 0.5);

          // Create the curve
          var curveCmd = [
            "C",
            startControl.x,
            startControl.y,
            endControl.x,
            endControl.y,
            curveEnd.x,
            curveEnd.y,
          ];
          // Save the original point for fractional calculations
          curveCmd.origPoint = curPoint;
          resultCommands.push(curveCmd);
        } else {
          // Pass through commands that don't qualify
          resultCommands.push(curCmd);
        }
      }

      // Fix up the starting point and restore the close path if the path was orignally closed
      if (virtualCloseLine) {
        var newStartPoint = pointForCommand(
          resultCommands[resultCommands.length - 1]
        );
        resultCommands.push(["Z"]);
        adjustCommand(resultCommands[0], newStartPoint);
      }
    } else {
      resultCommands = commands;
    }

    return resultCommands.reduce(function (str, c) {
      return str + c.join(" ") + " ";
    }, "");
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   */
  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   *
   * @param {number} width
   * @param {number} height
   */
  function Rectangle(width, height) {
    this.width = width;
    this.height = height;
  }

  /**
   *
   * @param {Array<Point>} points
   */
  function encodeSvgPath(points) {
    var pathStr = "";
    if (points.length) {
      var firstPoint = points[0];
      pathStr += "M " + firstPoint.x.toString() + " " + firstPoint.y.toString();
    }
    for (var i = 1; i < points.length; i++) {
      var point = points[i];
      pathStr += " L " + point.x.toString() + " " + point.y.toString();
    }
    return pathStr;
  }

  var TRAPEZOID_CORNER_RADIUS = 40;
  var BREAKPOINT_TABLET = 768;
  var BREAKBOINT_MOBILE = 680;

  /**
   *
   * @param {Rectangle} rectangle
   */
  function getTrapezoidTopLeft(rectangle) {
    if (rectangle.width <= BREAKBOINT_MOBILE) {
      var x = 0;
      var y = 550;
      return new Point(x, y);
    }
    if (rectangle.width <= BREAKPOINT_TABLET) {
      var x = Math.floor(rectangle.width * 0.525); // offset left: 52.5%
      var y = 100;
      return new Point(x, y);
    }

    var x = Math.floor(rectangle.width * 0.525); // offset left: 52.5%
    var y = 0;
    return new Point(x, y);
  }

  /**
   *
   * @param {Rectangle} rectangle
   */
  function getTrapezoidTopRight(rectangle) {
    if (rectangle.width <= BREAKBOINT_MOBILE) {
      var x = rectangle.width;
      var y = 550;
      return new Point(x, y);
    }
    if (rectangle.width <= BREAKPOINT_TABLET) {
      var x = rectangle.width;
      var y = 100;
      return new Point(x, y);
    }

    var x = rectangle.width;
    var y = 0;
    return new Point(x, y);
  }

  /**
   *
   * @param {Rectangle} rectangle
   */
  function getTrapezoidBottomRight(rectangle) {
    var x = rectangle.width;
    var y = rectangle.height;
    return new Point(x, y);
  }

  /**
   *
   * @param {Rectangle} rectangle
   */
  function getTrapezoidBottomLeft(rectangle) {
    if (rectangle.width <= BREAKBOINT_MOBILE) {
      var x = 0;
      var y = rectangle.height;
      return new Point(x, y);
    }
    var x = Math.floor(rectangle.width * 0.425); // offset left: 42.5%
    var y = rectangle.height;
    return new Point(x, y);
  }

  /**
   *
   * @param {HTMLDivElement} bgNode
   */
  function rebuildTrapezoid(bgNode) {
    var clientWidth = bgNode.clientWidth;
    var clientHeight = bgNode.clientHeight;
    if (!clientWidth || !clientHeight) {
      bgNode.style.removeProperty("clip-path");
      return;
    }

    var canvasRectangle = new Rectangle(clientWidth, clientHeight);

    var topLeft = getTrapezoidTopLeft(canvasRectangle);
    var topRight = getTrapezoidTopRight(canvasRectangle);
    var bottomRight = getTrapezoidBottomRight(canvasRectangle);
    var bottomLeft = getTrapezoidBottomLeft(canvasRectangle);

    var trapezoidPath;
    if (canvasRectangle.width <= BREAKBOINT_MOBILE) {
      var topRightCornerPath = encodeSvgPath([topLeft, topRight, bottomRight]);

      var roundedTopRightCorner = roundPathCorners(
        topRightCornerPath,
        TRAPEZOID_CORNER_RADIUS
      );

      trapezoidPath =
        roundedTopRightCorner +
        " L " +
        bottomLeft.x.toString() +
        " " +
        bottomLeft.y.toString() +
        " Z";
    } else {
      var topRightCornerPath = encodeSvgPath([bottomLeft, topLeft, topRight]);

      var roundedTopRightCorner = roundPathCorners(
        topRightCornerPath,
        TRAPEZOID_CORNER_RADIUS
      );

      trapezoidPath =
        roundedTopRightCorner +
        " L " +
        bottomRight.x.toString() +
        " " +
        bottomRight.y.toString() +
        " Z";
    }

    bgNode.style.setProperty("clip-path", 'path("' + trapezoidPath + '")');
  }

  /**
   *
   * @param {HTMLElement} footer
   * @param {HTMLElement} footerBg
   */
  function syncHeight(footer, footerBg) {
    var clientHeight = footer.clientHeight;
    if (!clientHeight) {
      footerBg.style.removeProperty("height");
      return;
    }
    footerBg.style.setProperty("height", clientHeight.toString() + "px");
  }

  function onReady(cb) {
    if (document.readyState === "loading") {
      var handleReady = () => {
        document.removeEventListener("DOMContentLoaded", handleReady);
        cb();
      };
      document.addEventListener("DOMContentLoaded", handleReady);
    } else {
      setTimeout(cb, 0);
    }
  }

  onReady(function () {
    var croppedLayout = document.querySelector(".main-page-background__crop");
    if (croppedLayout === null) {
      return;
    }

    var footer = document.querySelector(".footer");
    var bgFooterTop = document.querySelector(
      ".main-page-background__footer--top"
    );
    var bgFooterBottom = document.querySelector(
      ".main-page-background__footer--bottom"
    );
    if (footer === null || bgFooterBottom === null || bgFooterTop === null) {
      return;
    }

    var prevFooterHeight = -1;
    var ro = new ResizeObserver(function () {
      if (prevFooterHeight !== footer.clientHeight) {
        syncHeight(footer, bgFooterTop);
        syncHeight(footer, bgFooterBottom);
        prevFooterHeight = footer.clientHeight;
      }
      rebuildTrapezoid(croppedLayout);
    });
    ro.observe(croppedLayout);

    croppedLayout.style.removeProperty("display");
    syncHeight(footer, bgFooterTop);
    syncHeight(footer, bgFooterBottom);
    rebuildTrapezoid(croppedLayout);
  });
})();
