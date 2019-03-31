const configs = require("../configs.json");

exports.run = ({message, servers, Logger}) => {
    if (message.author.id != configs.admins[message.author.username]) return;

    let send = "Servers:\n";
    for (let i of servers) {
        send += `   ${i.name} + ID: ${i.id}\n`
    }
    Logger.log(send);
    message.reply(send);
}