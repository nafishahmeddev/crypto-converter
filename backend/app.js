const express = require("express");
const cors = require("cors");
const { CurrencyRouter } = require("./routes");

//initializing app
const app = new express();

//register middleware
app.use(cors());
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

//registering routes
app.use("/api/v1/currencies", CurrencyRouter);

module.exports = app;