export interface IMode {
	execute(element);
	enable();
	disable();
}

export interface IModes {
	activeMode: IMode;
	modes: IMode[];
	modesLength: number;
	index: number;
}
