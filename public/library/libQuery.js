function toggleQuery(title, form, section, phoebe) {
	title.classList.toggle("querying");
	form.classList.toggle("querying");
	section.classList.toggle("querying");
	phoebe.classList.toggle("querying");
}

function toggleVis(entry, condition) {
	if (condition)
		entry.htmlElem.classList.remove("hidden");
	else
		entry.htmlElem.classList.add("hidden");
}

function applyFilters(section) {
	const lowerSearch = formVals.search.toLowerCase();
	// Falta los filtrados por el resto de campos
	section.forEach(entry => { // Habría que mejorar la búsqueda para hacerla fuzzy, eliminar los problemas con acentos y demás
		let visible = true;
		// Name and, if specified, author, director, studio and publisher
		visible &= entry.name.toLowerCase().includes(lowerSearch) ||
			!formVals.nameOnly && (
				(entry.author && entry.author.toLowerCase().includes(lowerSearch)) ||
				(entry.director && entry.director.toLowerCase().includes(lowerSearch)) ||
				(entry.studio && entry.studio.toLowerCase().includes(lowerSearch)) ||
				(entry.publisher && entry.publisher.toLowerCase().includes(lowerSearch))
			);

		// Faved and dropped
		visible &= (!formVals.faved && !formVals.dropped) || (formVals.faved && entry.faved) || (formVals.dropped && entry.dropped);

		// Start and end years
		visible &= !( // Inclusion-exclusion principle baby, it's a lot easier to check when an interval is out of range
			formVals.from && entry.year < formVals.from && (!entry.end || entry.end < formVals.from) ||
			formVals.to && entry.year > formVals.to && (!entry.end || entry.end > formVals.to)
		);

		// Tags
		visible &= !formVals.tags.size || entry.tags.some(tag => formVals.tags.has(tag));

		toggleVis(entry, visible);
	});
}

function pruneTags() {
	tagHtmlElems.forEach(tag => {
		if (tag.input.checked || tag.name.toLowerCase().includes(formVals.tagSearch.toLowerCase()))
			tag.wrapper.classList.remove("hidden");
		else
			tag.wrapper.classList.add("hidden");
	});
}

function onFormInput(ev) {
	if (ev.target.name === "search")
		formVals.search = ev.target.value.toLowerCase();
	else if (ev.target.name === "nameOnly")
		formVals.nameOnly = ev.target.checked;
	else if (ev.target.name === "faved")
		formVals.faved = ev.target.checked;
	else if (ev.target.name === "dropped")
		formVals.dropped = ev.target.checked;
	else if (ev.target.name === "timeStart")
		formVals.from = ev.target.value;
	else if (ev.target.name === "timeEnd")
		formVals.to = ev.target.value;
	else if (ev.target.name === "tagSearch")
		formVals.tagSearch = ev.target.value;
	else if (ev.target.classList.contains("tagInput")) {
		const tag = ev.target.nextElementSibling.textContent;
		if (ev.target.checked)
			formVals.tags.add(tag);
		else
			formVals.tags.delete(tag);
	}

	pruneTags();
	applyFilters(window.libraryFilms);
	applyFilters(window.libraryShows);
	applyFilters(window.libraryBooks);
	applyFilters(window.libraryComics);
	applyFilters(window.libraryGames);
}



// Start script
const queryBox = document.querySelector("#libQuery");
const queryTitle = queryBox.querySelector("h2");
const form = queryBox.querySelector("form");
const tagContainer = form.querySelector("#tagContainer");
const mainSection = document.querySelector("section");
const PB = document.getElementById("PB");
queryTitle.addEventListener("click", _ => toggleQuery(queryTitle, form, mainSection, PB));

// Build script input boxes
const tagHtmlElems = [];
const loadTags = () => {
	const tags = Array.from(window.libraryTags).sort();
	if (tags.length) {
		tags.forEach(tag => {
			const wrapperLabel = document.createElement("label");
			wrapperLabel.htmlFor = tag;

			const inputBox = document.createElement("input");
			inputBox.type = "checkbox";
			inputBox.name = tag;
			inputBox.classList.add("tagInput");

			const spanElem = document.createElement("span");
			spanElem.textContent = tag;

			wrapperLabel.appendChild(inputBox);
			wrapperLabel.appendChild(spanElem);

			tagContainer.appendChild(wrapperLabel);
			tagHtmlElems.push({
				wrapper: wrapperLabel,
				input: inputBox,
				name: tag
			});
		});
		clearInterval(tagInterval);
	}
};
const tagInterval = setInterval(loadTags, 250);

const formVals = {
	search: "",
	nameOnly: false,
	faved: false,
	dropped: false,
	from: null,
	to: null,
	tagSearch: "",
	tags: new Set()
}
form.addEventListener("input", onFormInput);
// End script