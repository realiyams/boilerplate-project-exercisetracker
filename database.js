const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model

const connect = mongoose.connect('mongodb+srv://sampleAdmin:' + process.env.PASSWORD + '@cluster0.8dqclut.mongodb.net/test', {useNewUrlParser: true, useUnifiedTopology: true})

const exerciseSchema = new Schema({
	description: {type:String, required: true},
	duration: {type:Number, required: true},
	date: {type:String, required: true},
}, {_id: false})

const personSchema = new Schema({
	username: {type: String, required: true},
	log: [exerciseSchema]
})

const exercise = Model("exercise", exerciseSchema)
const person = Model("person", personSchema)

exports.exercise = exercise
exports.person = person