const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");
require("dotenv").config();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true }));
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Only transmit over HTTPS in production
      httpOnly: true, // Prevent client-side JavaScript access
      sameSite: "lax", // Mitigate CSRF
      maxAge: 1000 * 60 * 60 * 2, // Expire after 2 hours
    },
  })
);

const taskRouter = require("./routes/task");

app.use("/task", taskRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
