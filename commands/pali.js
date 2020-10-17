const Discord = require('discord.js');
module.exports = {
    name: 'pali',
    description: 'I mostly provide help on how to use the bot',
    aliases: ['palibot'],
    execute(message, args) {
      const msg = message.content.toLowerCase();

      if (msg.includes('help')){
        var titre = "Nyaa ! I'm the palibot !";
  			const embed = new Discord.RichEmbed()
  		  .setTitle(titre)
  		  .setColor("RANDOM")
  		  .setDescription("I'm here to help you hunt big meownsters ! :smiley_cat: ")
        .addBlankField(true)
  		  .addField("How to use me.",
  		    "```info <monster>```makes me display one monster's weaknesses, ailments, and a\nrandom trivia. The command `weak <monster>` also works.\n Please note that I can understand partial monster names (`weak jho` will display information about deviljho!)\nI can also pm you the message if you don't wanna spam with the commands `pmweak <monster>` and `pminfo <monster>`")
        .addBlankField(true)
  		  .addField("What if I can't find the meownster ?", "Maybe you typed the meownster's name wrong.\nI can understand for instance `info yIAN Kut-KU` or `info yian`\nbut I can't understand `info yian kut ku` because of the missing hyphen.\n\n"
        +"Otherwise, maybe it's a bug. If you want to see it fixed, please pm [/u/yasefumi](https://www.reddit.com/message/compose/?to=Yasefumi) on reddit :)\n **Please note that due to finiancial issues, the bot might be offline last days of every months**")

  		  .addBlankField(true)
  		  .addField("What if I was a good bot ?", "You can pet me with the command ```pali pet```");
        embed.setThumbnail('https://ih0.redbubble.net/image.98407351.3167/st%2Csmall%2C215x235-pad%2C210x230%2Cf8f8f8.lite-1u2.jpg');
        try {console.log(`${message.guild.name}` + ` (${message.guild.memberCount} users) ${message.author.username} needed help.`)} catch(e) {
        console.log(`${message.author.username} needed help. (dm)`);
    }
  		  message.channel.send({embed});
		  }
      if (msg.includes('pet')){
        message.channel.send('Thank you Meowster *purr purr*')
          try {console.log(`${message.guild.name}` + ` (${message.guild.memberCount} users) ${message.author.username} has pet me.`)} catch(e) {
          console.log(`${message.author.username} has pet me. (dm)`);
      }
      }
      if (msg.includes('emojis')){
        message.delete();
        var emo = msg.indexOf('emojis')+7;
        var final_msg = ``;
        var nbr =1;

        try {nbr = Number(msg.substring(emo,msg.length)) } catch (e) {
          console.log("error", e)
        }
        console.log(nbr)
        for (var i=0; i < nbr; i++){
          var emoj = client.emojis.random();
          if (!emoj.animated){
            emoj = client.emojis.random();
          }
          final_msg += `${emoj}`;
        }
        message.channel.send(final_msg)
      }
      else if (msg.includes('emoji')){
        message.delete();
        var emoj = client.emojis.random();
        if (!emoj.animated){
          emoj = client.emojis.random();
        }
        message.channel.send(`${emoj}`)
      }
    }
}
