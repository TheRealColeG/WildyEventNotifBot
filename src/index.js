const { Client, IntentsBitField, REST, Routes } = require('discord.js');
const config = require('./config.json');

//Remember to add the intents you need!!!!!!!!!!!!
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,

    ]
});

//When the bot is online, it'll log this message
client.on('ready', (c) => {
    console.log(`Logged in as ${c.user.tag}!`);
} );

/*
When the bot sees a message in any of the servers that it is in (that it has access to), 
it'll log the username of the author of the message (as of right now - might change later if needed) */
client.on('messageCreate', (msg) => {
    //So bot doesn't reply to itself/other bots - feedback loop
    if (msg.author.bot) {
        return;
    }

    //Logs the message in the console
    console.log(msg.author.username + ": " + msg.content);

    //If the message starts with "ping", bot will reply with "pong"

});

//When the user types in a command, bot will take appropriate action
client.on('interactionCreate', async interaction => {
    //If the interaction is a DM command, ignore it - I think
    if (!interaction.isChatInputCommand()) return;

    //If command is getevents, give/remove user wildy event role
    if (interaction.commandName === 'getevents') {
        //if user doesnt have the wildy event role, give it to them and reply
        if (!interaction.member.roles.cache.some(role => role.name === 'Wildy Events')) {
            try {
                await interaction.member.roles.add(config.WILDY_ROLE_ID);
            } catch (error) {
                console.error(`Failed to add role: Events - ${error}`);
            }
            await interaction.reply('User enrolled in event notifications.');
        //if user has the wildy event role, remove it and reply
        } else {
            try {
                await interaction.member.roles.remove(config.WILDY_ROLE_ID);
            } catch (error) {
                console.error(`Failed to remove role: Events - ${error}`);
            }
            await interaction.reply('User unenrolled from event notifications.');
        }
    };
});

client.once('ready', async () => {

    console.log('Ready!');

    //Create timer for wildy events
    //use timer.js for events
    const timerFile = require('./timer.js');

    minsToWait = -1;
    
    //make this function wait until the scraper is done


    //If there are events, set the timer
    //Have to wait for timer to get events
    timerFile.timer.then((event) => {
        //If there are no events, don't set the timer obviously - maybe send a message to the channel saying chungus
        if (event == null) {
            console.log("No events found / timer function failed.");
            return;
        }
        
        //Check current time and set time to wait
        const currentTime = (new Date()).getMinutes();

        if (currentTime < 45) {
            minsToWait = 45 - currentTime;
        } else if (currentTime > 45) {
            minsToWait = 105 - currentTime;
        } else {
            minsToWait = 0;
        }

        if (minsToWait == -1) {
            console.log("Time to wait not set.");
            return;
        }

        //Notify users with wildy event role that event is starting soon
        const guild = client.guilds.cache.get(config.BOT_TEST_GUILD_ID);
        if (!guild) return console.log("Guild not found.");
        const role = guild.roles.cache.find(role => role.name === 'Wildy Events');
        if (!role) return console.log("Role not found.");
        const channel = guild.channels.cache.get(config.BOT_TEST_TEXT_CHANNEL_ID);
        if (!channel) return console.log("Channel not found.");

        channel.send(`${role.toString()} ${event.name} starting in ${event.in} minutes!`);
        console.log("Timer set for " + minsToWait + " minutes.");
    });

    

    //Wait for timeToWait minutes
    /*
    await new Promise(r => setTimeout(r, minsToWait*60*1000));

    //Notify users with wildy event role that event is starting soon
    const guild = client.guilds.cache.get(config.BOT_TEST_GUILD_ID);
    const role = guild.roles.cache.find(role => role.name === 'Wildy Events');
    const channel = guild.channels.cache.get(config.BOT_TEST_TEXT_CHANNEL_ID);

    channel.send(`${role.toString()} Wildy event starting in 15 minutes!`);
    */
});

//Logs bot in using token from loginToken.json (which is gitignored)
client.login(config.TOKEN);


