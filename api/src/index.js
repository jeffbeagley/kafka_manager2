const express = require("express");
const app = express();
const port = process.env.api_port || 3000;
const connector_server_model = require("./models/connect_servers");
const connector_model = require("./models/connector");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb://gandalf:gfLKyB8x+8P#bscW@172.17.0.1/kafka_manager?authSource=admin",
  {
    useNewUrlParser: true
  }
);

app.get("/status", (req, res) => {
  if (mongoose.connection.readyState) {
    return res.json({ status: "up" });
  }

  return res.json({ status: "down" });
});
app.post("/connector", (req, res) => {
  let { name, reference, configuration } = req.body;

  let s = new connector_model();

  s.name = name;
  s.reference = reference;
  s.configuration = configuration;

  s.save(function(err) {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    return res.json({ success: true });
  });
});

app.get("/connectors", (req, res) => {
  connector_model.find({}, function(err, docs) {
    if (err) {
      return res.json({ success: false, docs: [] });
    }

    return res.json({ success: true, results: docs });
  });
});

app.delete("/connector/:id", (req, res) => {
  connector_model.findById(req.params.id).deleteOne(function(err) {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    return res.json({ success: true });
  });
});

app.patch("/connector", (req, res) => {
  let { _id, configuration } = req.body;

  connector_model.findByIdAndUpdate(
    _id,
    { configuration: configuration },
    function(err) {
      if (err) {
        console.log(err);
        return res.json({ success: false });
      }

      return res.json({ success: true });
    }
  );
});

app.get("/connect_servers", (req, res) => {
  connector_server_model.find({}, function(err, docs) {
    if (err) {
      return res.json({ success: false, docs: [] });
    }

    return res.json({ success: true, results: docs });
  });
});

app.post("/connect_servers", (req, res) => {
  let { name, hostname } = req.body;

  let s = new connector_server_model();

  s.name = name;
  s.hostname = hostname;

  s.save(function(err) {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    return res.json({ success: true });
  });
});

app.delete("/connect_server/:id", (req, res) => {
  connector_server_model.findById(req.params.id).deleteOne(function(err) {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    return res.json({ success: true });
  });
});

app.post("/connect_servers/health", async (req, res) => {
  let s = req.body.servers;

  let p = s.map(a => {
    return axios.get(a).catch(err => {
      return err;
    });
  });

  let results = await Promise.all(p);

  let r = results.map(result => {
    return {
      server: result.config.url,
      status: result.status || 500
    };
  });

  return res.json(r);
});

app.post("/connect_server/environment_variable", async (req, res) => {
  let { id, key, value } = req.body;

  connector_server_model.findByIdAndUpdate(
    id,
    {
      $push: {
        environment_variables: { key: key, value: value }
      }
    },
    function(err, response) {
      if (err) {
        console.log(err);
        return res.json({ success: false });
      }

      return res.json({ success: true });
    }
  );
});

app.delete(
  "/connect_server/environment_variable/:server_id/:environment_variable_id",
  async (req, res) => {
    connector_server_model.findByIdAndUpdate(
      req.params.server_id,
      {
        $pull: {
          environment_variables: { _id: req.params.environment_variable_id }
        }
      },
      function(err, response) {
        if (err) {
          console.log(err);
          return res.json({ success: false });
        }

        return res.json({ success: true });
      }
    );
  }
);

app.listen(port, () => console.log(`api running on port: ${port}`));
