const { MessageEmbed } = require('discord.js');
const axios = require('axios');

//globals
const copyright = 'Calvinus Bot by Yub Nubs Inc © 2022'
//API KEYS
const APPID = process.env['APPID']//openweather
const NEWSAPI = process.env['NEWSAPI']
const LOGO = process.env['LOGO']
const YHAPI = process.env['YHAPI']

async function fetchUser(id){
  try{
    await msg.guild.members.fetch(id)
  }catch(e){
    return e
  }
  
}

module.exports = {
  name: "utility",
    dmUser: async (msg) =>{
      //msg.author.send('Hi there')
      let searchUser = msg.content.split(' ').slice(1).join(' ')  
      console.log(searchUser)
      try{
        let searchResult = await msg.guild.members.search({query: searchUser})
        if(searchResult.size == 0){
          msg.channel.send('user: '+searchUser+' not found, please try again')
        }else{
          const [firstKey] = searchResult.keys()
          const user = searchResult.get(firstKey)
          user.send("You is noob")
          msg.channel.send('sent user: '+searchUser+' a message')
        }
      }catch(e){
        msg.channel.send('Error: '+e)
      }
      //console.log(msg.guilds.cache)
    },

    //fix owner id
    guildInfo: async (msg, client) =>{
      //console.log(msg.guild)
      let ownerID = msg.guild.ownerId
      let owner = await msg.guild.members.fetch(String(ownerID))
    const serverEmbed = new MessageEmbed()
	  .setColor('#0099ff')
	  .setTitle(msg.guild.name)
	  .setAuthor({ name: 'Owner: '+owner.user.username})
	  .setDescription('Member count: '+msg.guild.memberCount)
	  .addField('Premium Tier: ', msg.guild.premiumTier, true)
    .setImage(LOGO) 

	  .setFooter({ text: copyright});

    msg.channel.send({ embeds: [serverEmbed] })
    },

    //get weather
    openWeather: async (msg) =>{
      let cityName = msg.content.split(' ').slice(1).join(' ')  
      let weatherInfo = new MessageEmbed()
      let weatherData;
      try{
        weatherData = await axios.get('https://api.openweathermap.org/data/2.5/weather?q='+cityName+'&units=metric&appid='+APPID)
      console.log(weatherData)  
	    weatherInfo.setColor('#0099ff')
	    weatherInfo.setTitle(cityName)
	    weatherInfo.setDescription("country: "+weatherData.data.sys.country)
	    weatherInfo.addFields(
		    { name: 'Temp:', value: String(weatherData.data.main.temp)+'C'},
		    { name: 'Feels like:', value:String(weatherData.data.main.feels_like)+'C'},
		    { name: 'Humidity: ', value: String(weatherData.data.main.humidity)},
        { name: 'Weather: ', value:String(weatherData.data.weather[0].main), inline: true },
        { name: 'Description: ', value: String(weatherData.data.weather[0].description), inline: true }
	    )
      weatherInfo.setImage(LOGO)   
	    weatherInfo.setFooter({ text: copyright});
      msg.channel.send({ embeds: [weatherInfo] })
      }catch(e){
        msg.channel.send('Apologies my Imperator, there was an issue fetching weather Info,please check your parameters. error: '+e)
        }
        
      },

    //add daily updates
    //get covid news
    covidNews: async (msg)=>{
      let news;
      let newsEmbed = new MessageEmbed()
      try{
        news = await axios.get('https://gnews.io/api/v4/search?q=covid&country=au&max=1&lang=en&token='+NEWSAPI)
        //console.log(news.data)
        let article = news.data.articles[0]
        newsEmbed.setColor('#0099ff')
        newsEmbed.setTitle(article.title)
        newsEmbed.setURL(article.url)
        newsEmbed.setDescription(article.description)
        newsEmbed.addFields(
		      { name: 'Published at:', value: article.publishedAt},
		      { name: 'News source: ', value: article.source.name},
	      )
        newsEmbed.setImage(article.image)
        newsEmbed.setFooter({ text: copyright});
        msg.channel.send({ embeds: [newsEmbed] })
      }catch(e){
        msg.channel.send('There was an error fetching covid news...error: '+e)
      }
    },
    
    stocks: async (msg) =>{
        let stockResp;
        let stockKey = msg.content.split(' ').slice(1).join(' ')  
        let stocksEmbed =  new MessageEmbed()
        try{
            stockResp = await axios({
              method: 'get',
              url: 'https://yfapi.net/v6/finance/quote?region=AU&lang=en&symbols='+stockKey+'.AX',
              headers:{
                'accept': 'application/json',
                'X-API-KEY': YHAPI
              }
            })

            if(stockResp.data.quoteResponse.result.length === 0){
                msg.channel.send('No such stock found for: '+stockKey)
            }else{
              let stockData = stockResp.data.quoteResponse.result[0]
              stocksEmbed.setColor('#0099ff')
              stocksEmbed.setTitle('Stock Checker for: '+stockData.longName)
              stocksEmbed.addFields(
                {name: 'Market: ', value: stockData.fullExchangeName},
                {name: 'Currency: ', value: stockData.financialCurrency},
                {name: 'Market Day Range: ', value: stockData.regularMarketDayRange},
                {name: 'DAY CHANGE: ', value: String(stockData.regularMarketChangePercent)},
                {name: 'DAY HIGH: ', value: String(stockData.regularMarketDayHigh)},
                {name: 'DAY LOW: ', value: String(stockData.regularMarketDayLow)},
                {name: 'BID: ', value: String(stockData.bid), inline: true},
                {name: 'ASK: ', value: String(stockData.ask), inline: true},
                {name: 'BID SIZE: ', value: String(stockData.bidSize)},
                {name: 'ASK SIZE: ', value: String(stockData.askSize), inline: true}
              )
              stocksEmbed.setImage(LOGO)
              stocksEmbed.setFooter({ text: copyright})

              msg.channel.send({ embeds: [stocksEmbed] })
            }
            
            console.log(stockResp.data.quoteResponse)
        }catch(e){
          msg.channel.send('There was an error fetching stock... error: '+e)
        }
    }
  };
