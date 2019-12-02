// import { expect } from "chai";
// import {
//   wallPartHalfSize,
//   rectBuildingHalfWidth,
//   rectBuildinghalfHeight
// } from "../src/globals/globalSizes";
// import { BuildingService } from "../src/env/buildings/BuildingService";

// describe("Test BuildingService", function() {
 

//   describe("Check if new building is on top of old ones or their spawn areas", function() {
//     it("New building is in the same place as old one, so yes ", function() {
//       let buildings = [{ x: rectBuildingHalfWidth, y: rectBuildinghalfHeight }];
//       let randX = rectBuildingHalfWidth;
//       let randY = rectBuildinghalfHeight;
//       let isOnTop = BuildingService.checkIfOnTopOfOtherBuildingOrSpawnArea(
//         buildings,
//         randX,
//         randY
//       );
//       expect(isOnTop).to.be.true;
//     });
//     it("New building is in the same place as second one, so yes ", function() {
//       let buildings = [
//         { x: 4 * rectBuildingHalfWidth, y: 4 * rectBuildinghalfHeight },
//         { x: rectBuildingHalfWidth, y: rectBuildinghalfHeight }
//       ];
//       let randX = rectBuildingHalfWidth;
//       let randY = rectBuildinghalfHeight;
//       let isOnTop = BuildingService.checkIfOnTopOfOtherBuildingOrSpawnArea(
//         buildings,
//         randX,
//         randY
//       );
//       expect(isOnTop).to.be.true;
//     });
//     it("New building is overlapping on the right, so yes ", function() {
//       let buildings = [{ x: rectBuildingHalfWidth, y: rectBuildinghalfHeight }];
//       let randX = 2 * rectBuildingHalfWidth;
//       let randY = rectBuildinghalfHeight;
//       let isOnTop = BuildingService.checkIfOnTopOfOtherBuildingOrSpawnArea(
//         buildings,
//         randX,
//         randY
//       );
//       expect(isOnTop).to.be.true;
//     });
//     it("New building is overlapping spawn area on the right, so yes ", function() {
//       let buildings = [{ x: rectBuildingHalfWidth, y: rectBuildinghalfHeight }];
//       let randX = 3 * rectBuildingHalfWidth + wallPartHalfSize;
//       let randY = rectBuildinghalfHeight;
//       let isOnTop = BuildingService.checkIfOnTopOfOtherBuildingOrSpawnArea(
//         buildings,
//         randX,
//         randY
//       );
//       expect(isOnTop).to.be.true;
//     });
//     it("New building is overlapping on the bottom, so yes ", function() {
//       let buildings = [{ x: rectBuildingHalfWidth, y: rectBuildinghalfHeight }];
//       let randX = rectBuildingHalfWidth;
//       let randY = 2 * rectBuildinghalfHeight;
//       let isOnTop = BuildingService.checkIfOnTopOfOtherBuildingOrSpawnArea(
//         buildings,
//         randX,
//         randY
//       );
//       expect(isOnTop).to.be.true;
//     });
//     it("New building is overlapping spawn area on the bottom, so yes ", function() {
//       let buildings = [{ x: rectBuildingHalfWidth, y: rectBuildinghalfHeight }];
//       let randX = rectBuildingHalfWidth;
//       let randY = 3 * rectBuildinghalfHeight + wallPartHalfSize;
//       let isOnTop = BuildingService.checkIfOnTopOfOtherBuildingOrSpawnArea(
//         buildings,
//         randX,
//         randY
//       );
//       expect(isOnTop).to.be.true;
//     });
//     it("New building is exactly far enough away to the right, so no ", function() {
//       let buildings = [{ x: rectBuildingHalfWidth, y: rectBuildinghalfHeight }];
//       let randX = 3 * rectBuildingHalfWidth + 2 * wallPartHalfSize;
//       let randY = rectBuildinghalfHeight;
//       let isOnTop = BuildingService.checkIfOnTopOfOtherBuildingOrSpawnArea(
//         buildings,
//         randX,
//         randY
//       );
//       expect(isOnTop).to.be.false;
//     });
//     it("New building is more than far enough away to the right, so no ", function() {
//       let buildings = [{ x: rectBuildingHalfWidth, y: rectBuildinghalfHeight }];
//       let randX = 3 * rectBuildingHalfWidth + 4 * wallPartHalfSize;
//       let randY = rectBuildinghalfHeight;
//       let isOnTop = BuildingService.checkIfOnTopOfOtherBuildingOrSpawnArea(
//         buildings,
//         randX,
//         randY
//       );
//       expect(isOnTop).to.be.false;
//     });
//     it("New building is exactly far enough away to the bottom, so no ", function() {
//       let buildings = [{ x: rectBuildingHalfWidth, y: rectBuildinghalfHeight }];
//       let randX = rectBuildingHalfWidth;
//       let randY = 3 * rectBuildinghalfHeight + 2 * wallPartHalfSize;
//       let isOnTop = BuildingService.checkIfOnTopOfOtherBuildingOrSpawnArea(
//         buildings,
//         randX,
//         randY
//       );

//       expect(isOnTop).to.be.false;
//     });
//   });
// });
