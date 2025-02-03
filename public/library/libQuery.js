function toggleQuery(item) {
	item.classList.toggle("querying");
}

function applyFilters(section) {
	// Falta los filtrados por el resto de campos
	section.forEach(entry => { // Falta mejorar esto para que también mire autor, estudio y demás si toca
		if (entry.name.toLowerCase().includes(formVals.search))
			entry.htmlElem.classList.remove("hidden");
		else
			entry.htmlElem.classList.add("hidden");
	});
}

function pruneTags() {
	tagHtmlElems.forEach(tag => {
		if (tag.input.checked || tag.name.toLowerCase().includes(formVals.tagSearch))
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



const queryBox = document.querySelector("#libQuery");
const queryTitle = queryBox.querySelector("h2");
const form = queryBox.querySelector("form");
const tagContainer = form.querySelector("#tagContainer");
queryTitle.addEventListener("click", _ => toggleQuery(form));

// Falta la construcción dinámica de los tags a partir de la info sacada de entryBuilder. Ahí debería crearse un set global que tenga todas las tags de todas las secciones
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
	from: 0,
	to: new Date().getFullYear(),
	tagSearch: "",
	tags: new Set()
}
form.addEventListener("input", onFormInput);