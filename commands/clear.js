exports.run = ({message, args}) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
       return message.reply("Você não tem permição para isso");

    if (!args[0])
        return message.channel.send("Precisa-se de um número");
    let number = parseInt(args[0])
    if (!number)
        return message.channel.send(`${args[0]} não é um número`);
    if (number > 100)
        return message.channel.send("Limite exedido");
       

    
    

    message.channel.bulkDelete(number);

}

exports.help = {
    "description": "Deleta mesagens do canal",
    "use": "clear [número de mensagens (max. 1000)]"
}