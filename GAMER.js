class Game {
	static NB_UNITS_TYPES = 4;
	static nbFLOPS = 50;
	static nbGolds = 32;
	static nbPv = 100;

	static divFlopsPerSec;
	static divNbFLOPS;
	static divNbGolds;
	static divRack;
	static divUpgrades;
	static divNbPv;
	static bTowerUpgrade;

	static upgrades = {};
	static components = {};
	static unitsTypes = {};
	static towersTypes = {};
	static cellTypes = {};
	static towersUpgrades = {};

	static addFlops(value) {
		Game.nbFLOPS += value;
	}
	static addGolds(value) {
		Game.nbGolds += value;
	}
	static addPv(value) {
		Game.nbPv += value;
	}

	static init() {
		Game.initTypes();
		Game.divNbFLOPS = document.getElementById("nbFLOPS");
		Game.divNbGolds = document.getElementById("nbGolds");
		Game.divNbPv = document.getElementById("nbPv");
		Game.divRack = document.getElementById("rack");
		Game.divFlopsPerSec = document.getElementById("flopsPerSec");
		Game.divUpgrades = document.getElementById("upgrades");
		Game.bTowerUpgrade = document.getElementById("towerUpgrade");

		Game.bTowerUpgrade.onclick = Game.buyTowerUpgrade;
		Clicker.init();
		Arena.init();
		Wave.init();
		LootBox.init();

		setInterval(Game.update, 30);
		setInterval(Game.addProducedFlops, 1000);
	}

	static initTypes() {
		Game.initUnitsTypes();
		Game.initTowersTypes();
		Game.initTowersUpgrades();
		Game.initCellsTypes();
		Game.initComponentsTypes();
		Game.initUpgradesTypes();
	}
	static initComponentsTypes() {
		Game.components["gamer"] = new Component("gamer", 0.1, 15);
		Game.components["gpu"] = new Component("gpu", 2, 100);
	}
	static initUpgradesTypes() {
		Game.upgrades["truc"] = new Upgrade("truc", "gpu", 1, 2, "type", "this.price == 1");

		for(let up in Game.upgrades) {
			Game.upgrades[up].createButton();
		}
	}
	static initUnitsTypes() {
		// name, pv, speed, goldValue
		Game.unitsTypes["level1"] = new UnitType("level1", 1, 10, 1);
		Game.unitsTypes["level2"] = new UnitType("level2", 3, 13, 2);
		Game.unitsTypes["level3"] = new UnitType("level3", 6, 10, 3);
		Game.unitsTypes["level4"] = new UnitType("level4", 9, 10, 4);
	}
	static initTowersTypes() {
		// name, pv, power, attackSpeed, range, nbTargetsMax, currentPrice
		Game.towersTypes["turret"] = new TowerType("turret", 100, 1, 0.8, 1.5, 1, 25);
		Game.towersTypes["doubleTurret"] = new TowerType("doubleTurret", 100, 1, 0.8, 1.5, 2, 45);
		Game.towersTypes["greenLaser"] = new TowerType("greenLaser", 100, 2, 1, 2, 2, 100);
	}
	static initTowersUpgrades() {
		// name, property, type, values, ...targets
		Game.towersUpgrades["Speed"] = new TowerUpgrade("Speed", "attackSpeed", "m", [10, 10, 10, 10], "turret", "doubleTurret", "greenLaser");
		Game.towersUpgrades["Power"] = new TowerUpgrade("Power", "power", "a", [1, 1, 1, 1], "turret", "doubleTurret", "greenLaser");
		Game.towersUpgrades["Target"] = new TowerUpgrade("Target", "nbTargetsMax", "a", [1, 1, 1, 1], "turret", "doubleTurret", "greenLaser");
	}
	static initCellsTypes() {
		Game.cellTypes["tile"] = new CellType("tile");

		Game.cellTypes["roadH"] = new CellType("roadH");
		Game.cellTypes["roadV"] = new CellType("roadV");

		Game.cellTypes["crossTL"] = new CellType("crossTL");
		Game.cellTypes["crossTR"] = new CellType("crossTR");
		Game.cellTypes["crossBR"] = new CellType("crossBR");
		Game.cellTypes["crossBL"] = new CellType("crossBL");

		Game.cellTypes["start"] = new CellType("start");
		Game.cellTypes["end"] = new CellType("end");
	}

	static createButton(src, obj) {
		let button = document.getElementById(`${obj.name}B`)
		let objImg = document.createElement("img");
		objImg.src = src;
		objImg.classList.add("buyBObjImg")
		let divObjImg = document.createElement("div");
		divObjImg.classList.add("buyBObjImgZone")
		divObjImg.appendChild(objImg);

		let divNamePrice = document.createElement("div");
		divNamePrice.classList.add("buyBNamePrice")
		let name = document.createElement("div");
		name.classList.add("buyBName");
		name.textContent = obj.name.toUpperCase();

		let divPriceZone = document.createElement("div");
		divPriceZone.classList.add("buyBPriceZone")
		let price = document.createElement("div");
		price.classList.add("buyBPrice");
		price.textContent = obj.currentPrice;
		let goldCoinImg = document.createElement("img");
		goldCoinImg.src = "assets/goldCoin.png";
		goldCoinImg.classList.add("buyBImg")
		goldCoinImg.classList.add("buyBGoldCoinImg")
		let divGoldCoinImg = document.createElement("div");
		divGoldCoinImg.classList.add("buyBGoldCoinImgZone")
		divGoldCoinImg.appendChild(goldCoinImg);

		divPriceZone.appendChild(price);
		divPriceZone.appendChild(divGoldCoinImg);

		divNamePrice.appendChild(name);
		divNamePrice.appendChild(divPriceZone);

		let nb = document.createElement("div");
		nb.classList.add("buyBNb");
		nb.textContent = obj.nb;

		button.appendChild(divObjImg);
		button.appendChild(divNamePrice);
		button.appendChild(nb);
		return button;
	}

	static update() {
		if (document.visibilityState == "visible") {
			Arena.update();
			Game.updateNbFLOPS();
			Game.updateNbGolds();
			Game.updateNbPv();
			Game.updateFlopsPerSec();
			Game.updateAvailableComps();
			Wave.update();
		}
	}
	static updateFlopsPerSec() {
		let flopsPerSec = 0;
		for (let comp in Game.components) {
			flopsPerSec += Game.components[comp].flopParSecComp();
		}
		Game.divFlopsPerSec.textContent = flopsPerSec % 1 != 0 ? flopsPerSec.toFixed(1): flopsPerSec;
	}
	static updateNbFLOPS() {
		Game.divNbFLOPS.textContent = Game.nbFLOPS % 1 != 0 ? Game.nbFLOPS.toFixed(1): Game.nbFLOPS;
	}
	static updateNbGolds() {
		Game.divNbGolds.textContent = Game.nbGolds % 1 != 0 ? Game.nbGolds.toFixed(1): Game.nbGolds;
	}
	static updateNbPv() {
		Game.divNbPv.textContent = Game.nbPv % 1 != 0 ? Game.nbPv.toFixed(1): Game.nbPv;
	} 
	static updateAvailableComps() {
		for (let comp in Game.components) {
			if (Game.components[comp].currentPrice > Game.nbFLOPS) {
				Game.components[comp].button.classList.add("unAffordable");
			} else {
				Game.components[comp].button.classList.remove("unAffordable");
			}
		}
	}
	static addProducedFlops() {
		for (let comp in Game.components) {
			Game.addFlops(Game.components[comp].flopParSecComp());
		}
	}
	static buyTowerUpgrade() {
		LootBox.generate();
	}
}
window.onload = Game.init;
class Arena {
	static canvas;
	static ctx;
	static width;
	static height;

