const express = require("express");
require("dotenv").config();
const cors = require("cors");
const routes = require("./router/routes");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || 5000;

app.use("/api", routes);
app.route("/").get((req, res) => res.send("Application is Running..."));

app.listen(port, () => console.log(`Server is running on port ${port}.`));
