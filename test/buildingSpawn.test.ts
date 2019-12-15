import { expect } from "chai";
import { updateObj, getAllBuildingRelevantPositions } from "../src/game/enemies/camp/buildingSpawn";
import { buildingSymbol, walkableSymbol } from "../src/game/base/globals/globalSymbols";

describe("Test BuildinSpawnObj", function() {
	describe("updateObj", function() {
		it("All pos around should be buildingSymbol", function() {
			let originalObj = {
				"0 0": walkableSymbol,
				"1 0": walkableSymbol,
				"2 0": walkableSymbol,
				"3 0": walkableSymbol,
				"4 0": walkableSymbol,
				"0 1": walkableSymbol,
				"1 1": walkableSymbol,
				"2 1": walkableSymbol,
				"3 1": walkableSymbol,
				"4 1": walkableSymbol,
				"0 2": walkableSymbol,
				"1 2": walkableSymbol,
				"2 2": walkableSymbol,
				"3 2": walkableSymbol,
				"4 2": walkableSymbol
			};
			let expectedObj = {
				"0 0": buildingSymbol,
				"1 0": buildingSymbol,
				"2 0": buildingSymbol,
				"3 0": buildingSymbol,
				"4 0": buildingSymbol,
				"0 1": buildingSymbol,
				"1 1": buildingSymbol,
				"2 1": buildingSymbol,
				"3 1": buildingSymbol,
				"4 1": buildingSymbol,
				"0 2": buildingSymbol,
				"1 2": buildingSymbol,
				"2 2": buildingSymbol,
				"3 2": buildingSymbol,
				"4 2": buildingSymbol
			};

			updateObj(2, 1, originalObj);
			expect(originalObj).to.deep.equal(expectedObj);
		});
	});
	describe("getAllBuildingRelevantPositions", function() {
		it("Building center at (2,1)", function() {
			let positions = getAllBuildingRelevantPositions(2, 1);
			let expectedPostions = [
				[-1, 0],
				[0, 0],
				[1, 0],
				[2, 0],
				[3, 0],
				[4, 0],
				[5, 0],
				[-1, 1],
				[0, 1],
				[1, 1],
				[2, 1],
				[3, 1],
				[4, 1],
				[5, 1],
				[-1, 2],

				[0, 2],
				[1, 2],
				[2, 2],
				[3, 2],
				[4, 2],
				[5, 2]
			];
			expect(positions).to.deep.equal(expectedPostions);
		});
	});
});
