const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on("open", () => {
    console.log("mongodb connected");
});

db.on("error", (err) => {
    console.log("error in mongo connection", err);
});

module.exports = db;
