const express = require("express");
const mongoose = require("mongoose");
const Registeruser = require("./model");
const jwt = require("jsonwebtoken");
const middleware = require("./middleware");
const cors = require("cors");
const app = express();

mongoose
  .connect(
    "mongodb+srv://1999mahendra:1999mahendra@cluster0.deu5gem.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB Connection established"));

app.get("/", (res, req) => {
  req.send("ruing");
});

app.use(express.json());
app.use(cors({ origin: "*" }));

app.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmpassword } = req.body;
    let exist = await Registeruser.findOne({ email: email });
    if (exist) {
      return res.statusCode(400).send("email already exist");
    }

    if (password !== confirmpassword) {
      return res.statusCode(400).send("password not maching");
    }
    let newUser = new Registeruser({
      username,
      email,
      password,
      confirmpassword,
    });
    await newUser.save();
    res.status(200).send(JSON.stringify(newUser));
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let exist = await Registeruser.findOne({ email });

    if (!exist) {
      return res.status(400).send("User not Found");
    }

    if (exist.password !== password) {
      return res.status(400).send("Invalid Password");
    }
    let payload = {
      user: {
        id: exist.id,
      },
    };

    jwt.sign(payload, "JWTKEY", { expiresIn: 120 }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

app.get("/myprofile", middleware, async (req, res) => {
  try {
    let exist = await Registeruser.findById(req.user.id);
    if (!exist) {
      return res.status(400).send("User not Found");
    }
    res.json(exist);
  } catch (error) {
    console.log(error);
    return res.status(500).send("server Error");
  }
});

app.listen(8080, () => {
  console.log("server is runing....");
});
