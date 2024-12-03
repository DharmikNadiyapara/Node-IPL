const express = require("express");
const jwt = require("jsonwebtoken");
const adminAuth = require("../middlewares/adminAuth");
const Admin = require("../mongoose/models/admin")
const Players = require("../mongoose/models/players")

//setting up the admin router
const adminRouter = express.Router();

//write your code for admin endpoints here
adminRouter.post("/login", async (req, res) => {
  try {
    const newAdmin = await Admin.findOne({ password: req.body.password })
    const token = jwt.sign({ _id: newAdmin._id }, "xeEo2M0ol8CeWr7Nw2g2GjH8QEUK4dyyKCHi4TYJK6znm5fuAHIIPHSQ5YvdVcLlnaxppN64xK6xbhRileWvIlzCEqrBMCiITD8z")
    await newAdmin.updateOne({
      $push: { tokens: { token } }
    })
    res.status(200).json({ message: "Login Successful", token })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

adminRouter.post("/addPlayer", adminAuth, async (req, res) => {
  try {
    const { name, age, type, bats, bowls, bowling_style } = req.body;
    if (!name || !age || !type || !bats || !bowls || !bowling_style) {
      return res.status(400).json({ error: "All field required" })
    }
    await Players.create({ name, age, type, bats, bowls, bowling_style })
    res.status(201).json({ message: "Player added successfully" })
  } catch (error) {
    res.status(400).json({ error: "All field required" })
  }
})

adminRouter.get("/viewPlayer/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Players.findOne({ _id: id })
    res.status(200).json(player)
  } catch (error) {
    res.status(400).json({ error: "Not found" })
  }
})

adminRouter.patch("/editPlayer/:id", adminAuth, async (req, res) => {
  try {
    await Players.findByIdAndUpdate({ _id: req.params.id }, req.body)
    res.status(200).json({ message: "Updated successfully" })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

adminRouter.delete("/deletePlayer/:id", adminAuth, async (req, res) => {
  try {
    await Players.findByIdAndDelete({ _id: req.params.id })
    res.status(200).json({ message: "Deleted successfully" })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

adminRouter.get("/viewPlayers/:teamName", adminAuth, async (req, res) => {
  try {
    const data = await Players.find({ bought_by: req.params.teamName })
    res.status(200).json(data)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

adminRouter.patch("/playerBought/:teamName", adminAuth, async (req, res) => {
  try {
    const player = await Players.findById(req.body.id);
    const newPlayer = await Players.findByIdAndUpdate(player._id, {
      "unsold": false,
      "bought_by": player.bidded_by
    }, { new: true })
    res.status(200).json(newPlayer)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

adminRouter.patch("/players/bid/:id", adminAuth, async (req, res) => {
  try {
    const player = await Players.findById(req.params.id);
    const { teamName } = req.body;
    if (player.sold_price === 0) {
      player.sold_price = player.base_price;
    }
    if (player.sold_price >= 1000000 && player.sold_price < 10000000) {
      player.sold_price += 500000;
    } else if (player.sold_price >= 10000000 && player.sold_price < 50000000) {
      player.sold_price += 1000000;
    } else if (player.sold_price >= 50000000 && player.sold_price < 100000000) {
      player.sold_price += 2500000;
    } else if (player.sold_price >= 100000000 && player.sold_price < 200000000) {
      player.sold_price += 5000000;
    } else if (player.sold_price >= 200000000) {
      player.sold_price += 10000000;
    }

    player.bidded_by = teamName;
    await player.save();
    res.status(200).send(player)
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


adminRouter.get("/displayPlayer/:count", adminAuth, async (req, res) => {
  const count = parseInt(req.params.count);
  const type = req.query.type;
  try {
    const player = await Players.findOne({
      unsold: true,
      displayed_count: count,
      type: type,
    })
      .sort({ base_price: -1 })
      .exec();

    if (!player) {
      return res.status(405).send({ error: "No matching player found" });
    }
    player.displayed_count += 1;
    await player.save();
    res.status(200).send([player]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
})

module.exports = adminRouter;