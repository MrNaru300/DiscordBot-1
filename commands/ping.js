const jimp = require("jimp");
const httpRequest = require("../utilits/httpRequest.js");
const fs = require("fs")

exports.run = async (bot, message, args) => {

	fs.mkdirSync("./images/avatars", {recursive:true});
	fs.mkdirSync("./images/pingpong", {recursive:true});

	let userPath = `./images/avatars/${message.author.id}.png`;
	let url = message.author.avatarURL || message.author.defaultAvatarURL;



	await httpRequest(url, userPath, "binary");

	let userImg = await jimp.read(userPath).then(img => { return img.resize(64, 64).quality(10) });

	jimp.read("./images/pingpong.jpg").then(img => {
		img
			.blit(userImg, 473, 9)
			.write(`./images/pingpong/${message.author.id}.png`);
	}).then(() => {
		message.channel.send("Carregando...").then(alt => {
			if (alt.deletable) alt.delete();
			message.channel.send(
			{ files: [`./images/pingpong/${message.author.id}.png`] }
			);
		})
		
	});
}

exports.help = {
	"description": "mostra uma imagem de pingpong com o seu avatar",
	"use": "ping"
}