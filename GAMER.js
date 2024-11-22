let nbFLOPS = 0;
let nbClicks = 0;
let incrementValue = 1;
let cartes = [];
let divScore;
let divNbFLOPS;
let divFallingGPUS;
let clicker;
let divRack;
function Component(name, value, price) {
	this.name = name;
	this.nb = 0;
	this.value = value;
	this.price = price;
	this.multiplier = 1;
	this.is_dislay = false;
	this.button = document.getElementById(`${name}B`);
	this.flopParSecComp = function() {
		return this.nb * this.value * this.multiplier;
	};
	this.newPrice = function () {
		this.price = Math.floor(this.price * 1.15);
	};
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
		price.textContent = this.price;
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
		console.log(this.button.children[2].textContent, this.price);
		this.button.children[2].textContent = this.price;
		this.button.children[3].textContent = this.nb;
	};
}

let components = {};
function init() {
	fillComponents();
	divScore = document.getElementById("score");
	divNbFLOPS = document.getElementById("nbFLOPS");
	clicker = document.getElementById("clicker");
	divFallingGPUS = document.getElementById("fallingGPUS");
	divRack = document.getElementById("rack");

	clicker.addEventListener("click", clickOnClicker);

	fillRack();

	setInterval(update, 30)
	setInterval(updateFlops, 1000);
}
function buyComp(comp, nb) {
	return () => {
		if (components[comp].price <= nbFLOPS) {
			nbFLOPS -= components[comp].price;
			components[comp].nb += nb;
			for (let i = 0; i < nb; i++) {
				components[comp].newPrice();
			}
			img = document.createElement("img");
			img.src = `assets/${comp}.png`;
			iDeck = 0;
			while(iDeck < divRack.children.length && divRack.children[iDeck].id != comp) {
				iDeck += 2;
			}
			if (iDeck < divRack.children.length) {
				divRack.children[iDeck].appendChild(img);
			}
			components[comp].updateButton();
		}
	};
}
function clickOnClicker() {
	nbFLOPS += incrementValue;
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

	cartes.push(newGPU);
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
		let index = cartes.indexOf(GPU);
		if (index > -1) { 
		  cartes.splice(index, 1);
		}
		GPU.remove();
	};
}
function getRandomInt(max) {
 	return Math.floor(Math.random() * max);
}
function update() {
	updateNbFLOPS();
}
function updateNbFLOPS() {
	divNbFLOPS.textContent = nbFLOPS % 1 != 0 ? nbFLOPS.toFixed(1): nbFLOPS;
}
function updateFlops() {
	for (let comp in components) {
		nbFLOPS += components[comp].flopParSecComp();
	}
}
function fillRack() {
	for (let comp in components) {
		newDeck = document.createElement("div");
		newDeck.classList.add("deck");
		newDeck.id = comp;
		
		divRack.appendChild(newDeck);
		sep = document.createElement("div");
		sep.classList.add("separationB");
		divRack.appendChild(sep);
	}
}
function fillComponents() {
	components["gamer"] = new Component("gamer", 0.1, 15)
	components["gpu"] = new Component("gpu", 2, 10000)

	for(let comp in components) {
		components[comp].createButton();
	}
}
window.onload = init;