const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannir un membre')
    .addUserOption(o => o.setName('membre').setDescription('Membre à bannir').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison du bannissement'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('membre');
    const reason = interaction.options.getString('raison') || 'Aucune raison fournie';
    const member = interaction.guild.members.cache.get(target.id);

    if (member && !member.bannable) {
      return interaction.reply({ content: '❌ Je ne peux pas bannir ce membre (rôle trop élevé).', ephemeral: true });
    }

    await interaction.guild.members.ban(target, { reason });
    await interaction.reply(`🔨 **${target.tag}** a été banni. Raison : ${reason}`);
  },
};
