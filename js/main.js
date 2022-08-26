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

//*Example line of string: "01";"512";"000";"101";"8";"2";"с Залесово";;;"493";"3";12.08.2021;01.01.2022
function buildArrayOfPlacesByReg(placesText) {
	const regEx = /(\d+)";"(\d+)";"(\d+)";"(\d+)".+?;"([А-Яа-я].*?)";/g;

	let placeSplited = regEx.exec(placesText);
	console.log(placeSplited);
	do {
		placesDB.push({
			code1: Number(placeSplited[1]),
			code2: Number(placeSplited[2]),
			code3: Number(placeSplited[3]),
			code4: Number(placeSplited[4]),
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

		placesDB.push({
			code1: Number(placeSplited[0]),
			code2: Number(placeSplited[1]),
			code3: Number(placeSplited[2]),
			code4: Number(placeSplited[3]),
			name: placeSplited[6],
		});
	}
	console.log("placesDB length:" + placesDB.length);
}

window.onload = async () => {
	const nameFile = "/small.csv";
	placesTextResponce = await load(nameFile);

	let timeBegin = Date.now();
	buildArrayOfPlacesByReg(placesTextResponce);
	console.log(Date.now() - timeBegin);
};
