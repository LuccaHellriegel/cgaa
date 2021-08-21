export function executor(funcs: Function[]) {
	return () => {
		for (const func of funcs) {
			func();
		}
	};
}
