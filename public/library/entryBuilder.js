/*
	Info is taken from the JSONs in the following format:
	{
		"name": String,
		"author"?: String,
		"director"?: String,
		"studio"?: String,
		"publisher"?: String,
		"year": Number,
		"end"?: Number,
		"seasons"?: Number,
		"eps"?: Number|String, <<In case I'd like to implement the amount read as "x/y" or smth>>
		"chapters"?: Number|String, <<Things like mangas and comics can have a chapter-based ongoing publication>>
		"img": String,
		"faved"?: boolean,
		"dropped"?: boolean,
		"tags": String[]
	}
*/

// I don't know how to use the one from utils both directly in the html and as a module here, so copypaste it is :)
function imgFallBack(e) {
	const elem = e.target;
	console.log("Img failed! D:", elem);
	elem.onerror = null;
	elem.style.imageRendering = "crisp-edges";
	elem.src = "/media/notfound.png";
}

// Content loaders
function loadCategory(data, selector, imgSrc, imgAlt) {
	const wrapper = document.querySelector(selector);
	if (!wrapper)
		return;

	data.forEach(entry => {
		const skel = createSkeleton(entry);
		const img = createImg(imgSrc + entry.img, imgAlt + entry.name);
		const name = createName(entry.name);
		const author = createAuthor(entry.author, entry.director, entry.studio, entry.publisher);
		const date = createDate(entry.year, entry.end);
		const mod = createMod();
		const details = createDetails(entry);

		skel.appendChild(img);
		skel.appendChild(name);
		skel.appendChild(author);
		skel.appendChild(date);
		skel.appendChild(mod);
		skel.appendChild(details);

		wrapper.appendChild(skel);
	});
}

function loadFilms(films) {
	loadCategory(films, "#films > div", "/media/library/films/", "The movie poster of ");
}

function loadShows(shows) {
	loadCategory(shows, "#shows > div", "/media/library/shows/", "A promotional poster of ");
}

function loadBooks(books) {
	loadCategory(books, "#books > div", "/media/library/books/", "The cover art of ");
}

function loadComics(comics) {
	loadCategory(comics, "#comics > div", "/media/library/comics/", "The cover art of ");
}

function loadGames(games) {
	loadCategory(games, "#games > div", "/media/library/games/", "The cover art of ");
}
// End content loaders

// Utility functions
function createSkeleton(entry) {
	const skel = document.createElement("div");
	if (entry.dropped)
		skel.className = "dropped";
	else if (entry.faved)
		skel.className = "faved";
	return skel;
}

function createImg(src, alt) {
	const img = document.createElement("img");
	img.src = src;
	img.onerror = imgFallBack;
	img.alt = alt;
	return img;
}

function createName(name) {
	const title = document.createElement("h4");
	title.innerHTML = name;
	return title;
}

function createAuthor(author, director, studio, publisher) {
	const au = document.createElement("h5");
	au.innerHTML = [author, director, studio, publisher].filter(key => key).join("<br>");
	return au;
}

function createDate(year, end) {
	const date = document.createElement("h6");
	date.innerHTML = end ? `${year} - ${end}` : year;
	return date;
}

function createMod() {
	const mod = document.createElement("div");
	mod.className = "entry-mod";
	return mod;
}

function createDetails(entry) {
	const details = document.createElement("div");
	details.className = "details";

	const title = createDetailTxt("Title:<br> " + entry.name);
	details.appendChild(title);

	conditionalField(details, entry.author, "Author:<br> ");
	conditionalField(details, entry.director, "Director:<br> ");
	conditionalField(details, entry.studio, "Studio:<br> ");
	conditionalField(details, entry.publisher, "Publisher:<br> ");

	const date = createDetailTxt("Release:<br> " + (entry.end ? `${entry.year} - ${entry.end}` : entry.year));
	details.appendChild(date);

	conditionalField(details, entry.seasons, "No. Seasons:<br> ");
	conditionalField(details, entry.eps, "No. Episodes:<br> ");
	conditionalField(details, entry.chapters, "No. Chapters:<br> ");

	const footer = document.createElement("div");
	if (entry.dropped) {
		const dropped = createDetailTxt("Dropped :(");
		footer.appendChild(dropped);
	} else if (entry.faved) {
		const faved = createDetailTxt("This is a favorite :]");
		footer.appendChild(faved);
	}
	const tags = createDetailTxt("Tags:<br> " + entry.tags.join(", "));
	footer.appendChild(tags);
	details.appendChild(footer);

	return details;
}

function conditionalField(parent, field, str) {
	if (field) {
		const f = createDetailTxt(str + field);
		parent.appendChild(f);
	}
}

function createDetailTxt(txt) {
	const p = document.createElement("p");
	p.innerHTML = txt;
	return p;
}
// End utility functions



const data = {
	films: null,
	shows: null,
	comics: null,
	books: null,
	games: null,
}

const fetchAndLoad = (from, into, failMsg, loadFn) => {
	fetch(from).then(async response => {
		into = await response.json();
		into.sort((a, b) => a.name.localeCompare(b.name));
		loadFn(into);
	}).catch(er => console.error(failMsg, er));
}

fetchAndLoad("./films.json", data.films, "Films fetching failed!\n", loadFilms);
fetchAndLoad("./shows.json", data.shows, "Shows fetching failed!\n", loadShows);
fetchAndLoad("./books.json", data.books, "Books fetching failed!\n", loadBooks);
fetchAndLoad("./comics.json", data.comics, "Comics fetching failed!\n", loadComics);
fetchAndLoad("./games.json", data.games, "Games fetching failed!\n", loadGames);

// Pagination or something like that pending in case this gets out of hand (lol imagine)