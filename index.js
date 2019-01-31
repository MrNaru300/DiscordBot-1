const config = require("./configs.json")
const Discord = require("discord.js");
const fs = require("fs");

var servers = {};
var bot = new Discord.Client();

const Logger = {
	time() {
		let time = new Date()
		return `[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]`
	},
	log(message) {
		console.log(this.time() + message);
	},
	warn(message) {
		console.warn(this.time() + message);
	},
	error(message) {
		console.log(this.time() + message);
	},
	rawLog(message) {
		console.log(message);
	}
	
}

//Quando iniciar
bot.on("ready", () => {
	Logger.log("\n--------------------------Iniciado--------------------------\n");
	//Mostrar os servers no electron
	bot.user.setActivity(config.key+"help");
})


//Receber uma mensagem
bot.on("message", message => {
	if (!message.content.startsWith(config.key)) return;
	if (message.author.bot) return;
	//Configuração do server
	if (!servers[message.guild.id]) servers[message.guild.id] = {
		music: {playlist: [], dispatcher: null, playingMusic: null, lastMessage: null},
	};
	
	try {
		let args = message.content.slice(config.key.length).trim().split(/ +/g);
		let command = args.shift().toLowerCase();
		let server = servers[message.guild.id];
		//Verifica se o comando existe e o roda
		if (fs.existsSync(`./commands/${command}.js`)) {
			require(`./commands/${command}.js`).run(bot, message, args, server, Logger);
		}
	}
	catch (err) {
		Logger.log(err);
	}
});


//Disconectado
bot.on("disconnect", e => {
	Logger.log(`Bot disconectado: ${e}`);
})

//Reconectar as webSockets se a internet cair
bot.on("resume", replayed => {
	Logger.log(`reconectado ${replayed} webSockets`);
})

//Tentando reconectar o bot
bot.on("reconnecting", () => {
	Logger.log("Reconectando o bot");
})

//Erro no bot
bot.on("error", err => {
	Logger.log(`Erro ${(err.name)? err.name : "indefinido"}:\n ------${err.message}-----\n ${(err.stack)? err.stack : ""}`);
})

//Avisos no bot
bot.on("warn", warn => {
	Logger.warn("Atenção:\n" + warn);
})

//Logar o Bot
bot.login(config.token);