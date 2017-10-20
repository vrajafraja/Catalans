const express = require("express");
const router = express.Router();
const fs = require("fs");

let players = [];
let fileName = "players.json";

fs.readFile(fileName, (err, data) => {
    if (err) {
        console.log(`File '${fileName}' not found.`);
    }
    else {
        players = JSON.parse(data);
        console.log(`File '${fileName}' was loaded.`);
    }
});

class Player {
    constructor(name, score, date) {
        this.name = name;
        this.score = score;
        this.date = date;
    }
}

router.get("/players/:start/:end", function (req, res, next) {
    res.json(players.slice(req.params.start, req.params.end));
});

router.put("/players/:name/:score", function (req, res, next) {
    players.push(new Player(String(req.params.name), parseInt(req.params.score), Date.now()));
    players.sort((p1, p2) => p2.score - p1.score);
    players.length = Math.min(players.length, 100);
    fs.writeFile(fileName, JSON.stringify(players), err => console.log(err || `File '${fileName}' was written.`));
    res.json(true);
});

module.exports = router;
