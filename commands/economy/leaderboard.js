const UserProfile = require("../../schemas/UserProfile");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Check Server Highest Players!"),

  async execute(interaction) {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "This command can only be executed inside a server.",
        ephemeral: true,
      });
      return;
    }

    const guildId = interaction.guild.id;

    const users = await UserProfile.find({ guildId })
      .sort({ balance: -1 }) // Sort in descending order by balance
      .limit(10); // Limit the leaderboard to top 10 users

    if (users.length === 0) {
      interaction.reply("No users found in the leaderboard.");
      return;
    }

    const embed = new EmbedBuilder().setTitle("Leaderboard").setColor("blue");

    const desc = users
      .map(
        (user, index) =>
          `${index + 1}- <@${user.userId}> | Balance: ${user.balance}`
      )
      .join("\n");

    embed.addFields({ name: "Top 10 Grinders \n", value: desc, inline: false });

    interaction.reply({ embeds: [embed] });
  },
};
