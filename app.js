import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();

function cors(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
}

app.use(cors);
const port = process.env.PORT || 3000;

const indexRouter = express.Router();

let fetch_data = async (n) => {
  let temp = await fetch(`http://64.225.108.43:5000/highscore/${n}`);
  return await temp.text();
};

function parse_highscore(data) {
  return data
    .split("\n")
    .map((x) => `${x.replace("<br>", "").substring(3).trim()}`);
}

async function get_highscore(req, res) {
  const { game } = req.params;

  let data = parse_highscore(await fetch_data(game));

  res.json(data);
}

indexRouter.get("/:game", get_highscore);

app.use("/", indexRouter);
app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
