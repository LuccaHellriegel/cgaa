export class Util {
	private constructor() {}

	static removeEle(ele, arr: any[]) {
		let index = arr.indexOf(ele);
		if (index > -1) {
			arr.splice(index, 1);
		} else {
			throw ele + " not found in arr " + arr;
		}
	}
}
