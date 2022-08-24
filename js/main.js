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
