const express = require("express");
var logger = require("morgan");
var routes = require("./routes/index-route");
const port = process.env.APP_PORT || 3006;
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", routes);

app.listen(port, () => {
    console.log("server is running on port => " + port);
});
