const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: [5, '최소 5자 이상을 입력해주세요.'],
      unique: true,
      uppercase: true,
      required: [true, '타이틀을 입력해주세요. '],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Test', TestSchema);
