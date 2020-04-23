const app = require("express")();
const routes = require("./routes");
const bodyParser = require("body-parser");

require("./dbConnection");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", routes);

// catch 404 and forward to error handler
app.use((req, res) => {
    return res.status(404).send("Not found");
});

// error handler
app.use((err, req, res) => {
    // render the error page
    return res.status(err.status || 500).send("Something went wrong.");
});

module.exports = app;
