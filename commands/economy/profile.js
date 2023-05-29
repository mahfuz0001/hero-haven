const UserProfile = require("../../schemas/UserProfile");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View User Profile")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user's profile to view")
    ),

  async execute(interaction) {
    const targetUserId =
      interaction.options.getUser("user")?.id || interaction.user.id;

    const userProfile = await UserProfile.findOne({ userId: targetUserId });

    if (!userProfile) {
      interaction.reply("User profile not found.");
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("User Profile")
      .setColor("blue")
      .addFields({
        name: `<@${targetUserId}>'s Balance`,
        value: `**Bank:** $${userProfile.balance}\n**Wallet:** $${userProfile.balance}\n**Total:** $${userProfile.balance}`,
      });

    interaction.reply({ embeds: [embed] });
  },
};
