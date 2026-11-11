const { saveImg, libDither } = require("./dither.js")
const { argv } = require("process")

const url = argv[2]
if (!url)
	throw new Error("No url provided")
const output = argv[3] ? argv[3].replace(/\.\w+$/, ".png") : "output.png"

// const file = fs.readFileSync(url)
// dither(file, options).then(dithered =>
//     fs.writeFile(output, dithered, (err) => {
//         if (err) throw err
//     })
// )


async function main() {
	const img = await libDither(url)
	saveImg(output, img)
}

main()



module.exports = {
	libDither,
	saveImg
}