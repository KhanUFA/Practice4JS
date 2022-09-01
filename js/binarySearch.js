export function binarySearch(value, list) {
	let first = 0; //left endpoint
	let last = list.length - 1; //right endpoint
	let position = -1;
	let found = false;
	let middle;

	while (found === false && first <= last) {
		middle = Math.floor((first + last) / 2);

		const nameInList = list[middle].name.toUpperCase().replace('"', "");
		const inspected = value.toUpperCase().replace('"', "");

		if (nameInList.includes(inspected)) {
			found = true;
			position = middle;
		} else if (nameInList.localeCompare(inspected) < -1) {
			//if in lower half
			last = middle - 1;
		} else {
			//in in upper half
			first = middle + 1;
		}
	}
	return position;
}
