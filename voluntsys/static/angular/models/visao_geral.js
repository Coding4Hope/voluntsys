cimanApp.service("VisaoGeral", function(Ajax){
    var obj = {
        opcoesUrl: {
        	subdomains: [1, 2, 3, 4],
        	appId: 'jp8lSJgNGn21e6cUniXC',
        	appCode: 'TN6fkxHoLvwcxH7LMYfArA',
        	language: 'por',
        },
        mapa: null,
		layers: []
    };
	obj.mapa = function(elem_id, data){
        var camadaAreasInteresse = L.layerGroup();

		var camadaTerreno = L.tileLayer('//{s}.aerial.maps.api.here.com/maptile/2.1/'
        	+ 'maptile/newest/terrain.day/{z}/{x}/{y}/256/png8'
        	+ '?app_id={appId}&app_code={appCode}&lg={language}', obj.opcoesUrl);

        var camadaSatelite = L.tileLayer('//{s}.aerial.maps.api.here.com/maptile/2.1/'
        	+ 'maptile/newest/satellite.day/{z}/{x}/{y}/256/jpg'
        	+ '?app_id={appId}&app_code={appCode}&lg={language}', obj.opcoesUrl);

        var camadaHibrido = L.tileLayer('//{s}.aerial.maps.api.here.com/maptile/2.1/'
        	+ 'maptile/newest/hybrid.day/{z}/{x}/{y}/256/jpg'
        	+ '?app_id={appId}&app_code={appCode}&lg={language}', obj.opcoesUrl);

        if(obj.mapa == null){
            mapa = L.map(elem_id, {
            	zoom: 4,
            	minZoom: 4,
            	center: [-15.8, -47.9],
            	maxBounds: [[-35.9, -76.0], [7.3, -26.6]],
            	layers: [camadaTerreno, camadaAreasInteresse],
            	fullscreenControl: true,
            }).fitBounds([[-35.9, -76.0], [7.3, -26.6]]);
        }

        mapa.on('resize', function (e) {
        	mapa.fitBounds([[-34.9, -75.0], [6.3, -27.6]]);
        });

        L.control.scale().addTo(mapa);

        L.control.layers({
        	'Terreno': camadaTerreno,
        	'Satélite': camadaSatelite,
        	'Híbrido': camadaHibrido
        }, {
        	'Áreas de interesse': camadaAreasInteresse
        }).addTo(mapa);

		var callback_success = function(resposta){
			var features = L.geoJson(resposta.data, {
				style: function(feature) {
					return {
						color: '#5cb85c',
						weight: 2,
						opacity: 1.0,
						fillOpacity: 0.6
					};
				}, onEachFeature: function(feature, layer) {
					var conteudo = '<table class="table table-striped table-condensed">'
	                    + '<thead>'
	                    + '<tr><th colspan="2">Área de interesse</th></tr>'
	                    + '</thead>'
	                    + '<tbody>'
	                    + '<tr><th>Nome</th><td>' + feature.properties.titulo + '</td></tr>'
	                    + '<tr><th>Tipo</th><td>' + feature.properties.tipo + '</td></tr>'
	                    + '<tr><th>Município</th><td>' + feature.properties.municipio + '</td></tr>'
	                    + '<tr><th>UF</th><td>' + feature.properties.uf + '</td></tr>'
	                    + '</tbody>'
	                    + '</table>';
					layer.bindPopup(conteudo);
				}
			});
			camadaAreasInteresse.addLayer(features);
		}
		var that = this;
        var callback_error = function(response){
            console.log("Erro");
        }
		var url = BASE.URL_API + "/v1/ciman/get_area_interesse?retorno=geojson";
        Ajax.request("GET", url, that, callback_success, callback_error)
    }
    return obj;
});
