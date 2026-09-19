const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Rendre un membre muet temporairement (timeout)')
    .addUserOption(o => o.setName('membre').setDescription('Membre à mute').setRequired(true))
    .addIntegerOption(o => o.setName('minutes').setDescription('Durée en minutes').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('membre');
    const minutes = interaction.options.getInteger('minutes');
    const reason = interaction.options.getString('raison') || 'Aucune raison fournie';
    const member = interaction.guild.members.cache.get(target.id);

    if (!member || !member.moderatable) {
      return interaction.reply({ content: '❌ Impossible de mute ce membre.', ephemeral: true });
    }

    await member.timeout(minutes * 60 * 1000, reason);
    await interaction.reply(`🔇 **${target.tag}** est mute pour ${minutes} min. Raison : ${reason}`);
  },
};
