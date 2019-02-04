const config = require("./configs.json")
const Discord = require("discord.js");
const fs = require("fs");

var servers = {};
var bot = new Discord.Client();

const Logger = {
	logFile: null,
	save(message) {
		//Se o arquivo de log não foi criado, crie um novo
		
		if (!this.logFile) {
			//Se a pasta logs não existe, crie ela
			if (!fs.existsSync("./logs"))
				fs.mkdirSync("./logs", err => {console.log(err)});
			
			let lastLog = 1;
			//Quantos logs tem na pasta
			for (let file in fs.readdirSync(config.paths.logs)) {
				let type = file.split(".");
				if (type == "log");
					lastLog++;
			}
			this.logFile = config.paths.logs + "Log_" + lastLog + ".log";
		}
		//Escrever o Arquivo
		fs.appendFileSync(this.logFile, this.time() + message + "\n");
	},
	time() {
		let time = new Date()
		return `[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]`
	},
	log(message) {
		console.log(this.time() + message);
		this.save(message);
	},
	warn(message) {
		let prefix = "[Warning]";
		console.warn(this.time() + prefix + message);
		this.save(prefix + message);
	},
	error(message) {
		let prefix = "[Error]";
		console.log(this.time() + prefix + message);
		this.save(prefix + message);
	},
	rawLog(message) {
		console.log(message);
		this.save(message)
	}
	
}

//Quando iniciar
bot.on("ready", () => {
	Logger.log("Iniciado");
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