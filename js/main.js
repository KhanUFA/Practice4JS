"use strict";

let placesDB = [];
function load(name) {
	fetch("/small.csv")
		.then((responce) => {
			if (!responce.ok) {
				throw new Error("Something get wrong! " + responce.status);
			}
			return responce.text();
		})
		.then((placesText) => {
			buildArrayOfPlacesByReg(placesText);
		})
		.catch((err) => console.log(new Error(err)));

	//!
	let temp = document.createElement("div");
	temp.innerText = textPlaces;
	document.body.appendChild(temp);
}

window.onload = () => {
	load();
};

//TODO: make array considering object "Place" and add new option Lvl
//? Use regEx.exec(). This method found 1st math and stop,
//? and next call will show next match in String. Otherwise return null
//*Example line of string: "01";"512";"000";"101";"8";"2";"с Залесово";;;"493";"3";12.08.2021;01.01.2022
function buildArrayOfPlacesByReg(placesText) {
	const regEx =
		/(\d+)";"(\d+)";"(\d+)";"(\d+)".+?;"([а-я]*)\s?([А-Яа-я].*?)";/g;
	const placesArray = placesText.split("\n");
	Console.log(placesArray[0]);

	for (const iterator of placesList) {
		const placeArray = iterator.split(regEx);
		Console.log(placeArray[6]);
		placesDB.push({ name: placeArray[6] });
	}
}
