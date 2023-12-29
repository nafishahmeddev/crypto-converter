const express = require("express");
const cors = require("cors");
const path = require("path");
const { CurrencyRouter } = require("./routes");

//initializing app
const app = new express();

//register middleware
// app.use(cors());
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

//registering routes
app.use("/api/v1/currencies", CurrencyRouter);

app.use(express.static(path.resolve(__dirname+"/../frontend/dist")))
app.use("/*", (req, res)=>res.sendFile(path.resolve(__dirname+"/../frontend/dist/index.html")))

module.exports = app;