/**
 * Empty memes, empty dreams
 * This idea is dunzo. Use /tenor instead
 */

//WOT THE BLOODY HELL
//WOT IS THIS
// get out of me swamp
// this is to get emotes from legacy land
//NAH GF

// ok deleting all deez files

const { MessageAttachment, MessageEmbed } = require("discord.js")
const axios = require('axios')

module.exports = {
  name: "emotes",
    emote: async (msg) => {
      const emoteEmbed = new MessageEmbed().setImage("https://c.tenor.com/qMZe3e1Er7EAAAAC/example.gif")
      
      msg.channel.send({
        embeds: [emoteEmbed]
      })
      /*// get emote name
      const msgArray = msg.toString().split(' ')

      if (msgArray == null || msgArray.length < 2) {
        msg.channel.send("Error parsing emote. Use '.emote (name)'")
        return
      }

      let emoteName = msgArray[1]
      
      const globalEmotesURL = "https://api.betterttv.net/3/cached/emotes/global"

      // await for sean not to be a pleb
      try {
        const res = await axios.get(globalEmotesURL)
        const data = await res.data

        // Search for emote name given by the user and grab the id

        const emote = data.find(e => e.code == emoteName)

        getImage(msg, emote.id)

        // throw new Error("Emote isn't a global emote")
        
      } catch(e) {
        msg.channel.send("Error getting emote with command " + msg + ". " + e)
      }*/
    }
};

// Lookup img from ID, convert to base64 string and send to discord
async function getImage(msg, id) {
  const emoteImgURL = "https://cdn.betterttv.net/emote/" + id + "/1x"

  /*try {
    // don't get json
    // then read the img into a base64 string

    const res = await axios.get(emoteImgURL, { responseType: 'arraybuffer' })

    // remove data:image/png;base64 from the beginning
    
    // convert response to binary
    // get nintendo 64 of the binary data

    const buffer = new Buffer.from(res.data, 'binary').toString('base64')

    const emoteAttachment = new MessageAttachment(buffer, 'emote.jpeg')

    const emoteEmbed = new MessageEmbed()
      .setImage(emoteImgURL)

    // msg.delete()
    msg.channel.send({
      embeds: [emoteEmbed]
    })
    msg.channel.send("https://cdn.betterttv.net/emote/566c9fc265dbbdab32ec053b/1x")
  } catch(err) {
    msg.channel.send("Error retrieving emote. " + err)
  }*/

  //msg.channel.send(emoteImgURL)

  const emoteEmbed = new MessageEmbed().setImage("https://c.tenor.com/qMZe3e1Er7EAAAAC/example.gif")
  msg.channel.send({
    embeds: [emoteEmbed]
  })
}
