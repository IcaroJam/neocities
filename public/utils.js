function imgFallBack(elem) {
	console.log("Img failed! D:", elem);
	elem.onerror = null;
	elem.src = '/media/notfound.png';
}