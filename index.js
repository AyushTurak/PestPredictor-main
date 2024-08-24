import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import multer from "multer";
import axios from "axios"; // Importing axios
import fs from "fs";
import FormData from "form-data"; // Importing FormData for handling file data
import env from "dotenv";

const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(passport.initialize());

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' }); // 'uploads/' is the folder to store uploaded files

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

app.get("/", async (req, res) => {
  res.render("home.ejs"); // No need for the full path, just the filename without .ejs

});

app.get("/sign-up", (req, res) => {
  res.render("signUp.ejs");
});

app.get("/sign-in", (req, res) => {
  res.render("signIn.ejs");
});

app.get("/disease", (req, res) => {
  res.render("disease.ejs");
});

app.get("/pest", (req, res) => {
  res.render("pest.ejs");
});

app.get("/realtime", (req, res) => {
  res.render("realtime.ejs");
});

// Handling file upload and prediction
app.post("/disease", upload.single('dInput'), async (req, res) => {
  const file = req.file;
  if (!file) {
    res.send("Please upload a file");
    return;
  }

  const formData = new FormData();
  formData.append('file', fs.createReadStream(file.path)); // Attach the file

  try {
    const response = await axios.post('http://localhost:5000/predict', formData, {
      headers: {
        ...formData.getHeaders(),
        'Accept': 'application/json',
      },
    });

    const data = response.data;
    res.render("disease.ejs", {
      prediction: data, // Pass the prediction result to the EJS template
    });

    // Optionally, delete the uploaded file after processing
    fs.unlink(file.path, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
  } catch (error) {
    console.error('There was an error!', error);
    res.render("disease.ejs", { prediction: null }); // Render the EJS page even on error
  }
});

// Additional route for pest detection
app.post("/pest", upload.single('pInput'), async (req, res) => {
  const file = req.file;
  if (!file) {
    res.send("Please upload a file");
    return;
  }

  const formData = new FormData();
  formData.append('file', fs.createReadStream(file.path)); // Attach the file

  try {
    const response = await axios.post('http://localhost:5000/predictPest', formData, {
      headers: {
        ...formData.getHeaders(),
        'Accept': 'application/json',
      },
    });

    const data = response.data;
    res.render("pest.ejs", {
      prediction: data,
    });

    fs.unlink(file.path, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
  } catch (error) {
    console.error('There was an error!', error);
    res.render("pest.ejs", { prediction: null });
  }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
