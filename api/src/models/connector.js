const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let schm = new Schema({
  name: {
    type: String,
    required: true,
    default: null
  },
  reference: {
    type: String,
    default: null
  },
  configuration: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: "Connector"
  },
  deployed_to: {
    type: Array
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("connector", schm);
