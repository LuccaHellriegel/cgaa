test.todo("some test to be written in the future");

// import { posAround2DPosition } from "./navigation";

// describe("Test navigation helpers", function () {
// 	describe("", function () {
// 		it("", () => {
// 			let result = posAround2DPosition(0, 0, [0, 1]);
// 			expect(result[0]).to.deep.equal({ row: 0, column: 1 });

// 			result = posAround2DPosition(0, 0, [0, 1, 1]);
// 			expect(result).to.deep.equal([
// 				{ row: 0, column: 1 },
// 				{ row: 0, column: 2 },
// 			]);

// 			result = posAround2DPosition(0, 0, [1, 0, 1, 1]);
// 			expect(result).to.deep.equal([
// 				{ row: 0, column: -1 },
// 				{ row: 0, column: 1 },
// 				{ row: 0, column: 2 },
// 			]);

// 			result = posAround2DPosition(0, 0, [[1, 0, 1, 1]]);
// 			expect(result).to.deep.equal([
// 				{ row: 0, column: -1 },
// 				{ row: 0, column: 1 },
// 				{ row: 0, column: 2 },
// 			]);

// 			result = posAround2DPosition(0, 0, [
// 				[1, 0, 1, 1],
// 				[1, 2, 1, 1],
// 			]);
// 			expect(result).to.deep.equal([
// 				{ row: 0, column: -1 },
// 				{ row: 0, column: 1 },
// 				{ row: 0, column: 2 },
// 				{ row: 1, column: -1 },
// 				{ row: 1, column: 1 },
// 				{ row: 1, column: 2 },
// 			]);

// 			result = posAround2DPosition(0, 0, [
// 				[1, 0, 1, 1],
// 				[1, 1, 1, 1],
// 			]);
// 			expect(result).to.deep.equal([
// 				{ row: 0, column: -1 },
// 				{ row: 0, column: 1 },
// 				{ row: 0, column: 2 },
// 				{ row: 1, column: -1 },
// 				{ row: 1, column: 0 },
// 				{ row: 1, column: 1 },
// 				{ row: 1, column: 2 },
// 			]);

// 			result = posAround2DPosition(0, 0, [
// 				[1, 1, 1, 1],
// 				[1, 0, 1, 1],
// 			]);
// 			expect(result).to.deep.equal([
// 				{ row: -1, column: -1 },
// 				{ row: -1, column: 0 },
// 				{ row: -1, column: 1 },
// 				{ row: -1, column: 2 },
// 				{ row: 0, column: -1 },
// 				{ row: 0, column: 1 },
// 				{ row: 0, column: 2 },
// 			]);

// 			result = posAround2DPosition(0, 0, [
// 				[1, 1, 1, 1],
// 				[1, 0, 1, 1],
// 				[1, 1, 1, 1],
// 			]);
// 			expect(result).to.deep.equal([
// 				{ row: -1, column: -1 },
// 				{ row: -1, column: 0 },
// 				{ row: -1, column: 1 },
// 				{ row: -1, column: 2 },
// 				{ row: 0, column: -1 },
// 				{ row: 0, column: 1 },
// 				{ row: 0, column: 2 },
// 				{ row: 1, column: -1 },
// 				{ row: 1, column: 0 },
// 				{ row: 1, column: 1 },
// 				{ row: 1, column: 2 },
// 			]);

// 			result = posAround2DPosition(45, 54, [
// 				[1, 1, 1, 1],
// 				[1, 0, 1, 1],
// 				[1, 1, 1, 1],
// 			]);
// 			expect(result).to.deep.equal([
// 				{ row: 45 - 1, column: 54 - 1 },
// 				{ row: 45 - 1, column: 54 },
// 				{ row: 45 - 1, column: 54 + 1 },
// 				{ row: 45 - 1, column: 54 + 2 },
// 				{ row: 45, column: 54 - 1 },
// 				{ row: 45, column: 54 + 1 },
// 				{ row: 45, column: 54 + 2 },
// 				{ row: 45 + 1, column: 54 - 1 },
// 				{ row: 45 + 1, column: 54 + 0 },
// 				{ row: 45 + 1, column: 54 + 1 },
// 				{ row: 45 + 1, column: 54 + 2 },
// 			]);

// 			result = posAround2DPosition(45, 54, [
// 				[1, 1, 1, 1, 1],
// 				[1, 2, 0, 2, 1],
// 				[1, 1, 1, 1, 1],
// 			]);
// 			expect(result).to.deep.equal([
// 				{ row: 45 - 1, column: 54 - 2 },
// 				{ row: 45 - 1, column: 54 - 1 },
// 				{ row: 45 - 1, column: 54 },
// 				{ row: 45 - 1, column: 54 + 1 },
// 				{ row: 45 - 1, column: 54 + 2 },
// 				{ row: 45, column: 54 - 2 },
// 				{ row: 45, column: 54 + 2 },
// 				{ row: 45 + 1, column: 54 - 2 },
// 				{ row: 45 + 1, column: 54 - 1 },
// 				{ row: 45 + 1, column: 54 + 0 },
// 				{ row: 45 + 1, column: 54 + 1 },
// 				{ row: 45 + 1, column: 54 + 2 },
// 			]);
// 		});
// 	});
// });
