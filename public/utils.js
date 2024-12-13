function imgFallBack(elem) {
	console.log("Img failed! D:", elem);
	elem.onerror = null;
	elem.style.imageRendering = "crisp-edges";
	elem.src = "/media/notfound.png";
}