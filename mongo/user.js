db.createUser({
  user: "gandalf",
  pwd: "gfLKyB8x+8P#bscW",
  roles: [
    {
      role: "readWrite",
      db: "kafka_manager"
    }
  ]
});
