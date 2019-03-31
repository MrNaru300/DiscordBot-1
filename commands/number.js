exports.run = ({message, args}) => {

    let nums = args.join("").split(/\s*-\s*/);
    let output = 0;

    //Verifica se tem tem entre 1 e 2 números
    if (nums.length > 2) {
        message.reply("Não pode usar mais de 2 números");
        if (message.deletable) message.delete();
        return;
    }

    
    //Verifica se realmente é um número
    for (let i in nums) {
        nums[i] = parseInt(nums[i]);
        if (isNaN(nums[i])) {
            message.reply("Isso não é um número");
            if (message.deletable) message.delete();
            return; 
        }
    }

    //Colocar os valores em em ordem crescente
    nums = nums.sort()
    
    if (nums.length == 1) {
        nums.unshift(0);
    }
        
    //Sortear os números
    output = nums[0] + Math.round(Math.random()*(nums[1]-nums[0]));

    message.channel.send(`:game_die: Entre **${nums[0]}** e **${nums[1]}**, caiu **${output}**`);
    if (message.deletable) message.delete();
    return;


}

exports.help = {
	"description": "responde com um número aleatório",
	"use": "number [número]-[número]"
}