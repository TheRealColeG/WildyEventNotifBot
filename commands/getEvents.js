const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getEvents')
        .setDescription('(Un)enrolls you in receiving event notifs from the bot')
}