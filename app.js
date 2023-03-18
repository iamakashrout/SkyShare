const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const picSchema = new mongoose.Schema({
  picpath: String,
});

const picModel = mongoose.model("picsdemo", picSchema);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const app = express();

mongoose.connect("mongodb://0.0.0.0:27017/filesDB", { useNewUrlParser: true })
  .then(() => console.log("connected"))
  .catch((err) => console.log("error occured", err));

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

const pathh = path.resolve(__dirname, "public");
app.use(express.static(pathh));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", async (req, res) => {

  try {
    const data = await picModel.find({});
    if (data.length > 0) {
      res.render("home", { data: data });
    }
    else {
      res.render("home", {data: {}})
    }
  }
  catch (error) {
    console.log(error);
  }

})

app.post("/", upload.single("pic"), (req, res) => {
  const x = "uploads/" + req.file.originalname;
  const temp = new picModel({
    picpath:x
  })

  temp.save().then(() => {
    res.redirect("/");
  }).catch((err) => {
    console.log(err);
  })


})

app.get("/download/:id", async (req, res) => {

  try {
    const data = await picModel.find({ _id: req.params.id });
    const x = __dirname + "/public/" + data[0].picpath;
    res.download(x);
  }
  catch(error){
    console.log(error);
  }

})

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log("Server running on port "+port))