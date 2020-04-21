import { expect } from "chai";
import { initPreUpdate } from "../../../src/api/pre";

describe("Test pre", function () {
	describe("", function () {
		it("Resulting preUpdate should execute in order", () => {
			let result = "";

			let pre1 = {
				pre: function () {
					result += "1";
				},
			};
			let pre2 = {
				pre: function () {
					result += "2";
				},
			};

			let preEx = {
				preUpdate: function () {
					result += "preUpdate!";
				},
				pre1,
				pre2,
				preUpdateList: [pre1, pre2],
			};

			initPreUpdate(preEx);
			preEx.preUpdate();

			expect(result).to.equal("preUpdate!12");
		});
	});
});
