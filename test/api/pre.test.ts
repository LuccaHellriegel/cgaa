import { expect } from "chai";
import { initPreUpdate, preChild } from "../../src/api/preUpdate";

describe("Test preUpdate API", function () {
	describe("", function () {
		it("Resulting preUpdate should execute in order", () => {
			let result = "";

			let pre1: preChild = {
				childPreUpdate: function addOne() {
					result += "1";
				},
			};
			let pre2: preChild = {
				childPreUpdate: function addTwo() {
					result += "2";
				},
			};

			let preEx = {
				parentPreUpdate: function () {
					result += "preUpdate!";
				},
				parentPreUpdateBefore: true,
				preUpdate: function () {},
				pre1,
				pre2,
				preUpdateList: ["pre1", "pre2"],
			};

			initPreUpdate(preEx);
			preEx.preUpdate();

			expect(result).to.equal("preUpdate!12");
		});
		it("Should throw because of wrong configuration", () => {
			let result = "";

			let pre1 = {};
			let pre2: preChild = {
				childPreUpdate: function addTwo() {
					result += "2";
				},
			};

			let preEx = {
				parentPreUpdate: function () {
					result += "preUpdate!";
				},
				parentPreUpdateBefore: true,
				preUpdate: function () {},
				pre1,
				pre2,
				preUpdateList: ["pre1", "pre2"],
			};

			expect(() => {
				initPreUpdate(preEx);
			}).to.throw();
		});
	});
});
