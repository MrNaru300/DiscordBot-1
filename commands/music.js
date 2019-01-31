const ytdl = require("ytdl-core");
const httpRequest = require("../utilits/httpRequest.js");
const configs = require("../configs.json");


exports.run = async (bot, message, args, server, Logger) => {
	
	let sM = server.music;

	//Toca uma musica
	function play (connection, sM) {
		let music = sM.playlist.shift();
		sM.playingMusic = music;
		sM.dispatcher = connection.playStream(ytdl(music.url, {filter: "audioonly"}));
		//Cria um event handler quando acaba a musica
		sM.dispatcher.on("end", () => {
			if (sM.playlist[0]) 
				play(connection, sM);
			else {
				sM.playingMusic = null;
				sM.dispatcher = null;
				connection.disconnect();
			}
		
		})
		
	}

	//Adiciona as musicas na playlist
	async function AddMusic(url) {
		if (sM.playlist.length >= 100)
			return false;
		await ytdl.getBasicInfo(url, (err, info) => {
			if (err) {
				AutoDelete(message, "Erro ao adicionar a música",sM);
				Logger.log(err);
				return false;
			}
			if (info.status !== "ok") return AutoDelete(message, "Não foi possivel baixar o video. Status:" + info.status, sM);

			let basicInfo = {
				title: info.title,
				url: info.video_url,
				baseURL: info.baseUrl,
				id: info.video_id,
				name: info.title,
				author: info.author
			}

			sM.playlist.push(basicInfo);
			
		});
		return true;
	}
	
	//Deletar as mesnagens de musica
	async function AutoDelete (send, timeOut = 20) {
		let sended = await message.channel.send(send);
		setTimeout( (sended) => {if (sended.deletable) sended.delete()}, timeOut*1000, sended);
		if (message.deletable) message.delete();
		return;
	}
	
	
	//Listar todas as musicas
	function ListMusics() {
		let reply = {
			"embed": {
				"author": {
					"name": "Lista de Músicas",
					"icon_url": "https://yt3.ggpht.com/a-/AAuE7mCRnX1QiX2U8rv05JW4zbaJMB80Y5eWI1HfTg=s900-mo-c-c0xffffffff-rj-k-no"
				  },
				"description": "-------------------",
				"footer": {"text": "Digite help para mostra a lista de comandos"},
				"color": 15214375,
				"fields": [ 
				  ]
			}
		};
		//Tem musica na play list
		if (sM.playlist[0]) {
			reply.embed.fields[0] = {
				"name": "Lista de Músicas",
				"value": ""
			};
			for (let i in sM.playlist) {

				let text = (sM.playlist[i].title.length < 60)? `**${parseInt(i)+1}: ${sM.playlist[i].title}**\n`: `**${parseInt(i)+1}: ${sM.playlist[i].title.substring(0, 60)}...**\n`;
				
				
				if ((reply.embed.fields[0].value + text).length > 1024) {
					reply.embed.fields[1] = {
						"name": "...",
						"value": `*Mais ${sM.playlist.length-parseInt(i)} músicas*`
					};
					break;
				} 
				reply.embed.fields[0].value += text;
			}
			
		}
		//Tem musica tocando
		if (sM.playingMusic) {
			reply.embed.fields.unshift( {
				"name": "Música tocando:",
				"value": `**${sM.playingMusic.title}**`
			});
		}
		//Não tem musica tocando e nenhuma na playlist
		if (!sM.playlist[0] && !sM.playingMusic) {
			reply.embed.fields[0] = {
				"name": "Lista de Músicas",
				"value": "Nenhuma música na Playlist"
			};
		}

		//Mostrar a lista e deletar a mensagem do usuário
		AutoDelete(reply, 120);

	}






	//Verificar se contem um comando
	if (!args[0])
		return message.channel.send("Precisa-se de um commando");
	
	//comandos de musica
	switch (args[0].toLowerCase()) {

		//tocar a musica
		case "p":
		case "play" :
			if (sM.playingMusic) {
				return ListMusics();
			}
			if (!sM.playlist[0])
				return ListMusics();
			if (!message.member.voiceChannel) {
				return AutoDelete("Você precisa estar em um canal de voz");
			}
			//Conectar a sala de voz
			if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {	
				play (connection, sM);
				ListMusics();
			}).catch((err) => {
				AutoDelete("Erro ao conectar a sala");
				Logger.log(err);
			})
			
			break;
		
		//adicionar uma musica a playlist
		case "+":
		case "a":
		case "add":
			if (!args[1])
				return AutoDelete("Precisa-se de uma URL do youtube");
			if (!ytdl.validateURL(args[1]))
				return AutoDelete("Formato da URL incorreto");
			
			//tags da url do youtube
			let tags = args[1].split("?")[1].split("&");

			let temp = []
			for (let tag of tags) {
				let split = tag.split("=");
				temp[split[0]] = split[1];
			}
			tags = temp;

			//Verifica se é uma playlist
			if (tags["list"]) {

				//API do youtube para playlists
				httpRequest(`https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${tags["list"]}&key=${configs.ytKey}`)
				.catch((err) => {AutoDelete("Video não encontrado")})
				.then( async (playlist) => {
					if (playlist.errors)
						return AutoDelete("Video não encontrado");
					playlist = JSON.parse(playlist);
					for (let video of playlist.items) {
							await AddMusic("https://www.youtube.com/watch?v="+video.contentDetails.videoId);
					}
					AutoDelete("Playlist adicionada", 10);
				});
			
				
			} else if (tags["v"]) { //Verifica se é um único video
				await AddMusic(args[1]);
				ListMusics();
			} else {
				AutoDelete("Video não encontrado");
			}
			break;
		
		//remover uma musica da playlist
		case "-":
		case "r":
		case "remove" :
			if (!args[1])
				return AutoDelete("Precisa-se do número da música na playlist");
			let index = parseInt(args[1])
			if (!index)
				return AutoDelete("Precisa ser um número");
			if (index > sM.playlist.length || index < 1)
				return AutoDelete("Essa música não existe");

			ListMusics();
			
			break;
		
		//ir para a proxima musica
		case "n":
		case "next":
		case "sk":
		case "skip":
			if (sM.playingMusic)
				sM.dispatcher.end();
			else 
				sM.playlist.shift();
				ListMusics();
			break;
		
		//deletar a playlist
		case "q":
		case "quit" :
			if (sM.lastMessage && sM.lastMessage.deletable) sM.lastMessage.delete();
			if (message.deletable) message.delete();

			
			sM.playlist = [];
			if (sM.playingMusic)
				sM.dispatcher.end();
				
			sM.lastMessage = await ListMusics();

			
			break;
		case "s":
		case "stop":
			if (!sM.playingMusic)
				AutoDelete("Nenhuma música na lista");
			sM.playlist.unshift(sM.playingMusic);
			break;
		//listar as musicas na playlist
		case "l":
		case "list":
			ListMusics();
			break;

		default:
			message.reply("comando não encontrado");
			if (message.deletable) message.delete();
			return;
	}

}

exports.help = {
	"description": "Toca uma playlist de músicas",
	"use": "play\n  	add [URL da musica do youtube]\n 	 remove [número na playlist]\n 	 skip\n 	 stop\n		list"
}