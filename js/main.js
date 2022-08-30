"use strict";

let placesDB = [];
async function load(name) {
	try {
		const responce = await fetch(name, {
			headers: {
				"Content-Type": "text/plain",
			},
		});

		return responce.text();
	} catch (err) {
		alert("Failed to open file!");
		console.log(err);
		return null;
	}
}

function getPlaceLvl(code2, code3, code4) {
	if (code4 !== "000") {
		return 3; //? Населённый пункт
	} else if (code3 !== "000") {
		return 2; //? Сельсовет
	} else if (code2 !== "000") {
		return 1; //? Район(Округ)
	} else {
		return 0; //? Регион
	}
}

//*Example line of txt: "01";"512";"000";"101";"8";"2";"с Залесово";;;"493";"3";12.08.2021;01.01.2022
function buildArrayOfPlacesByReg(placesText) {
	const regEx = /(\d+)";"(\d+)";"(\d+)";"(\d+)".+?;"([А-Яа-я].*?)";/g;

	let placeSplited = regEx.exec(placesText);
	do {
		const code2 = placeSplited[2];
		const code3 = placeSplited[3];
		const code4 = placeSplited[4];
		const lvl = getPlaceLvl(code2, code3, code4);
		placesDB.push({
			lvl: lvl,
			code1: placeSplited[1],
			code2: code2,
			code3: code3,
			code4: code4,
			name: placeSplited[5],
		});
		placeSplited = regEx.exec(placeSplited.input);
	} while (placeSplited !== null);
	console.log("placesDB length:" + placesDB.length);
}

function buildArrayOfPlacesBySplit(placesText) {
	const placesArray = placesText.split("\n");

	for (const iterator of placesArray) {
		const placeSplited = iterator
			.slice(1, iterator.lastIndexOf('";;;'))
			.split(/";"/);

		const code2 = placeSplited[1];
		const code3 = placeSplited[2];
		const code4 = placeSplited[3];
		const lvl = getPlaceLvl(code2, code3, code4);
		placesDB.push({
			lvl: lvl,
			code1: placeSplited[0],
			code2: code2,
			code3: code3,
			code4: code4,
			name: placeSplited[6],
		});
	}
	console.log("placesDB length:" + placesDB.length);
}

function createRow(place, table) {
	const row = document.createElement("tr");
	row.setAttribute("level", place.lvl);
	let cell = document.createElement("td");

	cell.innerText = place.code1;
	row.appendChild(cell);

	cell = document.createElement("td");
	cell.innerText = place.code2;
	row.appendChild(cell);

	cell = document.createElement("td");
	cell.innerText = place.code3;
	row.appendChild(cell);

	cell = document.createElement("td");
	cell.innerText = place.code4;
	row.appendChild(cell);

	cell = document.createElement("td");
	cell.innerText = place.name;
	row.appendChild(cell);

	table.appendChild(row);
}

function fillTable(table) {
	for (const place of placesDB) {
		if (place.code4 !== "000") continue;
		createRow(place, table);
	}
}

window.onload = async () => {
	const nameFile = "/small.csv";
	let table = document.getElementById("leftTable");
	const templateTable = table.cloneNode(true);

	const placesTextResponce = await load(nameFile);

	buildArrayOfPlacesByReg(placesTextResponce);

	fillTable(table);

	document
		.getElementById("selectSeporator")
		.addEventListener("change", (event) => {
			const option = event.target.value;
			placesDB = [];
			table.replaceWith(templateTable);
			table = document.getElementById("leftTable");

			let timeBegin = Date.now();
			if (option === "RegEx") {
				buildArrayOfPlacesByReg(placesTextResponce);
			} else {
				buildArrayOfPlacesBySplit(placesTextResponce);
			}
			console.log("Время выполнения: " + (Date.now() - timeBegin));
			console.log("Select Option:" + option);
			fillTable(table);
		});

	document
		.getElementsByTagName(input)[0]
		.addEventListener("input", (event) => {});
};
