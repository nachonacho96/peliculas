$(document).ready(function () {
	$("input#inputBusqueda").keyup(function(){	//cuando haga click en el boton #buscar

		var busca = $("input#inputBusqueda").val();	//registro variable de busqueda
		if (busca=="") {	//si el valor es vacio
			$("#wrap").empty();	//vacio el div
			$("footer").addClass("hidden");
		}else{
			console.log(busca);
			buscar(busca);	//llamo a funcion buscar
		}
	});
	
});
//funcion que busca 
function buscar(busca) {
	var path = "http://api.themoviedb.org/3/search/movie?api_key=3d1e9b130fcf9942b2cfa7c358263a86&query=" + busca;
	$.getJSON(path, function(respJSON){
		console.log(respJSON);	//traza del objeto json
		if (respJSON.results.length==0) {
			noHayResultados();
		}else{
			mostrarDatos(respJSON);	//llamo a mostrar datos
		}
		
	});
};
//funcion que busca una pelicula por id
function buscarPorId(id) {
	var path = "http://api.themoviedb.org/3/movie/"+id+"?api_key=3d1e9b130fcf9942b2cfa7c358263a86";
	$.getJSON(path, function(respJSON){
		mostrarDatosDetalle(respJSON);	//llamo a mostrar detalle
	});
};
//funcion que muestra los datos de los elementos en el divpeli
function mostrarDatos(respJSON) {
	var wrap = $("#wrap");
	wrap.removeClass("hidden");	//hago visible el wrap
	$("footer").removeClass("hidden");	//hago visible el footer
	wrap.empty();
	for (var i = 0; i < respJSON.results.length; i++) {
		
		var divpeli = $("<div onclick='buscarPorId("+respJSON.results[i].id+")' class='divpeli'></div>");
		wrap.append(divpeli);
		//añadir titulo
		divpeli.append("<p class='titulo'>"+respJSON.results[i].title+"</p>");
		//añadir puntuacion
		divpeli.append("<p class='puntuacion'><i class='fa fa-star'></i>"+respJSON.results[i].vote_average+"</p>");
		//añadir imagen
		var poster_path = respJSON.results[i].poster_path;
		//si el poster no es nulo
		if (poster_path!=null) {
				var path = "https://image.tmdb.org/t/p/w500"+poster_path
				var imgDetalle = $("<a class='detalle' href='#' title='"+respJSON.results[i].title+"'>"+
								"<img class='img' src='"+path+"'></a>");
				divpeli.append(imgDetalle);
		}else{
			//si es nulo, mostrar imagen por defecto
			divpeli.append("<a class='detalle' href='img/imgnodisponible.jpg' title='Imagen no disponible'><img class='imgnodisponible' src='img/imgnodisponible.jpg'></a>");
		}
	}
};
//funcion que muestra los datos de cada peli detallados
function mostrarDatosDetalle(pelicula) {
	var wrap = $("#wrap");	//vacio el wrap
	$("footer").addClass("hidden");
	wrap.empty();
	console.log(pelicula);
	var divdetalle = $("<div id='divdetalle'></div>");

	wrap.append(divdetalle);
	var divinfoizquierda = $("<div id='divinfoizquierda'></div>");
	divdetalle.append(divinfoizquierda);
	//mostrar titulo
	divinfoizquierda.append("<h1 class='titulodetalle'>"+pelicula.title+"</h1>");
	//mostrar poster
	var poster_path = pelicula.poster_path;
		//si el poster no es nulo
		if (poster_path!=null) {
				var path = "https://image.tmdb.org/t/p/w500"+poster_path
				var imgDetalle = $("<img class='imgdetalle' src='"+path+"'>");
				divinfoizquierda.append(imgDetalle);
		}else{
			//si es nulo, mostrar imagen por defecto
			divinfoizquierda.append("<img class='imgnodisponibledetalle' src='img/imgnodisponible.jpg'>");
		}
	var divinfoderecha = $("<div id='divinfoderecha'></div>");
	divdetalle.append(divinfoderecha);
	
	//mostrar tagline
	divinfoderecha.append("<div class='taglinedetalle'><h3 class='taglinedetalle'>"+pelicula.tagline+"</h3></div>");
	//mostrar sinopsis
	divinfoderecha.append("<div class='sinopsisdetalle'><p class='sinopsisdetalle'>Sinopsis: "+pelicula.overview+"</p></div>");

	//mostrar generos
	var divgenerosdetalle = $("<div class='divgenerosdetalle'><p id='generos'></p></div>");
	divinfoderecha.append(divgenerosdetalle);
	for (var i = 0; i < pelicula.genres.length; i++) {
		if (i==pelicula.genres.length-1) {	//si es el último elemento quito la coma
			$("#generos").append(pelicula.genres[i].name);
		}else{
			$("#generos").append(pelicula.genres[i].name + ", ");	//si no, pongo la coma
		}
	}
	
	
	//mostrar puntuacion
	divinfoderecha.append("<div class='puntuaciondetalle'><p class='puntuacion'><i class='fa fa-star'></i>"+pelicula.vote_average+"</p></div>");

	//mostrar duracion
	divinfoderecha.append("<div class='duraciondetalle'><p class='duraciondetalle'>"+pelicula.runtime+" minutos</p></div>");

	//mostrar idiomas
	//console.log(pelicula.spoken_languages);
	divinfoderecha.append("<div id='divbanderas'></div>");
	for (var i = 0; i < pelicula.spoken_languages.length; i++) {
		//console.log("codigo: " + pelicula.spoken_languages[i].iso_639_1);
		añadirBandera(pelicula.spoken_languages[i].iso_639_1);
	}
	//mostrar release_date
	divinfoderecha.append("<div class='fechadetalle'><p class='fechadetalle'>Estreno: "+pelicula.release_date+"</p></div>");
	//mostrar compañias
	divinfoderecha.append("<div id='divcompanias'>Compañías: </div>");
	for (var i = 0; i < pelicula.production_companies.length; i++) {
		if (i==pelicula.production_companies.length-1) {	//si es el último elemento quito la coma
			$("#divcompanias").append(pelicula.production_companies[i].name);
		}else{
			$("#divcompanias").append(pelicula.production_companies[i].name+", ");
		}
	}

	//mostrar homepage
	if (pelicula.homepage!=null) {	//si el homepage no es nulo lo muestro, si es nulo no
		divinfoderecha.append("<a href='"+pelicula.homepage+"' class='homepagedetalle'>"+pelicula.homepage+"</a>");
	}


	

};





function añadirBandera(codigo) {
	$("#divbanderas").append("<img src='flags/"+codigo+".png'>");
};
//funcion que pinta un h1 de que no hay resultados
function noHayResultados(){
	var wrap = $("#wrap");
	wrap.empty();	
	wrap.append("<h1 class='sinresultados'>No hay resultados</h1>");
};