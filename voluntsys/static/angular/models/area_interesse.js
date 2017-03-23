cimanApp.service("MapaAi", function(){
    var obj = {
        opcoesUrl: {
        	subdomains: [1, 2, 3, 4],
        	appId: 'jp8lSJgNGn21e6cUniXC',
        	appCode: 'TN6fkxHoLvwcxH7LMYfArA',
        	language: 'por',
        },
        mapa: null
    };
    obj.map_ai = function(elem_id, data){
      console.log(elem_id);
        var camadaEventos = L.layerGroup();
        var camadaLandsat = L.layerGroup();
        var camadaFocos7Dias = new L.MarkerClusterGroup({disableClusteringAtZoom: 13, removeOutsideVisibleBounds: true, showCoverageOnHover: false, maxClusterRadius: 30});
        var camadaFocosHoje = new L.MarkerClusterGroup({disableClusteringAtZoom: 13, removeOutsideVisibleBounds: true, showCoverageOnHover: false, maxClusterRadius: 30});

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
            	layers: [camadaTerreno, camadaAreasInteresse, camadaEventosRequeima, camadaFocos7Dias, camadaFocosHoje, camadaEventos],
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
        	'Áreas de interesse': camadaAreasInteresse,
        	'Eventos ativos (< 7 dias)': camadaEventosRequeima,
        	'Eventos extintos (> 7 dias)': camadaEventosRequeimaUltimaSemana,
        	'Focos (7 dias)': camadaFocos7Dias,
        	'Focos (hoje)': camadaFocosHoje,
        	'Grade Landsat': camadaLandsat
        }).addTo(mapa);

        // adiciona as camadas
        camadaAreasInteresse.addLayer(
            L.geoJson(data, {
                style: mapa_style_ai, onEachFeature: function(feature, layer) {
                    var conteudo = mapa_conteudo_ai(feature);
                    ai_layer = layer;
                    mapa.fitBounds(layer.getBounds());
                    layer.bindPopup(conteudo);
                }
            })
        );

        $.ajax({url: BASE.URL_API + '/v1/ciman/focos_ai/' + data.id, success: function(resposta) {
            var json_ontem = [];
            var json_hoje = [];
            for (var i = 0; i < resposta.features.length; i++) {
                var element = resposta.features[i];
                if(element.properties.data_hora_gmt.slice(0, 10) ==  data_atual){
                    json_hoje.push(element)
                } else {
                    json_ontem.push(element)
                }
            }
            camadaFocos7Dias.clearLayers();
            camadaFocosHoje.clearLayers();
            camadaFocosHoje.addLayer(pin_focos(json_hoje, data_atual));
            camadaFocos7Dias.addLayer(pin_focos(json_ontem));

            // camadaFocos.addLayer(pin_focos(resposta));
        } });

        $.ajax({url: BASE.URL_API + '/v1/ciman/path_row_ai/'+ data.id +'?retorno=geojson', success: function(resposta) {
            camadaLandsat.clearLayers();
            camadaLandsat.addLayer(
                L.geoJson(resposta, {
                    onEachFeature: function(feature, layer) {
                        var conteudo = mapa_conteudo_landsat(feature)
                        layer.bindPopup(conteudo);
                    },
                    style: mapa_style_landsat
                })
            );
        }});
    }
    return obj;
});

function adicionaFocos(focos) {
	pin_focos(focos);
}

function adicionaRequeima(data){
    return L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            var conteudo = mapa_conteudo_evento(feature)
            layer.bindPopup(conteudo);
        },
        style: mapa_style_evento
    });
}

function adicionaRequeimaAtivo(data){
    return L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            var conteudo = mapa_conteudo_evento(feature)
            layer.bindPopup(conteudo);
        },
        style: mapa_style_evento
    });
}

function centralizarEstimativa(){
  if(layer_geo_ai){
    mapaestimativa.invalidateSize();
    mapaestimativa.fitBounds(layer_geo_ai.getBounds());
  }
}