	static cells = [];
	static cellSize;

	static path;

	static units = [];
	static towers = [];

	static wave = 1;
	static TIME_BTW_WAVES = 30000;

	static addTower(tower) {
		Arena.towers.push(tower);
	}
	static addUnit(unit) {
		Arena.units.push(unit);
	}

	static init() {
		Arena.canvas = document.getElementById("arena");
		Arena.ctx = Arena.canvas.getContext("2d");
		Arena.width = Arena.canvas.width;
		Arena.height = Arena.canvas.height;
		Arena.cellSize = Math.floor(Arena.width/25);

		Arena.canvas.addEventListener("click", Arena.handleClick);

		Arena.initCells();
		Arena.initPath();
		Arena.initUnits();
		Arena.initTowers();
	}
	static initCells() {
		for (let y = 0; y < Arena.height-Arena.cellSize; y += Arena.cellSize) {
			let line = []
			for (let x = 0; x <= Arena.width-Arena.cellSize; x += Arena.cellSize) {
				let cell = new Cell(x, y, Arena.cellSize, `tile`);
				line.push(cell);
			}
			Arena.cells.push(line);
		}
	}
	static initUnits() {
		Arena.spawnWave();
		Arena.spawnUnitInterval = setInterval(Arena.spawnWave, Arena.TIME_BTW_WAVES);
		setInterval(Arena.updateUnits, 30);
	}
	static initTowers() {
		setInterval(Arena.updateTowers, 30);
	}
	static initPath() {
		Arena.path = new Path({i: 0, j: 0}, {i: 0, j: 5}, {i: 5, j: 5}, {i: 5, j: 0}, {i: 10, j: 0},
		 					{i: 10, j: 3}, {i: 13, j: 3}, {i: 13, j: 7}, {i: 9, j: 7}, {i: 9, j: 9}, {i: 3, j: 9}, {i: 3, j: 8},
		 					{i: 1, j: 8}, {i: 1, j: 12}, {i: 4, j: 12}, {i: 4, j: 15}, {i: 7, j: 15},
		 					{i: 7, j: 12}, {i: 11, j: 12}, {i: 11, j: 19}, {i: 3, j: 19}, {i: 3, j: 23}, {i: 8, j: 23}, {i: 8, j: 24});
	}

