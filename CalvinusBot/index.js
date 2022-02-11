////globals
const Discord = require("discord.js");
const { Intents } = require("discord.js");
const spawn  = require("child_process").spawn()
// discord.js v13 needs Intents
// https://discord.com/developers/docs/topics/gateway#gateway-intents
// https://discordjs.guide/additional-info/changes-in-v13.html
const client = new Discord.Client({partials: ["CHANNEL"], intents: [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_VOICE_STATES,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.DIRECT_MESSAGES, 
  Intents.FLAGS.DIRECT_MESSAGE_TYPING
  ]})

//const keepAlive = require("/server.js")
const music = require('./modules/music.js');
const ting = require('./modules/ting.js')
// const emotes = require('./modules/emotes.js')
const utility = require('./modules/utility.js')
const gambling = require('./modules/gambling.js')
const bass = require('./modules/bass.js')

//peethon
const childPython = spawn('python',["./brain.py"])

const musicCmd = [
  '.play',
  '.pause',
  '.skip',
  '.stop',
  '.emote',
  '.clear'
]

client.on("ready", ()=>{
  client.user.setPresence({
    activities: [{name: "Serving the Roman Republic"}],
    status: 'online'
  })
})
// 0161 MESSAGE ON THA MAP
client.on("message", msg=>{
  //DM CHANNEL RESPONSES

  let cmdString = msg.content.split(" ")[0];

  if(msg.channel.type === 'DM'){
    console.log(msg.content)
  }
  
  if(musicCmd.includes(cmdString)){
      music.play(msg, client)
  }
  
  if(msg.content.startsWith('.test')) {
      childPython.stdout.on('data', (data) =>{
        console.log(data.toString())
      })
  }

  if(msg.content.startsWith('.cm')) {
    ting.cm(msg)
  }

  if(msg.content.startsWith('.mm')) {
    ting.mm(msg)
  }

  if(msg.content.startsWith('.simp')) {
    ting.simp(msg)
  }

  /*if(msg.content.startsWith('.emote')) {
    emotes.emote(msg)
  }*/

  if(msg.content.startsWith('.dm')){
    utility.dmUser(msg)
  }

  if(msg.content.startsWith('.info')){
    utility.guildInfo(msg, client)
  }

  if(msg.content.startsWith('.weather')){
    utility.openWeather(msg)
  }

  if(msg.content.startsWith('.news')){
    utility.covidNews(msg)
  }

  if(msg.content.startsWith('.stock')){
    utility.stocks(msg)
  }

  if(msg.content.startsWith('.twoUp')){
    gambling.twoUp(msg)
  }

  if(msg.content.startsWith ('.bank')){
    gambling.bank(msg)
  }

  if(msg.content.startsWith ('.tradeCoins')){
    gambling.tradeCoins(msg)
  }


  // console.log(new Bass().getType())

})

//keepAlive()
client.login(process.env.TOKEN)