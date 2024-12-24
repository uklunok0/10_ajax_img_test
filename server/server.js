const express = require("express");
const axios = require("axios");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
//const port = 3000;
const PORT = process.env.APP_PORT || 80;
const IP = process.env.APP_IP;

app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.static(path.join(__dirname, "../src")));

app.use(
  cors({
    origin: "https://jsonplaceholder.typicode.com", // Разрешенный источник
    methods: ["GET", "POST"], // Разрешенные методы
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"], // Разрешенные заголовки
    credentials: true, // Разрешить отправку куки
  })
);
// используем middleware body-parser для обработки POST-запросов
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/index.html"));
});

app.post("/api/images", async (req, res) => {
  try {
    let requestCounter = req.body.requestCounter;
    const response = await axios.get(`https://jsonplaceholder.typicode.com/photos/${++requestCounter}`);
    const imgData = response.data;
    const imgUrl = imgData.url;
    console.log(imgUrl);

    res.json({ requestCounter, imgUrl });
  } catch (error) {
    res.status(500).send("Error fetching images");
  }
});

/*app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
*/

app.listen(PORT, IP, () => {
  console.log("Сервер запущен на http://%s:%s", IP, PORT);
});
