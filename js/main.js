"use strict";
async function load(name) {
	const responce = await fetch("/small.csv");

	if (!responce.ok) {
		alert(responce.status);
		return;
	}

	//!
	let temp = document.createElement("div");
	temp.innerText = await responce.text();
	document.body.appendChild(temp);
}

window.onload = () => {
	load();
};

//TODO: make array considering object "Place" and add new option Lvl
//? Use regEx.exec(). This method found 1st math and stop,
//? and next call will show next match in String. Otherwise return null
//*Example: "01";"512";"000";"101";"8";"2";"с Залесово";;;"493";"3";12.08.2021;01.01.2022
function buildArrayOfPlaces() {
	let regEx =
		/(\d+)";"(\d+)";"(\d+)";"(\d+)".+?;"([а-я]*)\s?([А-Яа-я].*?)";/g;
}
