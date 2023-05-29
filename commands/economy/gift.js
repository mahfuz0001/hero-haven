const UserProfile = require("../../schemas/UserProfile");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gift")
    .setDescription("Send a gift to another user")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount to gift")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("recipient")
        .setDescription("The user to receive the gift")
        .setRequired(true)
    ),

  async execute(interaction) {
    const senderId = interaction.user.id;
    const amount = interaction.options.getNumber("amount").toString();
    const recipientId = interaction.options.getUser("recipient").id;

    const senderProfile = await UserProfile.findOne({ userId: senderId });
    const recipientProfile = await UserProfile.findOne({ userId: recipientId });

    if (!senderProfile || !recipientProfile) {
      interaction.reply("Sender or recipient profile not found.");
      return;
    }

    if (senderProfile.balance < amount) {
      interaction.reply("Insufficient balance to send the gift.");
      return;
    }

    senderProfile.balance -= amount;
    await senderProfile.save();

    await recipientProfile.giftBalance(amount);

    const embed = new EmbedBuilder()
      .setTitle("Gift Sent")
      .setColor("blue")
      .addFields({
        name: `Sender`,
        value: `<@${senderId}>`,
      })
      .addFields({
        name: `Recipient`,
        value: `<@${recipientId}>`,
      })
      .addFields({
        name: `Amount`,
        value: amount,
      });

    interaction.reply({ embeds: [embed] });
  },
};