	static update() {
		Arena.ctx.clearRect(0, 0, Arena.width, Arena.height);
		Arena.ctx.fillStyle = "white";
		Arena.ctx.globalAlpha = 1;
		Arena.ctx.fillRect(0, 0, Arena.width, Arena.height);
		Arena.draw();
	}
	static updateUnits() {
		if (document.visibilityState == "visible") {
			for (let unit of Arena.units) {
				if (unit.pv > 0) {
					unit.updatePosition();
					if (unit.nextPos === undefined) {
						unit.win();
						Arena.units = Arena.units.filter(a => a.ID != unit.ID);
					}
				} else {
					console.log(unit.pv);
					unit.die();
				}
			}
		}
	}
	static updateTowers() {
		if (document.visibilityState == "visible") {
			for (let tower of Arena.towers) {
				tower.update();
			}
		}
	}

	static draw() {
		Arena.drawCells();
		Arena.drawUnits();
		Arena.drawTowers();
	}
	static drawUnits() {
		for (let unit of Arena.units) {
			unit.draw();
		}
	}
	static drawTowers() {
		for (let tower of Arena.towers) {
			tower.draw();
		}
	}
	static drawCells() {
		for (let line of Arena.cells) {
			for (let cell of line) {
				cell.draw();
			}
		}
	}

	static spawnWave() {
		if (document.visibilityState == "visible") {
			new Wave();
		} else {
			clearInterval(Arena.spawnUnitInterval);
			Arena.restartInterval = setInterval(Arena.restartUnitsSpawning(), 30);
		}
	}
	static restartUnitsSpawning() {
		return () => {
			if (document.visibilityState == "visible") {
				clearInterval(Arena.restartInterval);
				new Wave();
				Arena.spawnUnitInterval = setInterval(Arena.spawnWave, Arena.TIME_BTW_WAVES);
			}
		}
	}

