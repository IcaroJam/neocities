const fs = require("fs");

const sortableFiles = [
	"public/library/books.json",
	"public/library/comics.json",
	"public/library/films.json",
	"public/library/games.json",
	"public/library/shows.json",
];

const alphaSort = (a, b) => a.localeCompare(b);

sortableFiles.forEach(file => {
	const rawContent = fs.readFileSync(file, {encoding: "utf-8"});
	const parsedContent = JSON.parse(rawContent);
	const sortedContent = parsedContent.slice();

	// Sort the entries themselves
	sortedContent.sort((a, b) => alphaSort(a.name, b.name));
	// Sort the tags
	sortedContent.forEach(entry => {entry.tags.sort(alphaSort)});

	const ret = JSON.stringify(sortedContent, null, "\t");

	if (rawContent === ret)
		return;

	fs.writeFileSync(file, ret);
	console.log(`File \x1b[32m${file}\x1b[0m sorted!`);
});