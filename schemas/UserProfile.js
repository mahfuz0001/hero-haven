const { Schema, model } = require("mongoose");

const userProfileSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    lastDailyCollected: {
      type: Date,
    },
  },
  { timestamps: true }
);

userProfileSchema.methods.giftBalance = async function (amount) {
  this.balance += amount;
  await this.save();
  return this;
};

module.exports = model("UserProfile", userProfileSchema);
