const fs = require("fs")

exports.run = ({message, args, Logger}) => {
	let info = "";


	//Mostrar todos os comandos
	if (!args[0]) {

		info = "Comandos:\n"
		//Ler todos os arquivos da pasta commands
		fs.readdir("./commands", (err, files) => {
			if (err) return Logger.log(err);

			//Ler o help dos comandos
			for (n in files) {
				let file = files[n];
				if (!file.endsWith(".js")) continue;
				let fileCach = require(`./${file}`);
				if (fileCach.help) {
					info += "  -**" + file.split(".")[0] + "**: " + fileCach.help["description"] + "\n";
				}
			}
			message.reply(info);
			if (message.deletable) message.delete();
		});
		
	//mostrar tudo de um unico comando
	} else {
		fs.exists(`./commands/${args[0]}.js`, exists => {
			if (!exists)
				return message.reply(`O comando ${args[0]} não existe!`)
			else {
				let fileCach =  require(`./${args[0]}`)
				if (fileCach.help) {
					info = "**" + args[0] + "**:\n";
					info += "  -**Descrição**:" + fileCach.help["description"] +
						"\n  -**Uso**:" + fileCach.help["use"];
				} else {
					info = (`O comando ${args[0]} não existe!`);
				}
			}
			message.reply(info);
			if (message.deletable) message.delete();
		});
	}
	
		
}

exports.help = {
	"description": "Mostra uma lista e as informações dos comandos",
	"use": "help (commando)"
}
