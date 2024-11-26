let nbFLOPS = 0;
let nbClicks = 0;
let clickValue = 1;
let fallingObjects = [];
let upgrades = {};
let components = {};
let divScore;
let divNbFLOPS;
let divFallingGPUS;
let divFlopsPerSec;
let clicker;
let divRack;
let divUpgrades;
function Component(name, value, price) {
	this.name = name;
	this.nb = 0;
	this.value = value;
	this.currentPrice = price;
	this.multiplier = 1;
	this.is_dislay = false;
	this.button = document.getElementById(`${name}B`);
	this.flopParSecComp = function() {
		return this.nb * this.value * this.multiplier;
	};
	this.newPrice = function (nb = 1, selling = false) {
		this.currentPrice = this.price(nb, selling);
	};
	this.price = function (nb = 1, selling = false) {
		if (!selling) {
			return Math.floor(this.currentPrice * Math.pow(1.15, nb));
		} else {
			return Math.floor(this.currentPrice * Math.pow(0.7, nb));
		}
	}
	this.createButton = function () {
		img = document.createElement("img");
		img.src = `assets/${this.name}.png`;
		img.classList.add("buyBImg")
		divImg = document.createElement("div");
		divImg.classList.add("buyBImgZone")
		divImg.appendChild(img);
		name = document.createElement("div");
		name.classList.add("buyBName");
		name.textContent = this.name;
		price = document.createElement("div");
		price.classList.add("buyBPrice");
		price.textContent = this.currentPrice;
		nb = document.createElement("div");
		nb.classList.add("buyBNb");
		nb.textContent = this.nb;
		this.button.appendChild(divImg);
		this.button.appendChild(name);
		this.button.appendChild(price);
		this.button.appendChild(nb);
		this.button.addEventListener("click", buyComp(this.name, 1));
	};
	this.updateButton = function () {
		this.button.children[2].textContent = this.currentPrice;
		this.button.children[3].textContent = this.nb;
	};
}
function Upgrade(name, comp, price, value, type, conditions) {
	this.name = name;
	this.comp = comp;
	this.price = price;
	this.type = type;
	this.value = value;
	this.is_for_sell = false;
	this.is_sold = false;
	this.conditions = conditions;
	this.button = document.getElementById(`up`);

	this.buy = function (up, nb=1) {
		return () => {
			if (up.price <= nbFLOPS) {
				nbFLOPS -= up.price;
				up.is_for_sell = false;
				up.is_sold = true;

				components[up.comp].multiplier *= value;
			}
		};
	};
	this.createButton = function () {
		this.button.addEventListener("click", this.buy(this));
	};
	this.respect_conditions = function () {
		if (conditions !== undefined) {
			let iCond = 0;
			let is_respected = true;
			while (iCond < conditions.length && is_respected) {
				is_respected = eval(conditions[iCond]);
				iCond++;
			}
			return is_respected;
		} else {
			return true;
		}
	};
}

