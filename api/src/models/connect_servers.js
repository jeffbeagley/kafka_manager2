const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let environment_variable_schema = new Schema({ key: String, value: String });

let schm = new Schema({
  name: {
    type: String,
    required: true
  },
  hostname: {
    type: String,
    required: true
  },
  environment_variables: {
    type: [environment_variable_schema]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("connector_server", schm);
