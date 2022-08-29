"use strict";

let placesDB = [];
let placesTextResponce;
async function load(name) {
	try {
		const responce = await fetch(name, {
			headers: {
				"Content-Type": "text/plain",
			},
		});

		return await responce.text();
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
		return 2; //? Район
	} else if (code2 !== "000") {
		return 1;
	} else {
		return 0;
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
			.slice(1, iterator.lastIndexOf(";;;"))
			.split(/";"/);

		const code2 = placeSplited[2];
		const code3 = placeSplited[3];
		const code4 = placeSplited[4];
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
		createRow(place, table);
	}
}

window.onload = async () => {
	const nameFile = "/small.csv";
	const table = document.getElementById("leftTable");
	placesTextResponce = await load(nameFile);

	let timeBegin = Date.now();
	buildArrayOfPlacesByReg(placesTextResponce);
	console.log("Время выполнения: " + (Date.now() - timeBegin));

	fillTable(table);
};

document.getElementsByTagName("select").onclick = function (event) {
	const option = event.option.value;
	if (option === "RegEx") {
		alert("re");
	}
};
