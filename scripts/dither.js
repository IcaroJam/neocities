const dither = require("dither-me-this")
const sharp = require("sharp")
const fetch = require("node-fetch")
const fs = require('fs')

const palettes = {
	lib: [
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
	nevergrove: [
		"#251d1f",
		"#312526",
		"#3a2c2d",
		"#443637",
		"#4f4041",
		"#55494c",
		"#615156",
		"#877a70",
		"#542e2e",
		"#54382e",
		"#54412e",
		"#454831",
		"#3c463b",
		"#3b4147",
		"#3f3948",
		"#463049",
		"#523049",
		"#542e3b",
		"#364d48",
		"#7e7676",
		"#918787",
		"#a49898",
		"#25201d",
		"#312b25",
		"#3a332c",
		"#443d36",
		"#4f4840",
		"#555049",
		"#615a51",
		"#877d6f",
		"#54322e",
		"#543c2e",
		"#54452e",
		"#454c31",
		"#3c4a3b",
		"#3b4547",
		"#3f3d48",
		"#463449",
		"#523449",
		"#54323b",
		"#3f485c",
		"#7e7c76",
		"#918e87",
		"#a4a098",
		"#1d2325",
		"#262d31",
		"#2d353a",
		"#353e43",
		"#414a50",
		"#4a5456",
		"#53605c",
		"#827e75",
		"#4b3437",
		"#4b3e37",
		"#4b4737",
		"#3c4e3a",
		"#334c44",
		"#324750",
		"#363f51",
		"#3d3652",
		"#493652",
		"#4b3444",
		"#4f344b",
		"#787c7a",
		"#898f8c",
		"#99a39d",
		"#1d1e25",
		"#262631",
		"#2c2c3a",
		"#373745",
		"#414150",
		"#4c4a56",
		"#58535f",
		"#827b75",
		"#4b2e37",
		"#4b3837",
		"#4b4137",
		"#3c483a",
		"#334644",
		"#324150",
		"#363951",
		"#3d3052",
		"#493052",
		"#4b2e44",
		"#564d37",
		"#7a787c",
		"#8d8990",
		"#9e99a3",
		"#ebebea",
		"#b4b1b1",
		"#4b4b4e",
		"#1a191a",
		"#e6d9bc",
		"#ea6c6b",
		"#e58e61",
		"#e2b864",
		"#9ec577",
		"#74be94",
		"#6eadc4",
		"#8490cd",
		"#b083d8",
		"#cd7acd",
		"#d873a2",
		"#efe9dc",
		"#e49b9b",
		"#e3b096",
		"#e4cb9a",
		"#c0d4ab",
		"#a8d2ba",
		"#a5c7d4",
		"#b1b8dd",
		"#c9ade1",
		"#d9abd9",
		"#dea6c0",
	],
	everforest: [
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
	]
}

const opts = {
	lib: {
		ditheringType: "ordered",
		orderedDitheringMatrix: [2, 2],
		width: 160,
		palette: palettes.lib
	},
	misc : {
		ditheringType: "ordered",
		orderedDitheringMatrix: [4, 4],
		palette: palettes.nevergrove
	}
}

function saveImg(fileName, file) {
	fs.writeFile(fileName, file, (err) => {
		if (err) throw err
	})
}

function libDither(url, options = opts.lib) {
	return fetch(url).then(async data => {
		if (!data.ok)
			throw new Error(`FETCHING FAILED: ${data.status} ${data.statusText}`)

		const buffer = await data.buffer()

		const scaledImg = await sharp(buffer).png().resize(options.width, null, {kernel: sharp.kernel.nearest}).toBuffer()

		const ditheredImg = await dither(scaledImg, options)

		return sharp(ditheredImg).png({colors: options.palette.length, compressionLevel: 9, effort: 10}).toBuffer()

	}).catch(err => console.error(err))
}

module.exports = {
	opts,
	palettes,
	saveImg,
	libDither
}