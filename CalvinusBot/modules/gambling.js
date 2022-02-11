/**
 * Coin flip
 * Choose YUB or NUB and wager amount
 * 
 * no testing needed this will work 100% trust me, no cap
 * ALEX THE MALEX GALEX
 * need to separate bank db functionality with gambling functions
 */

const Database = require("@replit/database")

module.exports = {
  name: "twoUp",
    twoUp: async (msg) => {

      // check arguments
      const bet = getBet(msg)

      const coinFace = bet[0]
      let wager = null

      try {
        wager = Number(bet[1])
      } catch {
        msg.channel.send("Wager")
      }

      const user = msg.author.id

      if (coinFace === null || wager === null) {
        return
      }

      const coins = await getUserCoins(msg, user)

      // check if user has enough coins for wager
      if (coins - wager < 0) {
        msg.channel.send("Unable to place wager of " + wager + ". You have " + coins + " Penthouse Coins in your account")

        return
      }

      const result = twoUpGame(coinFace)

      payout(msg, user, result, coinFace, wager, coins)
    },
    bank: async (msg) => {
      // check bank balance
      const user = msg.author.id

      const coins = await getUserCoins(msg, user)
  
      msg.channel.send("You have " + coins + " Penthouse coins in your account")
    },
    tradeCoins: async (msg) => {
    const msgArray = msg.toString().split(' ')

    // check arguments
    if (msgArray.length < 3 || msgArray.length > 4) {
      msg.channel.send("Error parsing command. Trade cancelled. Use '.tradeCoins (@user) (amt)'")
    }

    const user = msg.author.id

    // get user mentioned in trade
    const tradeTo = msg.mentions.members.first().id

    const amt = Math.abs(Number(msgArray[2]))

    const coins = await getUserCoins(msg, user)

    if (coins - amt < 0) {
      msg.channel.send("Unable to trade " + amt + " coins. You have " + coins + " Penthouse Coins in your account")

      return
    }

    // remove coins from user that initiated the trade
    alterUserCoins(msg, user, -(amt))

    // give coins to user specified
    alterUserCoins(msg, tradeTo, amt)
  },
  lottery: async (msg) => {
    // get 7 random rows of 7 numbers
    // payouts will be dank, divisions 1-5 will be profitable, 6-7 will earn some money back
  }
};


function getBet(msg) {
  const msgArray = msg.toString().split(' ')

  if (msgArray.length < 3 || msgArray.length > 4) {
    msg.channel.send("Error parsing command. Bet cancelled. Use '.twoUp (yub/nub) (wager)'")
    return null
  }

  const coinFace = msgArray[1].toLowerCase()  

  if ((coinFace != "yub" && coinFace != "nub") || isNaN(wager)) {
    msg.channel.send("Error parsing command. Bet cancelled. Use '.twoUp (yub/nub) (wager)'")
    return null
  }
  
  // return yub/nub and wager
  return [coinFace, Number(msgArray[2])]
}


function twoUpGame(coinFace) {
  // 50% odds if lower than 0.5 round down, otherwise round up
  const flip = (Math.random() >= 0.5) ? 1 : 0

  // determine game outcome
  if (flip === 0 && coinFace === "yub") {
    return true
  } else if (flip === 1 && coinFace === "nub") {
    return true
  }

  return false
}

// inform user of the outcome and make changes to the db
async function payout(msg, user, result, coinFace, wager, coins) {
  if (result) {
    // payout wager amount
    await alterUserCoins(msg, user, wager)

    msg.channel.send("YOU HAVE WON! - Coin was " + coinFace + ". You have " + coins + " (+" + wager + ") Penthouse coins in your account.")
  } else {
    // deduct wager amount PLEBE
    await alterUserCoins(msg, user, -(wager))

    msg.channel.send("BETTER LUCK NEXT TIME - You have " + coins + " (-" + wager + ") Penthouse coins in your account.")
  }
}


async function getUserCoins(msg, user) {
  const db = new Database()
  const key = "coins." + user

  // if user already has an account return the amount
  const coins = await db.get(key)
  
  if (coins === null) {
    // if key doesn't exist create key for user with initial value of 10000
    const initAmt = "10000"
    
    await db.set(key, initAmt)

    msg.channel.send("WELCOME TO PENTHOUSE GAMBLING! Your Penthouse bank account has been created successfully and 10000 Penthouse Coins has been deposited to it. Thanks for joining Penthouse Gambling.")

    return initAmt
  }

  return Number(coins)
}


// add wager amount to users coins
async function alterUserCoins(msg, user, wager) {
  const db = new Database()
  const key = "coins." + user

  // get amount of user's coins and add the wager
  const coins = await getUserCoins(msg, user)
  
  // store difference
  await db.set(key, (coins + wager).toString())
}
