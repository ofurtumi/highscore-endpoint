import express from "express";
import session from "express-session";

const app = express();

// Sér um að req.body innihaldi gögn úr formi
app.use(express.urlencoded({ extended: true }));

const port = 5000;

app.use(
  session({
    secret: "asdfasdfasdf",
    resave: false,
    saveUninitialized: false,
    maxAge: 20 * 1000, // 20 sek
  })
);
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
