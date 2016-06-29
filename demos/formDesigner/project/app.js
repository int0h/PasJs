function ComponentContext(){
	this.elms = [];
	this.doc = {};
};
var globalContext = new ComponentContext();

var fs = require('fs');
global.c = require('pjsBasicComponents/cmps.js');
var enums = require('pjsBasicComponents/enums.js');
var def = require('defClass/defineHelpers.js').def;

var form = new c.Form(null, {"mainForm": true});
var json = fs.readFileSync("./form.json");
form.fromJson(json, global);

log.items = [];
log.scrollBars = enums.scrollBars.ssVertical;

//code: #################

var gameSpeed = 1;

var data = {
	"kpCount": 0,
	"irrCount": 0,	
	"npSpace": 15,
	"price": {
		"kp": 13,
		"irr": 17
	},
	"netCost": {
		"kp": 7,
		"irr": 9
	},
	"money": 0,
	"maxMoney": 50,
	"maxNps": 15,
	"account": 1000,
	"income": 0,
	"expenses": 0,
	"profit": 0
};

var model = {};

function defNp(name){
	def({
		name: name + "Count",
		gs: [
			function(){
				return data[name + "Count"];
			},
			function(val){
				if (val < 0){
					throw "Газеты кончились!";
				};
				model.npSpace -= (val - data[name + "Count"]);
				global[name + "Count"].value = val;
				data[name + "Count"] = val;
			}
		]
	}, model);
};

defNp("kp");
defNp("irr");

def({
	name: "npSpace",
	gs: [
		function(){
			return data.npSpace;
		},
		function(val){
			if (val < 0){
				throw "Недостаточно места!";
			};
			npSpace.fraction = (data.maxNps - val) / data.maxNps;
			data.npSpace = val;
		}
	]
}, model);

def({
	name: "money",
	gs: [
		function(){
			return data.money;
		},
		function(val){
			if (val > data.maxMoney){
				throw "Недостаточно места в купюроприемнике!";
			};
			moneyLabel.label = "Деньги: " + val + " руб."
			moneySpace.fraction = val / data.maxMoney;
			data.money = val;
		}
	]
}, model);

def({
	name: "account",
	gs: [
		function(){
			return data.account;
		},
		function(val){
			if (val < 0){
				throw "Недостаточно денег на счете!";
			};
			var diff = val - data.account;
			if (diff > 0){
				data.income += diff;
				data.profit = data.income - data.expenses;
				incomeLabel.label = "Доходы: " + data.income + " руб.";
				profitLabel.label = "Прибыль:" + data.profit + " руб.";
			}else{
				data.expenses += -diff;
				data.profit = data.income - data.expenses;
				expensesLabel.label = "Расходы: " + data.expenses + " руб.";
				profitLabel.label = "Прибыль:" + data.profit + " руб.";
			};
			accountLabel.label = "Баланс: " + val + " руб."
			data.account = val;
		}
	]
}, model);

model.npSpace = 15;
model.kpCount = 3;
model.irrCount = 4;
model.money = 0;
model.account = 1000;


var kpBtns = [kp_p1, kp_p3, kp_p5];
var irrBtns = [irr_p1, irr_p3, irr_p5];
var amount = [1, 3, 5];

kpBtns.forEach(function(btn, id){
	btn.on("click", function(){
		try{
			var plus = amount[id];
			model.kpCount += plus;
			var cost = data.netCost.kp * plus
			model.account -= cost;
			log.items = log.items.concat([" - " + cost + " руб. : закупка газет " 
				+ npRus.kp + " (x" + plus + ")"]);
		}catch(e){
			alert(e);
		};
	});
});

irrBtns.forEach(function(btn, id){
	btn.on("click", function(){
		try{
			var plus = amount[id];
			model.irrCount += plus;
			var cost = data.netCost.irr * plus
			model.account -= cost;
			log.items = log.items.concat([" - " + cost + " руб. : закупка газет " 
				+ npRus.irr + " (x" + plus + ")"]);
		}catch(e){
			alert(e);
		};
	});
});

takeMoney.on("click", function(){
	model.account += model.money;	
	log.items = log.items.concat([" + " + model.money + " руб. : выручка "]);
	model.money = 0;
});

// ###############################################

function randItem(list){
	return list[Math.floor(Math.random() * list.length)];
};

var names = ["Анастасия", "Мария", "Дарья", "Анна", "Елизавета", 
	"Полина", "Виктория", "Екатерина", "Александр", 
	"Максим", "Иван", "Артем", "Дмитрий", "Никита", 
	"Михаил", "Даниил", "Егор", "Андрей"];

function Customer(){
	this.name = randItem(names);
	this.wantToBuy = randItem(["kp", "irr"]);
	this.stage = 0;
};

var npRus = {
	"kp": "Комсомольская правда",
	"irr": "Из рук в руки"
};

Customer.prototype.getStageText = function(){
	if (this.stage == 0){
		return 'К автомату подходит покупатель [' 
			+ this.name
			+ ']';
	};
	if (this.stage == 1){
		return this.name + ' выбирает газету "' 
			+ npRus[this.wantToBuy]
			+ '"';
	};
	if (this.stage == 2){
		return this.name + ' оплачивает покупку и забирает газету'; 
	};
	/*if (this.stage == 3){
		return this.name + ' забирает газету'; 
	};*/
	if (this.stage == 3){
		return this.name + ' уходит'; 
	};
};

Customer.prototype.proceed = function(cb){	
	var self = this;
	customerState.value = this.getStageText();
	customerProgress.value = this.stage * 33;
	if (this.stage == 2){
		try{
			model[this.wantToBuy + 'Count']--;
			model.money += data.price[this.wantToBuy];
		}catch(e){
			alert(e);
			this.stage = 3;
			this.proceed(cb);
			return;
		}
	};
	/*if (this.stage == 3){
		try{
			model[this.wantToBuy + 'Count']--;
		}catch(e){			
			alert(e);
			this.stage = 4;
			this.proceed(cb);
			return;
		};
	};*/
	setTimeout(function(){
		if (self.stage < 3){
			self.stage++;
			self.proceed(cb);
			return;
		};
		cb();
	}, 1500 / speed.value);
};

var current;
function cycle(){	
	current = new Customer();
	current.proceed(function(){
		customerState.value = "[Никого нет]";
		setTimeout(cycle, 3000 / speed.value);
	})
};
cycle();

/*btn.on("click", function(){
	alert("hello world!");
});*/

//#######################

nativeApp.Run();