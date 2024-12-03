const mongoose = require("mongoose");

//set the validations for fields as mentioned in the problem statement

//setting up the players schema
const playersSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength:3,
        validate:{
            validator:(v)=> /^[A-Za-z\s]+$/.test(v)
        },
        required: true,
    },
    age: {
        type: Number,
        min:15,
        required: true,
    },
    type: {
        type: String,
        enum:["Batsman","Bowler","All-rounder"],
        required: true,
    },
    bats: {
        type: String,
        enum:["Right","Left","NA"],
        required: true,
    },
    bowls: {
        type: String,
        enum:["Right","Left","NA"],
        required: true,
    },
    bowling_style: {
        type: String,
        enum:["Fast","Medium","Spin","Leg-spin","Chinaman","NA"],
        required: true,
    },
    bat_avg: {
        type: Number,
        default: 0.00
    },
    bowl_avg: {
        type: Number,
        default: 0.00
    },
    bat_strike_rate: {
        type: Number,
        default: 0.00
    },
    bowl_strike_rate: {
        type: Number,
        default: 0.00
    },
    catches: {
        type: Number,
        default: 0
    },
    run_outs: {
        type: Number,
        default: 0
    },
    thirtys: {
        type: Number,
        default: 0
    },
    fifties: {
        type: Number,
        default: 0
    },
    centuries: {
        type: Number,
        default: 0
    },
    three_WH: {
        type: Number,
        default: 0
    },
    five_WH: {
        type: Number,
        default: 0
    },
    highest_runs: {
        type: Number,
        default: 0
    },
    best_bowling: {
        type: String,
        default: "0/0"
    },
    overseas: {
        type: Boolean,
        default: false
    },
    displayed_count: {
        type: Number,
        default: 0
    },
    unsold: {
        type: Boolean,
        default: true
    },
    base_price: {
        type: Number,
        min:1000000,
        max:20000000,
        default: 1000000,
    },
    sold_price: {
        type: Number,
        default: 0
    },
    bought_by: {
        type: String,
        default: ""
    },
    bidded_by: {
        type: String,
        default: ""
    }
});

//setting up players model
const Players = mongoose.model("Players", playersSchema);

//exporting the players collection
module.exports = Players;