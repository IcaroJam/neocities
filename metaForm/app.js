const dither = require('../scripts/dither')
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const cors = require('cors')
const fs = require('fs')
const app = express()
const port = 3000

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, `public/media/library/${req.body.type}s`)
	},
	filename: (req, file, cb) => {
		cb(null, `${req.body.img}.png`)
	}
})

const upload = multer({storage: storage})

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/', async (req, res) => {
	const ditheredImg = await dither.libDither(req.body.imgUrl)
	res.send(ditheredImg)
})

function toNum(num) {
	const n = parseInt(num)
	if (n == num)
		return n
	return num
}

function toBool(value) {
	if (value === "on")
		return true
	return value // it should always be "on" or undefined
}

app.post('/save', upload.single("imgBuf"), async (req, res) => {
	// To have them neatly sorted
	const entry = Object.fromEntries(Object.entries({
		name: req.body.name,
		author: req.body.author,
		director: req.body.director,
		studio: req.body.studio,
		publisher: req.body.publisher,
		year: toNum(req.body.year),
		end: toNum(req.body.end),
		seasons: toNum(req.body.seasons),
		eps: toNum(req.body.eps),
		chapters: toNum(req.body.chapters),
		img: req.body.img + ".png",
		faved: toBool(req.body.faved),
		dropped: toBool(req.body.dropped),
		tags: req.body.tags.split(","),
	}).filter(([_, v]) => v !== "" && v !== undefined && v !== null))

	const fileName = `public/library/${req.body.type}s.json`
	const content = JSON.parse(fs.readFileSync(fileName, {encoding: "utf-8"}))

	content.push(entry)
	fs.writeFileSync(fileName, JSON.stringify(content, null, "\t"))

	res.json({message: "Saved successfully :)"})
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})