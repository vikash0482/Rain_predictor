import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { weather: null, error: null });
});

app.post("/", async (req, res) => {
  const city = req.body.city;
  const apiKey = "cf6a2a006fec05ed545a5c912e67a67c";

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = response.data;

    // tomorrow's data (approx 8th entry = 24 hours later)
    const tomorrow = data.list[7];

    const willRain = tomorrow.weather[0].main.toLowerCase().includes("rain");

    res.render("index", {
      weather: willRain ? "Yes 🌧️ It will rain!" : "No ☀️ No rain!",
      error: null,
    });

  } catch (err) {
    res.render("index", {
      weather: null,
      error: "City not found!",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


