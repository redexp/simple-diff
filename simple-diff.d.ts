declare function diff(oldObj: any, newObj: any, ops?: DiffOptions): DiffEvent[];

export default diff;

export interface DiffOptions extends Partial<PathChange> {
	idProp?: string,
	idProps?: {[path: string]: string},
	addEvent?: string,
	removeEvent?: string,
	changeEvent?: string,
	addItemEvent?: string,
	removeItemEvent?: string,
	moveItemEvent?: string,
	callback?: (event: DiffEvent) => void,
	comparators?: Array<[any, Comparator]>,
	ignore?: Comparator,
}

export type Path = Array<string | number>;

export interface PathChange {
	oldPath: Path,
	newPath: Path,
}

export type Comparator = (oldValue: any, newValue: any, options: PathChange) => boolean;

export interface DiffEvent extends PathChange {
	type: 'add' | 'remove' | 'change' | 'add-item' | 'remove-item' | 'move-item',
	oldValue: any,
	newValue: any,
	oldIndex?: number,
	curIndex?: number,
	newIndex?: number,
}