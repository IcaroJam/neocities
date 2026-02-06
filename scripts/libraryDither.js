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
	if (!data.ok)
      throw new Error(`FETCHING FAILED: ${data.status} ${data.statusText}`)

	const buffer = await data.buffer()

	const scaledImg = await sharp(buffer).png().resize(options.width, null, {kernel: sharp.kernel.nearest}).toBuffer()

    const ditheredImg = await dither(scaledImg, options)

	const compressedImg = await sharp(ditheredImg).png({colors: options.palette.length, compressionLevel: 9, effort: 10}).toBuffer()

    fs.writeFile(output, compressedImg, (err) => {

        if (err) throw err

    })

}).catch(err => console.error(err))

/*
const options = {
	ditheringType: "ordered",
	orderedDitheringMatrix: [4, 4],
	// width: 160,
	palette: [
		"#1e2326",
		"#272e33",
		"#2e383c",
		"#374145",
		"#414b50",
		"#495156",
		"#4f5b58",
		"#4c3743",
		"#493b40",
		"#3c4841",
		"#384b55",
		"#45443c",
		"#d3c6aa",
		"#e67e80",
		"#e69875",
		"#dbbc7f",
		"#a7c080",
		"#83c092",
		"#7fbbb3",
		"#d699b6",
		"#7a8478",
		"#859289",
		"#9da9a0",
		"#a7c080",
		"#d3c6aa",
		"#e67e80",
	],
}
const output = argv[3] ? argv[3].replace(/\.\w+$/, ".png") : "output.png"

const file = fs.readFileSync(url)
dither(file, options).then(dithered =>
    fs.writeFile(output, dithered, (err) => {

        if (err) throw err

    })
)*/