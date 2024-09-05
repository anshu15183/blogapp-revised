const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

require("dotenv").config();
const PORT = process.env.PORT || 5000;

//static files
app.use("/static", express.static(path.join(process.cwd(), "public")));

// middleware
app.use(express.json());

//setup template engine
app.set("view engine", "ejs");

// CORS options
const corsOptions = {
	credentials: true,
	origin: ["http://localhost:4000", "http://localhost:80"], // Whitelist the domains you want to allow
};
app.use(cors(corsOptions)); // Use the cors middleware with your options

//routes
const blog = require("./routes/blog");
// mount
app.use("/api/v1", blog);

//database connection
const dbConnect = require("./config/database");
dbConnect();

// Start Server
app.listen(PORT, () => {
	console.log(`App is Running at http://localhost:${PORT}`);
});

// Default Route
app.get("/", (req, res) => {
	res.render("index");
});
