const configs = require("../configs.json")
const fs = require("fs");

exports.run = (_bot, message, args, _server, Logger) => {
	if (!args[0]) return message.reply("Presisa-se de 1 argumento");
	if (message.author.id == configs.admins[message.author.username])
		try {
			Logger.log(`Tentando recarregar ${args[0]}`)
			if (fs.existsSync(`./commands/${args[0]}.js`)) {
				delete require.cache[require.resolve(`./${args[0]}.js`)];
				Logger.log("Cache recarregado com sucesso!")
				message.reply("Cache recarregado com sucesso!")
			} else {
				Logger.log("Cache inexistente!")
				message.reply("Cache inexistente!")
			}
			
		}
		catch (err) {
			message.reply("Erro ao recarregar!")
			Logger.log(err);
		}
	else
		message.reply("Você não tem permição para acessar este comando");
}