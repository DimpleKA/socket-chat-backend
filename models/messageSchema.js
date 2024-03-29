const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  name: String,
  fromemail: String,
  toemail: String,
  message: String,
  date: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports= Message;
