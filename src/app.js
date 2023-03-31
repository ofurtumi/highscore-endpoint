import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

function cors(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
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
  let temp = await fetch(`http://64.225.108.43:5000/highscore/${n}`, {});
  return await temp.text();
};

function parse_highscore(data) {
  return data
    .split("\n")
    .map((x) => `<li>${x.replace("<br>", "").substring(3)}</li>`);
}

async function get_highscore(req, res) {
  let scoreboard = [];
  for (let i = 0; i < 10; i++) {
    let data = parse_highscore(await fetch_data(i));
    scoreboard.push(data);
  }
  res.json(scoreboard);
}

indexRouter.get("/", get_highscore);

app.use("/", indexRouter);
app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
