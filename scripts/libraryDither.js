const dither = require("dither-me-this")
const sharp = require("sharp")
const fetch = require("node-fetch")
const fs = require('fs')
const { argv } = require("process")

const url = argv[2]
if (!url)
	throw new Error("No url provided")
const options = {
	ditheringType: "ordered",
	orderedDitheringMatrix: [2, 2],
	width: 160,
	palette: [
		"#000000",
		"#ffffff",
		"#883932",
		"#67b6bd",
		"#8b3f96",
		"#55a049",
		"#40318d",
		"#bfce72",
		"#8b5429",
		"#574200",
		"#b86962",
		"#505050",
		"#787878",
		"#9f9f9f",
		"#94e089",
		"#7869c4",
	],
}
const output = argv[3] ? argv[3].replace(/\.\w+$/, ".png") : "output.png"

fetch(url).then(async data => {

	const buffer = await data.buffer()

	const scaledImg = await sharp(buffer).png().resize(options.width, null, {kernel: sharp.kernel.nearest}).toBuffer()

    const ditheredImg = await dither(scaledImg, options)

	const compressedImg = await sharp(ditheredImg).png({colors: options.palette.length, compressionLevel: 9, effort: 10}).toBuffer()

    fs.writeFile(output, compressedImg, (err) => {

        if (err) throw err

    })

}).catch(err => console.error(err))