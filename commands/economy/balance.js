const UserProfile = require("../../schemas/UserProfile");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your balance!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user whose balance you want to check.")
    ),

  async execute(interaction) {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "This command can only be executed inside a server.",
        ephemeral: true,
      });
      return;
    }

    const targetUserId =
      interaction.options.get("user")?.value || interaction.member.id;

    await interaction.deferReply();

    const user = await UserProfile.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });

    if (!user) {
      interaction.editReply(`<@${targetUserId}> dosent have a profile yet.`);
      return;
    }

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Account Balance")
      .addFields({
        name: "Balance",
        value: `**Bank:** $${user.balance}\n**Wallet:** $${user.balance}\n**Total:** $${user.balance}`,
      });

    const embed2 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Account Balance")
      .addFields({
        name: `<@${targetUserId}>'s Balance`,
        value: `**Bank:** $${user.balance}\n**Wallet:** $${user.balance}\n**Total:** $${user.balance}`,
      });

    interaction.editReply(
      targetUserId === interaction.member.id
        ? { embeds: [embed] }
        : { embeds: [embed2] }
    );
  },
};
