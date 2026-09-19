const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Supprimer plusieurs messages d\'un coup')
    .addIntegerOption(o =>
      o.setName('nombre').setDescription('Nombre de messages (1-100)').setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('nombre');
    if (amount < 1 || amount > 100) {
      return interaction.reply({ content: '❌ Choisis un nombre entre 1 et 100.', ephemeral: true });
    }
    const deleted = await interaction.channel.bulkDelete(amount, true);
    await interaction.reply({ content: `🧹 ${deleted.size} message(s) supprimé(s).`, ephemeral: true });
  },
};
