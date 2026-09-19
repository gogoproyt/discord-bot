const { SlashCommandBuilder } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  entersState,
  VoiceConnectionStatus,
} = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');

function getQueue(client, guildId) {
  if (!client.musicQueues.has(guildId)) {
    client.musicQueues.set(guildId, { songs: [], player: createAudioPlayer(), connection: null, playing: false });
  }
  return client.musicQueues.get(guildId);
}

function playNext(client, guildId) {
  const queue = getQueue(client, guildId);
  if (queue.songs.length === 0) {
    queue.playing = false;
    return;
  }
  const song = queue.songs[0];
  const stream = ytdl(song.url, { filter: 'audioonly', highWaterMark: 1 << 25 });
  const resource = createAudioResource(stream);
  queue.player.play(resource);
  queue.playing = true;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Jouer une musique depuis YouTube')
    .addStringOption(o => o.setName('url').setDescription('Lien YouTube').setRequired(true)),

  async execute(interaction, client) {
    const url = interaction.options.getString('url');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({ content: '❌ Connecte-toi d\'abord à un salon vocal.', ephemeral: true });
    }
    if (!ytdl.validateURL(url)) {
      return interaction.reply({ content: '❌ Lien YouTube invalide.', ephemeral: true });
    }

    await interaction.deferReply();

    const info = await ytdl.getBasicInfo(url);
    const queue = getQueue(client, interaction.guild.id);
    queue.songs.push({ url, title: info.videoDetails.title });

    if (!queue.connection) {
      queue.connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
      await entersState(queue.connection, VoiceConnectionStatus.Ready, 20_000);
      queue.connection.subscribe(queue.player);

      queue.player.on(AudioPlayerStatus.Idle, () => {
        queue.songs.shift();
        playNext(client, interaction.guild.id);
      });
    }

    if (!queue.playing) {
      playNext(client, interaction.guild.id);
      await interaction.editReply(`▶️ Lecture : **${info.videoDetails.title}**`);
    } else {
      await interaction.editReply(`➕ Ajouté à la file : **${info.videoDetails.title}**`);
    }
  },
};
