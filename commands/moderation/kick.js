const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulser un membre')
    .addUserOption(o => o.setName('membre').setDescription('Membre à expulser').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison de l\'expulsion'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('membre');
    const reason = interaction.options.getString('raison') || 'Aucune raison fournie';
    const member = interaction.guild.members.cache.get(target.id);

    if (!member) {
      return interaction.reply({ content: "❌ Membre introuvable sur le serveur.", ephemeral: true });
    }
    if (!member.kickable) {
      return interaction.reply({ content: '❌ Je ne peux pas expulser ce membre (rôle trop élevé).', ephemeral: true });
    }

    await member.kick(reason);
    await interaction.reply(`👢 **${target.tag}** a été expulsé. Raison : ${reason}`);
  },
};
