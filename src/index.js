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

    //Set bot's status to "Playing Runescape" 
    client.user.setActivity("Farts", { type: "Sucking" });

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

    //call the waitUntilQuarterTo function
    waitUntilQuarterTo();
});

//Logs bot in using token from loginToken.json (which is gitignored)
client.login(config.TOKEN);

//this will be called when the bot is ready
//It checks if it is quarter to the hour
//THAT IS IT!!!
async function waitUntilQuarterTo() {

    minsToWait = -1;
        
    //Check current time and set time to wait
    const currentTime = (new Date()).getMinutes();

    //Have to maneuver around the 0-59 minute clock cycle
    if (currentTime < 45) {
        //check for event in 1-45 mins
        minsToWait = 45 - currentTime;
    } else if (currentTime > 45) {
        //check for event in 46-59 mins
        minsToWait = 105 - currentTime;
    } else {
        //check for event now
        minsToWait = 0;
    }

    //Honestly I don't think this can/will ever happen but just in case, right?
    if (minsToWait == -1) {
        console.log("Time to wait not set.");
        return;
    }

    console.log("Time to wait: " + minsToWait + " minutes.");
    
    //wait until 45, then check for event every hour
    await(new Promise(resolve => setTimeout(resolve, minsToWait * 60 * 1000)).then(() => {
        //call every hour
        console.log(`Calling checkForEvent every hour now: ${(new Date()).getMinutes()}`)
        //initial call to checkForEvent, then again every hour (setInterval doesn't call immediately)
        checkForEvent();
        
        setInterval(checkForEvent, 60 * 60 * 1000);
    }));
    
}

//Call this function once it is quarter to the hour
//It will check if there's a wildy event <= 15 away
//If there is, it will notify users with the wildy event role
//Secondly, it will notify users when it is 5 minutes away
//If not, it will end so it can be called again at quarter to the next hour
function checkForEvent() {

    //Create timer for wildy events
    //use timer.js for events
    const timerFunc = require('./timer.js');

    //call the timer function, wait for it to finish
    timerFunc().then((event) => {
        //If there are no upcoming events, don't set the timer obviously
        if (event == null) {
            console.log("Event not within 15 minutes.");
            return;
        }

        //If we get here, there is an event within 15 minutes
        //Broadcast to server @role that event is starting in 15 minutes
        broadcastEvent(event);
        //DM users with wildy event role that event is starting in 15 minutes
        dmUsersWithRole(config.WILDY_ROLE_ID, `${event.name} starting in ${event.in} minutes!`);
        //wait 10 minutes and notify users that event is starting in 5 minutes
        new Promise(resolve => setTimeout(resolve, 10 * 60 * 1000)).then(() => {
            dmUsersWithRole(config.WILDY_ROLE_ID, `${event.name} starting in 5 minutes!`);
        });
    });

}

async function broadcastEvent(event) {

    //Notify users with wildy event role that event is starting soon
    const guild = client.guilds.cache.get(config.BOT_TEST_GUILD_ID);
    if (!guild) return console.log("Guild not found.");
    const role = guild.roles.cache.find(role => role.name === 'Wildy Events');
    if (!role) return console.log("Role not found.");
    const channel = guild.channels.cache.get(config.BOT_TEST_TEXT_CHANNEL_ID);
    if (!channel) return console.log("Channel not found.");

    channel.send(`${role.toString()} ${event.name} starting in ${event.in} minutes!`);

    //wait 10 minutes and notify users that event is starting in 5 minutes
    await(new Promise(resolve => setTimeout(resolve, 10 * 60 * 1000)).then(() => {
        channel.send(`${role.toString()} ${event.name} starting in ${Number(Number(event.in) - 10)} minutes!`);
    }));
}

/**
 * 
 * @param roleID - numeric ID of the role to get users from
 * @returns a Collection<string, GuildMember> of users with the given role
 */
async function getUsersWithRole(roleID) {

    const guild = client.guilds.cache.get(config.BOT_TEST_GUILD_ID);
    if (!guild) return console.log("Guild not found.");

    const role = guild.roles.cache.find(role => role.id === roleID);
    if (!role) return console.log("Role not found.");
    console.log(role);

    const members = guild.members.fetch().then((members) => {
        return members.filter(member => member.roles.cache.has(role.id));
    });

    console.log(members);

    return members;
}

async function dmUsersWithRole(roleID, message) {
    getUsersWithRole(roleID).then((users) => {
        if (users.size == 0 || users == null || !users) {
            console.log("No users found with role.");
            return;
        }

        users.forEach((user) => {
                console.log(`Sending message to ${user.user.username}`);
                //don't send message to self - crashes bot
                if (user.id !== client.id) {
                    user.send(message);
                }
            }
        )});
};