	static handleClick() {
		if (event.shiftKey) {
			Arena.sellTower();
		} else {
			Arena.placeTower();
		}
	}
	static placeTower() {
		let towerSelected;
		let iTowerType = 0;
		let keys = Object.keys(Game.towersTypes);
		while (iTowerType < keys.length && !towerSelected) {
			if (Game.towersTypes[keys[iTowerType]].isSelected) {
				towerSelected = Game.towersTypes[keys[iTowerType]];
			}
			iTowerType++;
		}
		if (towerSelected && towerSelected.currentPrice <= Game.nbGolds) {
			let pos = Arena.getCoord(new Position(Math.floor(event.offsetX), Math.floor(event.offsetY)));
			if (Arena.enoughSpace(pos)) {
				Game.addGolds(-towerSelected.currentPrice);
				Arena.addTower(new Tower(towerSelected.name, pos));
			}
		}
	}
	static sellTower() {
		let pos = Arena.getCoord(new Position(Math.floor(event.offsetX), Math.floor(event.offsetY)));
		let iTower = 0;
		while (iTower < Arena.towers.length && !Arena.towers[iTower].area.collisionPos(pos)) {
			iTower++;
		}
		if (iTower < Arena.towers.length) {
			Game.addGolds(Game.towersTypes[Arena.towers[iTower].type].currentPrice * 0.7);
			Arena.towers.splice(iTower, 1);
		}
	}
	static enoughSpace(pos) {
		let area = Tower.area(pos);
		return Arena.towers.filter(a => a.area.collisionRect(area)).length == 0 && Arena.path.areaRects.filter(a => a.collisionRect(area)).length == 0;
	}
	static getCoord(pos) {
		return pos.multFact(Arena.width / Arena.canvas.offsetWidth);
	}
}
class CellType {
	constructor(name) {
		this.name = name;
		this.img = new Image();
		this.img.src = `assets/cells/${this.name}.png`;
	}
}
class Cell {
	constructor(x, y, size, type) {
		this.pos = new Position(x, y);
		this.size = size;
		this.type = Game.cellTypes[type];
	}
	draw() {
		Arena.ctx.drawImage(this.type.img, this.pos.x, this.pos.y, this.size, this.size);
	}
	changeType(type) {
		this.type = Game.cellTypes[type];
	}
}
class TowerType {
	constructor(name, pv, power, attackSpeed, range, nbTargetsMax, currentPrice) {
		this.name = name;
		this.pv = new TowerStat(pv);
		this.power = new TowerStat(power);
		this.attackSpeed = new TowerStat(attackSpeed);
		this.range = new TowerStat(range);
		this.nbTargetsMax = new TowerStat(nbTargetsMax);
		let img = new Image();
		img.src = `assets/towers/${this.name}/tower.png`;
		this.img = img;

		this.currentPrice = currentPrice;
		this.nb = "";
		this.isSelected = false;

		this.isUnlocked = true;

		this.upgradesAvailable = [];

		let divTowers = document.getElementById("towers");
		let divTower = document.createElement("div");
		divTower.classList.add('buyB');
		divTower.id = `${name}B`;
		divTowers.appendChild(divTower);

		this.createButton();
	}
	shootingSprite(state) {
		let img = new Image();
		img.src = `assets/towers/${this.name}/shooting${state}.png`;
		return img;
	}
	createButton() {
		let src = `assets/towers/${this.name}/tower.png`;
		this.button = Game.createButton(src, this);

		let isSelected = () => {
			this.isSelected = !this.isSelected;
			if (this.isSelected) {
				this.button.classList.add("isSelected");
				let iTowerType = 0;
				let keys = Object.keys(Game.towersTypes);
				while (iTowerType < keys.length) {
					if (Game.towersTypes[keys[iTowerType]].isSelected && Game.towersTypes[keys[iTowerType]] != this) {
						Game.towersTypes[keys[iTowerType]].button.classList.remove("isSelected");
						Game.towersTypes[keys[iTowerType]].isSelected = false;
					}
					iTowerType++;
				}
			} else {
				this.button.classList.remove("isSelected");
			}
		}
		this.button.addEventListener("click", isSelected);
	} 
}
class Tower {
	static NB_SHOOTING_STATES = 4;
	constructor(type, pos) {
		this.pos = pos;
		this.type = type;

		this.pv = Game.towersTypes[this.type].pv.value();
		this.power = Game.towersTypes[this.type].power.value();
		this.attackSpeed = Game.towersTypes[this.type].attackSpeed.value();
		this.timePerAttack = 1000 / this.attackSpeed;
		this.nbTargetsMax = Game.towersTypes[this.type].nbTargetsMax.value();

		this.range = Arena.cellSize * Game.towersTypes[this.type].range.value();
		this.circle = new Circle(this.pos, this.range);
		this.area = Tower.area(this.pos);
		this.sprite = Game.towersTypes[this.type].sprite;
		this.isShooting = false;
		this.shootingState = 0;
		this.nbFrames = 0;
	}
	draw() {
		let img = Game.towersTypes[this.type].img;
		if (this.shootingState != 0 && this.type == "turret") {
			img = Game.towersTypes[this.type].shootingSprite(this.shootingState);
			this.nbFrames++;
			if (this.nbFrames > Math.floor((this.timePerAttack / 30) / Tower.NB_SHOOTING_STATES)) {
				this.shootingState = (this.shootingState + 1) % Tower.NB_SHOOTING_STATES;
				this.nbFrames = 0;
			}
		}
		Arena.ctx.drawImage(img, this.area.x, this.area.y, this.area.width, this.area.height);
		let lineWidth = Arena.ctx.lineWidth;
		Arena.ctx.lineWidth = 2;
		Arena.ctx.strokeStyle = 'red';
		Arena.ctx.beginPath();
		Arena.ctx.arc(this.pos.x, this.pos.y, this.range, 0, 2 * Math.PI);
		Arena.ctx.stroke();
		Arena.ctx.lineWidth = lineWidth;
	}
	update() {
		this.attack();
	}
	updateStats() {
		this.pv = Game.towersTypes[this.type].pv.value();
		this.power = Game.towersTypes[this.type].power.value();
		this.attackSpeed = Game.towersTypes[this.type].attackSpeed.value();
		this.timePerAttack = 1000 / this.attackSpeed;
		this.nbTargetsMax = Game.towersTypes[this.type].nbTargetsMax.value();

		this.range = Arena.cellSize * Game.towersTypes[this.type].range.value();
		this.circle = new Circle(this.pos, this.range);
	}
	attack() {
		if (!this.isShooting) {
			let inRange = this.unitsInRange().sort((a, b) =>  this.circle.distanceRect(a.area) < this.circle.distanceRect(b.area));
			if (inRange.length != 0) {
				if (this.shootingState == 0) {
					this.shootingState = 1;
				}
				let iUnit = 0;
				while (iUnit < this.nbTargetsMax && iUnit < inRange.length) {
					inRange[iUnit].pv--;
					iUnit++;
				}
				this.isShooting = true;
				setTimeout(() => this.isShooting = false, this.timePerAttack);
			}
		}
	}
	static area(pos) {
		return new Rectangle(pos.x - Arena.cellSize / 3, pos.y - Arena.cellSize / 3, Arena.cellSize / 1.5, Arena.cellSize / 1.5).floor();
	}
	unitsInRange() {
		let units = [];
		for (let unit of Arena.units) {
			if (this.circle.isCircleRectCollision(unit.area)) {
				units.push(unit);
			}
		}
		return units;
	}
}
class UnitType {
	constructor(name, pv, speed, goldValue) {
		this.name = name;
		this.pv = pv;
		this.speed = speed;
		this.goldValue = goldValue;
		this.img = new Image();
		this.img.src = `assets/units/${name}.png`;
	}
}
class Unit {
	static nbUnits = 0;
	constructor(type) {
		this.ID = Unit.nbUnits;
		Unit.nbUnits++;

		this.currentStep = 1;
		this.nextPos = Arena.path.nextStep(this.currentStep);
		this.pos = Arena.path.start();
		this.firstMag = this.nextPos.diff(this.pos);
		this.area = Unit.area(this.pos); 

		this.type = type;
		console.log(this.type)
		this.speed = Game.unitsTypes[this.type].speed;
		this.pv = Game.unitsTypes[this.type].pv;
		this.goldValue = Game.unitsTypes[this.type].goldValue;
		this.maxPv = this.pv;
	}
	static area(pos) {
		return new Rectangle(pos.x + Arena.cellSize / 3, pos.y + Arena.cellSize / 3, Arena.cellSize / 2.5, Arena.cellSize / 2.5);
	}
	draw() {
		Arena.ctx.drawImage(Game.unitsTypes[this.type].img, this.area.x, this.area.y, this.area.width, this.area.height);
	}
	updatePosition() {
		if (this.nextPos) {
			let increment = this.speed * 0.005 * Arena.cellSize;
			if (this.firstMag.y == 0) {
				if (this.firstMag.x < 0) {
					this.pos.x -= increment;
				} else {
					this.pos.x += increment;
				}
			} else {
				if (this.firstMag.y < 0) {
					this.pos.y -= increment;
				} else {
					this.pos.y += increment;
				}
			}
			let mag = this.nextPos.diff(this.pos);
			let truc = this.firstMag.div(mag);
			if (truc.x < 0 || truc.y < 0) {
				this.pos = this.nextPos;
				this.currentStep++;
				this.nextPos = Arena.path.nextStep(this.currentStep);
				if (this.nextPos) {
					this.firstMag = this.nextPos.diff(this.pos);
				}
			}
			this.area = Unit.area(this.pos);
		}
	}
	die() {
		Game.addGolds(this.goldValue);
		Arena.units = Arena.units.filter(a => a.ID != this.ID);
	}
	win() {
		Game.addPv(-this.pv);
	}
}
class Wave {
	static nbWaves = 0;
	static divWave;

