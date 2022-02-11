const yts = require("yt-search")
const { MessageEmbed } = require('discord.js');
const discordaudio = require('discordaudio');

const copyright = 'Calvinus Bot by Yub Nubs Inc © 2022'
const LOGO = process.env['LOGO']
const audioManager = new discordaudio.AudioManager();
let queue;
let youtubeLink;
let searchString;

module.exports = {
    name: "music",
    play: async (msg, client) =>{
      command = msg.content.split(' ')[0]
      if(!msg.member.voice.channel){
            msg.reply("you are not in a voice channel")
      }else{
        const userChannel = client.channels.cache.get(msg.member.voice.channel.id);
        switch(command){
          case '.play':
                searchString = msg.content.split(' ').slice(1).join(' ') 
                  if(!searchString){
                    msg.channel.send("Imperator, your search query is empty")
                  }else{
                    msg.channel.send("loading your search...")

                    if(!searchString.includes('youtube.com')){
                      let ytResult = await yts(searchString)

                      if(ytResult.all.length === 0){
                        msg.channel.send("No results found, please search again.")
                        break;
                      }
                      
                      youtubeLink = ytResult.all[0].url
                    }else{
                        console.log('hello')
                        youtubeLink = searchString
                    }
                  
                    console.log(youtubeLink)
                    
                    audioManager.play(userChannel, youtubeLink, {
                      volume: 5,
                      audiotype: 'raw'
                    }).then(resp =>{ 
                        if(resp === true){
                            msg.channel.send('Song successfully added to queue')
                        }
                    })
                    .catch(err =>{
                      console.log(err)
                      })
                    
                    console.log("went here")
                    
                    queue = audioManager.queue(userChannel)
                    
                    console.log("it has been queued")
                    const ytEmbed = new MessageEmbed()
                    ytEmbed.setColor('#0099ff')
                    ytEmbed.setTitle('Yub Nubs Music Player')
                    ytEmbed.setDescription('Playlist:')
                    ytEmbed.setImage(LOGO)
                    ytEmbed.setFooter({ text: copyright});  
                    queue.forEach(ytSong =>{
                      if(ytSong.title){
                        ytEmbed.addFields({ name: 'Song', value: ytSong.title })
                      }else{
                        ytEmbed.addFields({ name: 'Song', value: ytSong.url })
                      }
                })
                msg.channel.send({ embeds: [ytEmbed] })
                
              }
            
            break;

          case '.stop':
              if(queue){
                audioManager.stop(userChannel)
                msg.channel.send("stopped music")
              }else{
                msg.channel.send("There is no music playing")
              }
            break;

          case '.pause':
              try{
                audioManager.pause(userChannel)
                msg.channel.send("Music paused")
              }catch(e){
                msg.channel.send("Oops! something went wrong, perhaps music has already been stopped.")
                console.log(e)
              }
            break;

          case '.resume':
              try{
                audioManager.resume(userChannel)
                msg.channel.send("Music Resumed")
              }catch(e){
                msg.channel.send("Oops! something went wrong, perhaps there is already music playing.")
                console.log(e)
              }
            break;

          case '.clear':
            try{
              audioManager.clearqueue(userChannel)
              msg.channel.send("Cleared Queue")
            }catch(e){
              msg.channel.send("Oops! something went wrong, perhaps the queue is already empty.")
              console.log(e)
            }
            break;

          case '.skip':
            if(queue){
              audioManager.skip(userChannel).then(() => console.log(`Skipped song!`)).catch(console.log);
              
            }else{
              msg.channel.send("There are no songs to skip")
            }
              
            break;
          
        }
      }
    }
};