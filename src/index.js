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
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'getevents') {
        //if user doesnt have the wildy event role, give it to them and reply
        if (!interaction.member.roles.cache.some(role => role.name === 'Wildy Events')) {
            try {
                await interaction.member.roles.add('1128051399062720625');
            } catch (error) {
                console.error(`Failed to add role: Events - ${error}`);
            }
            await interaction.reply('User enrolled in event notifications.');
        } else {
            try {
                await interaction.member.roles.remove('1128051399062720625');
            } catch (error) {
                console.error(`Failed to remove role: Events - ${error}`);
            }
            await interaction.reply('User unenrolled from event notifications.');
        }
    };
});

//Logs bot in using token from loginToken.json (which is gitignored)
client.login(config.TOKEN);