	static init() {
		Wave.divWave = document.getElementById("wave");
	}
	static update() {
		Wave.divWave.textContent = `Wave ${Wave.nbWaves}`;
	}
	constructor() {
		Wave.nbWaves++;
		this.ID = Wave.nbWaves;
		this.generateBatches();
		this.start();
		this.timeByBatch = 0;
	}
	start() {
		let timeBetweenBatches = ((Arena.TIME_BTW_WAVES * 0.3) / this.unitsBatches.length);
		for (let iBatch in this.unitsBatches) {
			setTimeout(this.unitsBatches[iBatch].start(), (this.timeByBatch * iBatch) + timeBetweenBatches);
		}
	}
	generateBatches() {
		this.unitsBatches = [];
		let nbBatches = Math.floor(getBaseLog(4, this.ID)) + 1;
		let minUnits = Math.floor(getBaseLog(2, this.ID)) + 3;
		let maxUnits = minUnits + 3;
		let unitsMaxLevel = this.ID % 10;
		if (unitsMaxLevel > Game.NB_UNITS_TYPES) {
			unitsMaxLevel = Game.NB_UNITS_TYPES;
		}
		this.timeByBatch = (Arena.TIME_BTW_WAVES * 0.6) / nbBatches;
		for (let iBatch = 0; iBatch < nbBatches; iBatch++) {
			let nbUnits = getRandomInt(maxUnits, minUnits);
			this.addBatch(new UnitBatch(`level${getRandomInt(unitsMaxLevel, 1)}`, nbUnits, this.timeByBatch));
		}
	}
	addBatch(batch) {
		this.unitsBatches.push(batch);
	}
}
class UnitBatch {
	constructor(type, nbUnits, timeAllowed) {
		this.type = type;
		this.nbUnits = nbUnits;
		this.timeAllowed = timeAllowed;
	}
	start() {
		return () => {
			for (let x = 0; x < this.nbUnits; x++) {
				setTimeout(this.createUnit(), getRandomInt(this.timeAllowed, 0));
			}
		}
	}
	createUnit() {
		return () => {
			Arena.addUnit(new Unit(this.type));
		}
	}
}
class Clicker {
	static div;
	static nbClicks = 0;
	static clickValue = 1;
	static fallingObjects = [];
	static divFallingGPUS;

