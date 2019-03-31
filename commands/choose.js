exports.run = ({message, args}) => {
    
    let alt = args.join(" ").split(/ *\| */g).filter(val => {return val}); //Alternativas
    
    if (!alt[1])
        return message.channel.send("Precisa-se de 2 alternativas");
        

    let random = Math.round(Math.random()*(alt.length-1));

    message.channel.send(`:game_die: Caiu **${random+1}**, logo a resposta é **${alt[random]}**`);


}


exports.help = {
    "description": "Escolhe uma das alternativas",
    "use": "choose [Alternativa 1 | Alternativa 2 | ...]"
}