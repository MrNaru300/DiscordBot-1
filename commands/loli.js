exports.run = ({message, Logger}) => {
    function DeleteAlt(message, send) {
        if (send) message.channel.send(send);
        if (message.deletable) message.delete();
        
    }

    if (!message.channel.nsfw)
        return;
    
    message.channel.send("Carregando").then(alt => {
        message.reply({ files: ["./images/loli.gif"] })
        .then(() => {
            DeleteAlt(alt)
        })
        .catch((err) => {
            DeleteAlt(alt, ":oncoming_police_car: A policia descobriu as lolis. CORRE!"); 
            Logger.log(err)
        });
    });
    
}