	static init() {
		Clicker.div = document.getElementById("clicker");
		Clicker.divFallingGPUS = document.getElementById("fallingGPUS");
		Clicker.div.addEventListener("click", Clicker.clickOnClicker);
	}
	static clickOnClicker() {
		Game.nbFLOPS += Clicker.clickValue;
		Clicker.nbClicks++;

		Clicker.effectsClick();
	}
	static effectsClick() {
		let newGPU = document.createElement("img");
		newGPU.src = `assets/fallingObj${getRandomInt(2)+1}.png`;
		newGPU.classList.add("fallingGPU");

		newGPU.topValue = newGPU.x + getRandomInt(Clicker.div.clientWidth-Clicker.div.clientWidth * 0.2) + Clicker.div.clientWidth * 0.2;
		newGPU.leftValue = newGPU.y + getRandomInt(Clicker.div.clientHeight-Clicker.div.clientHeight* 0.2) + Clicker.div.clientHeight* 0.2;
		newGPU.topMax = newGPU.topValue + 400 + getRandomInt(100);

		newGPU.style.top = `${newGPU.topValue}px`;
		newGPU.style.left = `${newGPU.leftValue}px`;

		newGPU.style.transform = `rotate(${getRandomInt(150)}deg)`;
		newGPU.style.opacity = 1;

		Clicker.fallingObjects.push(newGPU);
		Clicker.divFallingGPUS.appendChild(newGPU);

		newGPU.interval = setInterval(Clicker.falling(newGPU), 15);
		setTimeout(Clicker.suprGPU(newGPU), 3000 + getRandomInt(1000));
	}
	static falling(GPU) {
		return () => {
			GPU.topValue += 2;
			GPU.style.top = `${GPU.topValue}px`;
			GPU.style.opacity -= 0.005;
		};
	}
	static suprGPU(GPU) {
		return () => {
			clearInterval(GPU.interval);
			let index = Clicker.fallingObjects.indexOf(GPU);
			if (index > -1) { 
				console.log(Clicker.fallingObjects);
			  	Clicker.fallingObjects.splice(index, 1);
			  	console.log(Clicker.fallingObjects);
			}
			GPU.remove();
		};
	}
}
class Component {
	constructor(name, value, price) {
		this.name = name;
		this.nb = 0;
		this.value = value;
		this.currentPrice = price;
		this.multiplier = 1;
		this.is_dislay = false;
		this.createButton();
	}
	flopParSecComp() {
		return this.nb * this.value * this.multiplier;
	}
	newPrice(nb = 1, selling = false) {
		this.currentPrice = this.price(nb, selling);
	}
	price(nb = 1, selling = false) {
		if (!selling) {
			return Math.floor(this.currentPrice * Math.pow(1.15, nb));
		} else {
			return Math.floor(this.currentPrice * Math.pow(0.7, nb));
		}
	}
	createButton() {
		let src = `assets/${this.name}.png`;
		this.button = Game.createButton(src, this);
		this.button.addEventListener("click", this.buy(1));
	}
	updateButton() {
		let price = this.button.getElementsByClassName('buyBPrice').item(0);
		price.textContent = this.currentPrice;
		let nb = this.button.getElementsByClassName('buyBNb').item(0);
		nb.textContent = this.nb;
	}
	buy(nb) {
		return () => {
			let comp = this.name;
			if (Game.components[comp].currentPrice*nb <= Game.nbGolds) {
				Game.addGolds(-Game.components[comp].currentPrice*nb);
				Game.components[comp].nb += nb;
				for (let i = 0; i < nb; i++) {
					Game.components[comp].newPrice();
				}
				Game.components[comp].updateButton();
			}
		};
	}
}
class Upgrade {
	constructor(name, comp, price, value, type, conditions) {
		this.name = name;
		this.comp = comp;
		this.price = price;
		this.type = type;
		this.value = value;
		this.is_for_sell = false;
		this.is_sold = false;
		this.conditions = conditions;
		this.button = document.getElementById(`up`);
	}
	buy(up, nb=1) {
		return () => {
			if (up.price <= Game.nbFLOPS) {
				Game.nbFLOPS -= up.price;
				up.is_for_sell = false;
				up.is_sold = true;

				Game.components[up.comp].multiplier *= this.value;
			}
		};
	}
	createButton() {
		this.button.addEventListener("click", this.buy(this));
	}
	respect_conditions() {
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
	}
}
class Path {
	constructor(...indices) {
		this.cells = [];
		this.cells.push(Arena.cells[indices[0].i][indices[0].j]);
		for (let k in indices) {
			if (k != 0) {
				let pos1 = Arena.cells[indices[k-1].i][indices[k-1].j].pos;
				let pos2 = Arena.cells[indices[k].i][indices[k].j].pos;
				if (indices[k].j != indices[k-1].j) {
					if (pos1.x < pos2.x) {
						for (let c = indices[k-1].j+1; c <= indices[k].j; c++) {
							Arena.cells[indices[k].i][c].changeType("roadH");
							this.cells.push(Arena.cells[indices[k].i][c]);
						}
					} else {
						for (let c = indices[k-1].j-1; c >= indices[k].j; c--) {
							Arena.cells[indices[k].i][c].changeType("roadH");
							this.cells.push(Arena.cells[indices[k].i][c]);
						}
					}
				} else {
					if (pos1.y < pos2.y) {
						for (let c = indices[k-1].i+1; c <= indices[k].i; c++) {
							Arena.cells[c][indices[k].j].changeType("roadV");
							this.cells.push(Arena.cells[c][indices[k].j]);
						}
					} else {
						for (let c = indices[k-1].i-1; c >= indices[k].i; c--) {
							Arena.cells[c][indices[k].j].changeType("roadV");
							this.cells.push(Arena.cells[c][indices[k].j]);
						}
					}
				}
			}
		}
		this.positions = [];
		for (let iInd in indices) {
			let cell = Arena.cells[indices[iInd].i][indices[iInd].j];
			iInd = Number(iInd);
			if (iInd != 0 && iInd != indices.length-1) {
				let pos0 = new Position(indices[iInd-1].j, indices[iInd-1].i);
				let pos1 = new Position(indices[iInd].j, indices[iInd].i);
				let pos2 = new Position(indices[iInd+1].j, indices[iInd+1].i);
				let mag1 = pos1.diff(pos0);
				let mag2 = pos1.diff(pos2);
				if (mag1.x < 0 || mag2.x < 0) {
					if (mag1.y < 0 || mag2.y < 0) {
						cell.changeType('crossBR');
					} else {
						cell.changeType('crossTR');
					}
				} else {
					if (mag1.y < 0 || mag2.y < 0) {
						cell.changeType('crossBL');
					} else {
						cell.changeType('crossTL');
					}
				}
			}
			this.positions.push(new Position(cell.pos.x, cell.pos.y));
		}
		this.cells[0].changeType("start");
		this.cells[this.cells.length-1].changeType("end");
		this.length = this.positions.length;
		this.areaRects = [];
		for (let iPos = 0; iPos < this.length-1; iPos++) {
			let pos1 = this.positions[iPos];
			let pos2 = this.positions[iPos+1];
			let mag = pos1.diff(pos2)
			if (mag.y == 0) {
				if (mag.x > 0) {
					this.areaRects.push(new Rectangle(pos2.x, pos2.y, pos1.x - pos2.x, Arena.cellSize));
				} else {
					this.areaRects.push(new Rectangle(pos1.x, pos1.y, pos2.x - pos1.x + Arena.cellSize, Arena.cellSize));
				}
			} else {
				if (mag.y > 0) {
					this.areaRects.push(new Rectangle(pos2.x, pos2.y, Arena.cellSize, pos1.y - pos2.y));
				} else {
					this.areaRects.push(new Rectangle(pos1.x, pos1.y, Arena.cellSize, pos2.y - pos1.y + Arena.cellSize));
				}
			}
		}
	}
	start() {
		return new Position(this.positions[0].x, this.positions[0].y);
	}
	nextStep(iStep) {
		if (iStep < this.length) {
			return new Position(this.positions[iStep].x, this.positions[iStep].y);
		} else {
			return undefined;
		}
	}
	drawAreaRects() {
		for (let ar of this.areaRects) {
			Arena.ctx.fillStyle = 'yellow';
			Arena.ctx.fillRect(ar.x, ar.y, ar.width, ar.height);
		}
	}
}
class Position {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	add(pos) {
		return new Position(this.x + pos.x, this.y + pos.y);
	}
	diff(pos) {
		return new Position(this.x - pos.x, this.y - pos.y);
	}
	multFact(a) {
		return new Position(this.x * a, this.y * a);
	}
	mult(pos) {
		return new Position(this.x * pos.x, this.y * pos.y);
	}
	abs() {
		return new Position(Math.abs(this.x), Math.abs(this.y));
	}
	dist(pos) {
		return ((this.x - pos.x) ** 2 + (this.y - pos.y) ** 2) ** 0.5;
	}
	div(pos) {
		if (pos.x != 0) {
			if (pos.y != 0) {
				return new Position(this.x / pos.x, this.y / pos.y);
			} else {
				return new Position(this.x / pos.x, 0);
			}
		} else {
			if (pos.y != 0) {
				return new Position(0, this.y / pos.y);
			} else {
				return new Position(0, 0);
			}
		}
	}
}
class Rectangle {
	constructor (x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	pos() {
		return new Position(this.x, this.y);
	}
	collisionRect(rect) {
		return this.x < rect.x + rect.width && this.x + this.width > rect.x && this.y < rect.y + rect.height && this.height + this.y > rect.y;
	}
	collisionPos(pos) {
		return (pos.x >= this.x && pos.x <= this.x + this.width) && (pos.y >= this.y && pos.y <= this.y + this.height);
	}
	floor() {
		return new Rectangle(Math.floor(this.x), Math.floor(this.y), Math.floor(this.width), Math.floor(this.height));
	}
}
class Circle {
	constructor (pos, radius) {
		this.x = pos.x;
		this.y = pos.y;
		this.radius = radius;
	}
	pos() {
		return new Position(this.x, this.y);
	}
	distanceRect(rect) {
		const closestX = Math.max(rect.x, Math.min(this.x, rect.x + rect.width));
		const closestY = Math.max(rect.y, Math.min(this.y, rect.y + rect.height));

		const distanceX = this.x - closestX;
		const distanceY = this.y - closestY;

		return (distanceX ** 2 + distanceY ** 2) ** 0.5;
	}
	isCircleRectCollision(rect) {
		return this.distanceRect(rect) <= this.radius;
	}
}
class LootBox {
	static divCards;
	static divCard1;
	static divCard2;
	static divCard3;
	static cardsUpgrades = [];

