const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Avertir un membre (envoie un DM + log dans le salon)')
    .addUserOption(o => o.setName('membre').setDescription('Membre à avertir').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison de l\'avertissement').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('membre');
    const reason = interaction.options.getString('raison');

    await target.send(`⚠️ Tu as reçu un avertissement sur **${interaction.guild.name}**.\nRaison : ${reason}`).catch(() => null);
    await interaction.reply(`⚠️ **${target.tag}** a été averti. Raison : ${reason}`);
  },
};
