
exports.run = (bot, message, args, server) => {
    if (!args[0])
        return message.channel.send("Precisa-se de uma pergunta")
    
    let frases = [
        "Sim",
        "Não",
        "Hamburguer",
        "Claro que não",
        "Não sei",
        "Claro que Sim",
        "Acho que não",
        "Acho que sim",
        "Não posso te contar",
        "Como você descobriu isso",
        "Eu não fui criado pra responder esse tipo de pergunta",
        "Que tipo de pergunta é essa?",
        "Tenho que pensar sobre isso",
        "Vai perguntar pro Google",
        "Isso é uma pergunta?",
        "Tem certeza que você quer saber disso?",
        "Isso é novidade pra mim",
        ":thinking:",
        "É claro! :kissing_heart:",
        "Pq eu continuo respondendo essas perguntas :weary:"
    ]


    let random = Math.round(Math.random()*(frases.length-1));
    message.channel.send(`:crystal_ball: **A bola de cristal responde**:\n  ${frases[random]}`);
}


exports.help = {
    "description": "Responde uma pergunta",
    "use": "ask [pergunta]"
}