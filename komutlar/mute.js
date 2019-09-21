const Discord = require("discord.js");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {

  //!tempmute @user 1s/m/h/d

  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!tomute) return message.reply("Muteleyeceğin Kişiyi Yaz.");
  const mod = message.author;
  if(tomute.hasPermission("ADMINISTRATOR")) return message.reply("You need permissions for use this command.");
  const modlog = message.guild.channels.find(channel => channel.name === 'mute-banned-kicked-logs');
  let muterole = message.guild.roles.find(`name`, "Muted");
  //start of create role
  let muteChannel = message.guild.channels.find(`name`, "mute-logs");
  if (!muteChannel) return message.channel.send('**Lütfen mute-logs İsimli Bir Kanal Aç.`**')
  if (!muterole) {
      try{
      muterole = await message.guild.createRole({
        name: "Muted",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  //end of create role
  let mutetime = args[1];
  if(!mutetime) return message.reply("Ne Kadar Süreyle Muteleyeceğini Yaz.");

  await(tomute.addRole(muterole.id));
  const muteembed = new Discord.RichEmbed()
          .setAuthor(' Action | Mute', `https://images-ext-2.discordapp.net/external/Wms63jAyNOxNHtfUpS1EpRAQer2UT0nOsFaWlnDdR3M/https/image.flaticon.com/icons/png/128/148/148757.png`)
          .addField('User', `<@${tomute.id}>`)
          .addField('Time', `${ms(ms(mutetime))}`)
          .addField('Staff_Member', `${mod}`)
          .setColor('#0d05ff')
          .setFooter("Aloikn", "https://cdn.discordapp.com/avatars/453870812311584779/72734a7ab1876a3d63e565e70f378fc2.png?size=2048")
          modlog.send(muteembed)
          
          setTimeout(function(){
            tomute.removeRole(muterole.id);
            message.channel.send(`<@${tomute.id}> has been unmuted!`);
          }, ms(mutetime));
}

exports.conf = {
  aliases: [],
  permLevel: 2
};


module.exports.help = {
  name: "mute"
 
}