	static init() {
		LootBox.divCards = document.getElementById("cards");

		LootBox.divCard1 = document.getElementById("card1");
		LootBox.divCard2 = document.getElementById("card2");
		LootBox.divCard3 = document.getElementById("card3");		

		LootBox.divCard1.addEventListener("click", LootBox.choseCard(0));
		LootBox.divCard2.addEventListener("click", LootBox.choseCard(1));
		LootBox.divCard3.addEventListener("click", LootBox.choseCard(2));
	}
	static generate() {
		LootBox.divCards.classList.remove("hidden");
		let upgradesAvailable = [];
		for (let iTowerType in Game.towersTypes) {
			for (let upgrade of Game.towersTypes[iTowerType].upgradesAvailable) {
				upgradesAvailable.push({'targetName': Game.towersTypes[iTowerType].name, 'upgradeName': upgrade});
			}
		}
		console.log(upgradesAvailable);
		let nbCard;
		switch (upgradesAvailable.length) {
			case 0 :
				nbCard = 0
				LootBox.divCards.classList.add("hidden");
				break;
			case 1 :
				nbCard = 1
				LootBox.divCard2.classList.add("hidden");
				LootBox.divCard3.classList.add("hidden");
				break;
			case 2 :
				nbCard = 2
				LootBox.divCard3.classList.add("hidden");
					break;
			default :
				nbCard = 3;
				break;
		}
		for (let i = 0; i < nbCard; i++) {
			let iUpgrade = getRandomInt(upgradesAvailable.length);
			LootBox.modifyCard(i+1, upgradesAvailable[iUpgrade].targetName, upgradesAvailable[iUpgrade].upgradeName);
			LootBox.cardsUpgrades[i] = upgradesAvailable[iUpgrade];
			upgradesAvailable.splice(iUpgrade, 1);
		}
	}
	static modifyCard(nb, targetName, upgradeName) {
		let card = LootBox["divCard"+nb];
		card.children[0].textContent = Game.towersUpgrades[upgradeName].title(targetName);
		card.children[1].textContent = Game.towersUpgrades[upgradeName].description(targetName);
	}
	static choseCard(i) {
		return () => {
			LootBox.divCards.classList.add("hidden");
			let cardUpgrade = LootBox.cardsUpgrades[i];
			Game.towersUpgrades[cardUpgrade.upgradeName].apply(cardUpgrade.targetName);
		}
	}
}
class TowerUpgrade {
	constructor (name, property, type, values, ...targets) {
		this.name = name;
		this.property = property;
		this.type = type;
		this.values = values;
		this.targets = [];
		for (let target of targets) {
			this.targets[target] = {'name': target, 'step': 0};
			Game.towersTypes[target].upgradesAvailable.push(this.name);
		}
		this.nbSteps = values.length;
	}
	apply(targetName) {
		if (Object.keys(this.targets).includes(targetName) && this.targets[targetName].step != this.nbSteps) {
			if (this.type == "a") {
				Game.towersTypes[targetName][this.property].bonusValue += this.values[this.targets[targetName].step];
				this.targets[targetName].step++;
			} else {
				Game.towersTypes[targetName][this.property].multiplier += this.values[this.targets[targetName].step]/100;
				this.targets[targetName].step++;
			}
			if (this.isFinished(targetName)) {
				let index = Game.towersTypes[targetName].upgradesAvailable.indexOf(this.name);
				Game.towersTypes[targetName].upgradesAvailable.splice(index, 1);
			}
			for (let tower of Arena.towers) {
				if (tower.type == targetName) {
					tower.updateStats();
				}
			}
		}
	}
	description(targetName) {
		if (Object.keys(this.targets).includes(targetName) && this.targets[targetName].step != this.nbSteps) {
			let value = this.values[this.targets[targetName].step];
			targetName =  targetName[0].toUpperCase() + targetName.slice(1).toLowerCase();
			let property;
			switch (this.property) {
				case "nbTargetsMax":
					property = "max target";
				break;
				case "attackSpeed":
					property = "attack speed";
				break;
				case "power":
					property = "power";
				break;
			}
			if (this.type=="a") {
				return `The ${targetName}s gain ${value} ${property}`;
			} else {
				return `The ${targetName}s gain ${value}% ${property}`;
			}
		}
	}
	title(targetName) {
		if (Object.keys(this.targets).includes(targetName) && this.targets[targetName].step != this.nbSteps) {
			let title = this.name + " " + romanize(this.targets[targetName].step+1);
			return title;
		}
	}
	isFinished(targetName) {
		return this.targets[targetName].step == this.nbSteps;
	}
}
class TowerStat {
	constructor (baseValue) {
		this.baseValue = baseValue;
		this.multiplier = 1;
		this.bonusValue = 0;
	}
	value() {
		return (this.baseValue + this.bonusValue) * this.multiplier;
	}
}






////
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
function getRandomInt(max, min) {
	if (min) {
		const minCeiled = Math.ceil(min);
		const maxFloored = Math.floor(max);
		return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
	} else {
		return Math.floor(Math.random() * max);
	}
}
function romanize(num) {
    if (isNaN(num))
        return NaN;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}
function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}