function init() {
	fillComponents();
	fillUpgrades();
	divScore = document.getElementById("score");
	divNbFLOPS = document.getElementById("nbFLOPS");
	clicker = document.getElementById("clicker");
	divFallingGPUS = document.getElementById("fallingGPUS");
	divRack = document.getElementById("rack");
	divName = document.getElementById("name");
	divFlopsPerSec = document.getElementById("flopsPerSec");
	divUpgrades = document.getElementById("upgrades");


	clicker.addEventListener("click", clickOnClicker);
	divName.addEventListener("click", getValue(divName, "What's your name ?"));

	fillRack();

	setInterval(update, 30)
	setInterval(updateFlops, 1000);
}
window.onload = init;
function buyComp(comp, nb) {
	return () => {
		if (components[comp].currentPrice <= nbFLOPS) {
			nbFLOPS -= components[comp].currentPrice;
			components[comp].nb += nb;
			for (let i = 0; i < nb; i++) {
				components[comp].newPrice();
			}
			img = document.createElement("img");
			img.src = `assets/${comp}.png`;
			iDeck = 0;
			while(iDeck < divRack.children.length && divRack.children[iDeck].id != comp + "R") {
				iDeck += 2;
			}
			if (iDeck < divRack.children.length) {
				divRack.children[iDeck].appendChild(img);
			}
			components[comp].updateButton();
		}
	};
}
function getValue(element, message) {
	return function () {
		showPrompt(message, function (response) {
			if (response === null) {
				console.log("User canceled the prompt.");
			} else {
				element.textContent = response;
			}
		});
	}
}
function clickOnClicker() {
	nbFLOPS += clickValue;
	nbClicks++;

	effectsClick();
}
function effectsClick() {
	newGPU = document.createElement("img");
	newGPU.src = `assets/fallingObj${getRandomInt(2)+1}.png`;
	newGPU.classList.add("fallingGPU");

	newGPU.topValue = newGPU.x + getRandomInt(clicker.clientWidth-clicker.clientWidth * 0.2) + clicker.clientWidth * 0.2;
	newGPU.leftValue = newGPU.y + getRandomInt(clicker.clientHeight-clicker.clientHeight* 0.2) + clicker.clientHeight* 0.2;
	newGPU.topMax = newGPU.topValue + 400 + getRandomInt(100);

	newGPU.style.top = `${newGPU.topValue}px`;
	newGPU.style.left = `${newGPU.leftValue}px`;

	newGPU.style.transform = `rotate(${getRandomInt(150)}deg)`;
	newGPU.style.opacity = 1;

	fallingObjects.push(newGPU);
	divFallingGPUS.appendChild(newGPU);

	newGPU.interval = setInterval(falling(newGPU));
	setTimeout(suprGPU(newGPU), 3000 + getRandomInt(1000));
}
function falling(GPU) {
	return () => {
		GPU.topValue += 2;
		GPU.style.top = `${GPU.topValue}px`;
		GPU.style.opacity -= 0.005;
	};
}
function suprGPU(GPU) {
	return () => {
		clearInterval(GPU.interval);
		let index = fallingObjects.indexOf(GPU);
		if (index > -1) { 
		  fallingObjects.splice(index, 1);
		}
		GPU.remove();
	};
}
function getRandomInt(max) {
 	return Math.floor(Math.random() * max);
}
function update() {
	updateNbFLOPS();
	updateFlopsPerSec();
	updateAvailableComps();
}
function updateNbFLOPS() {
	divNbFLOPS.textContent = nbFLOPS % 1 != 0 ? nbFLOPS.toFixed(1): nbFLOPS;
}
function updateFlops() {
	for (let comp in components) {
		nbFLOPS += components[comp].flopParSecComp();
	}
}
function updateFlopsPerSec() {
	let flopsPerSec = 0;
	for (let comp in components) {
		flopsPerSec += components[comp].flopParSecComp();
	}
	divFlopsPerSec.textContent = flopsPerSec % 1 != 0 ? flopsPerSec.toFixed(1): flopsPerSec;
}
function updateAvailableComps() {
	for (let comp in components) {
		if (components[comp].currentPrice > nbFLOPS) {
			components[comp].button.classList.add("unAffordable");
		} else {
			components[comp].button.classList.remove("unAffordable");
		}
	}
}
function fillRack() {
	for (let comp in components) {
		newDeck = document.createElement("div");
		newDeck.classList.add("deck");
		newDeck.id = comp + "R";
		
		divRack.appendChild(newDeck);
		sep = document.createElement("div");
		sep.classList.add("separationB");
		divRack.appendChild(sep);
	}
}
function fillComponents() {
	components["gamer"] = new Component("gamer", 0.1, 15);
	components["gpu"] = new Component("gpu", 2, 100);
	components["rack"] = new Component("rack", 25, 1000);

	for(let comp in components) {
		components[comp].createButton();
	}
}
function fillUpgrades() {
	upgrades["truc"] = new Upgrade("truc", "gpu", 1, 2, "type", "this.price == 1");

	for(let up in upgrades) {
		upgrades[up].createButton();
	}
}
function showPrompt(message, callback) {
	const promptOverlay = document.getElementById("customPrompt");
	const promptMessage = document.getElementById("promptMessage");
	const promptInput = document.getElementById("promptInput");

	promptMessage.textContent = message;
	promptInput.value = ""; // Reset the input field
	promptOverlay.classList.remove("hidden");

	submitPrompt = function () {
	const userInput = promptInput.value;
		promptOverlay.classList.add("hidden");
		if (callback) callback(userInput);
	};

	closePrompt = function () {
		promptOverlay.classList.add("hidden");
		if (callback) callback(null);
	};
}