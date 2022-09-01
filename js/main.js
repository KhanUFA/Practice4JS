"use strict";

let placesDB = [];
let countryDB = [];
let arrayOfRegionAndDistricts = [];
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
		const place = {
			lvl: lvl,
			code1: placeSplited[1],
			code2: code2,
			code3: code3,
			code4: code4,
			name: placeSplited[5],
		};
		placesDB.push(place);

		if (lvl === 3) {
			countryDB.push(place);
		}

		if (lvl === 0 || lvl === 1) {
			arrayOfRegionAndDistricts.push(place);
		}

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
		const place = {
			lvl: lvl,
			code1: placeSplited[1],
			code2: code2,
			code3: code3,
			code4: code4,
			name: placeSplited[5],
		};
		placesDB.push(place);

		if (lvl === 3) {
			countryDB.push(place);
		}

		if (lvl === 0 || lvl === 1) {
			arrayOfRegionAndDistricts.push(place);
		}
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

window.onload = async () => {
	const nameFile = "/oktmo.csv";
	let leftTable = document.getElementById("leftTable");
	const templateTable = document.querySelector("#rightTable").cloneNode(true);
	templateTable.id = "";

	countryDB.sort((a, b) => {});

	const placesTextResponce = await load(nameFile);
	buildArrayOfPlacesByReg(placesTextResponce);

	const arrayOfRegionAndDistricts = placesDB.filter(
		(value) => value.lvl === 0 || value.lvl === 1
	);
	fillTable(leftTable, arrayOfRegionAndDistricts);

	function fillTable(table, array) {
		const newTable = templateTable.cloneNode(true);
		newTable.id = table.id;
		table.replaceWith(newTable);

		for (const place of array) {
			createRow(place, newTable);
		}
	}

	function searchRegion(event) {
		let table = document.getElementById("leftTable");
		const inspectedName = this.value.toUpperCase();
		if (inspectedName.length < 3) {
			const lengthTable =
				document.querySelectorAll("#leftTable > tr").length;
			console.log("Length table: ", lengthTable);

			if (lengthTable < arrayOfRegionAndDistricts.length) {
				fillTable(table, arrayOfRegionAndDistricts);
			}
			return;
		}

		const findedPlace = arrayOfRegionAndDistricts.filter((value) =>
			value.name.toUpperCase().includes(inspectedName)
		);
		// debugger;

		if (findedPlace) {
			let responceArray = [];
			let region;
			for (const place of findedPlace) {
				if (place.lvl !== 0) {
					region = arrayOfRegionAndDistricts.find(
						(value) =>
							value.lvl === 0 && value.code1 === place.code1
					);
					responceArray.push(region);
					responceArray.push(place);
				} else {
					responceArray.push(place);
				}
			}
			const uniqueArray = [...new Set(responceArray)];
			fillTable(table, uniqueArray);
		} else {
			fillTable(table, []);
		}
	}

	function searchCountry(event) {
		const inspectedName = this.value;
		let rightTable = document.getElementById("rightTable");

		if (inspectedName.length > 2) {
		}
	}

	const inputsOnNav = document.getElementsByTagName("input");
	inputsOnNav[0].addEventListener("input", searchRegion);
	inputsOnNav[1].addEventListener("input", searchCountry);

	document
		.getElementById("selectSeporator")
		.addEventListener("change", (event) => {
			const option = event.target.value;
			placesDB = [];

			let timeBegin = Date.now();

			if (option === "RegEx") {
				buildArrayOfPlacesByReg(placesTextResponce);
			} else {
				buildArrayOfPlacesBySplit(placesTextResponce);
			}

			console.log("Время выполнения: " + (Date.now() - timeBegin));
			console.log("Select option:" + option);

			fillTable(leftTable, arrayOfRegionAndDistricts);
		});
};
