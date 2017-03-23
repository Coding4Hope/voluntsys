cimanApp.service("MapaMunicipio", function(MapaPadrao, Ajax){
    var obj = {};
    var camadaFocosHoje = new L.MarkerClusterGroup({
        disableClusteringAtZoom: 13,
        removeOutsideVisibleBounds: true,
        showCoverageOnHover: false,
        maxClusterRadius: 30
    });
    var camadaFocos7Dias = new L.MarkerClusterGroup({
        disableClusteringAtZoom: 13,
        removeOutsideVisibleBounds: true,
        showCoverageOnHover: false,
        maxClusterRadius: 30
    });
    var camadaMunicipio = L.layerGroup();
    var camadaEventosAtivosOntem = L.layerGroup();
    var camadaEventosExtintos = L.layerGroup();

    obj.iniciar_mapa = function (elem_id) {
        mapa = L.map(elem_id, {
            zoom: 4,
            minZoom: 4,
            center: [-15.8, -47.9],
            maxBounds: [[-35.9, -76.0], [7.3, -26.6]],
            layers: [MapaPadrao.camadaTerreno, camadaFocosHoje, camadaFocos7Dias, camadaMunicipio, camadaEventosAtivosOntem],
            fullscreenControl: true
        }).fitBounds([[-35.9, -76.0], [7.3, -26.6]]);
        L.control.layers(
            {
                'Terreno': MapaPadrao.camadaTerreno,
                'Satélite': MapaPadrao.camadaSatelite,
                'Híbrido': MapaPadrao.camadaHibrido
            },
            {
                'Focos (hoje)': camadaFocosHoje,
                'Focos (7 dias)': camadaFocos7Dias,
                'Município': camadaMunicipio,
                'Eventos ativos (ontem)': camadaEventosAtivosOntem,
                'Eventos extintos (7 dias)': camadaEventosExtintos
            }
        ).addTo(mapa);
    };
    obj.add_munic = function (geojson) {
        var features = L.geoJson(geojson, {
            style: function (feature) {
                return {
                    color: '#cc3333',
                    weight: 2,
                    opacity: 1.0,
                    fillOpacity: 0
                };
            }, onEachFeature: function (feature, layer) {
                var conteudo = '<table class="table table-striped table-condensed">'
                    + '<thead>'
                    + '<tr><th colspan="2">Município</th></tr>'
                    + '</thead>'
                    + '<tbody>'
                    + '<tr><th>Nome</th><td>' + feature.properties.name_2 + '</td></tr>'
                    + '</tbody>'
                    + '</table>';
                layer.bindPopup(conteudo);
            }
        });
        layer_municipio = features
        camadaMunicipio.addLayer(features);
        mapa.fitBounds(features.getBounds(), {padding: [10, 10]});
    };
    obj.add_focos_7 = function (munic_id) {
        var data = new Date();
        data.setDate(data.getDate() - 7);

        var that = this;
        var callback_success = function (response) {
        var json_ontem = [];
        var json_hoje = [];
        for (var i = 0; i < response.data.features.length; i++) {
            var element = response.data.features[i];
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

            // var features = L.geoJson(response.data, {
            //     pointToLayer: function (feature, latlng) {
            //         return new L.marker(latlng, {
            //             title: feature.properties.data,
            //             riseOnHover: true,
            //             icon: iconeFoco
            //         });
            //     }, onEachFeature: function (feature, layer) {
            //         var conteudo = '<table class="table table-striped table-condensed">'
            //             + '<thead>'
            //             + '<tr><th colspan="2">Foco aaaaaaaa</th></tr>'
            //             + '</thead>'
            //             + '<tbody>'
            //             + '<tr><th>Data</th><td>' + feature.properties.data_hora_gmt.slice(0, 10) + '</td></tr>'
            //             + '<tr><th>Satélite</th><td>' + feature.properties.satelite + '</td></tr>'
            //             + '<tr><th>Município</th><td>' + feature.properties.municipio + '</td></tr>'
            //             + '<tr><th>UF</th><td>' + feature.properties.uf + '</td></tr>'
            //             + '</tbody>'
            //             + '</table>';

            //         layer.bindPopup(conteudo);
            //     }
            // });
            // camadaFocos.addLayer(features);
        };
        var callback_error = function (response) {
            console.log("Erro");
        };

        var url = BASE.URL_API + "/v1/ciman/focos_geo_7_munic/"+munic_id+"?inicio=" + data.yyyy_mm_dd();
        Ajax.request("GET", url, that, callback_success, callback_error);
    };
    obj.add_evento_inativo = function(munic_id, data){
        var that = this;
        var callback_success = function (response) {
            var features = L.geoJson(response.data, {
                style: function (feature) {
                    var duracao = feature.properties.duracao;
                    var color = null;

                    if (duracao >= 15) {
                        color = 'red';
                    } else if (duracao >= 8) {
                        color = 'orange';
                    } else if (duracao >= 3) {
                        color = 'yellow';
                    } else {
                        color = 'blue';
                    }

                    var fillOpacity = 0.4;

                    var hoje = new Date();
                    hoje.setDate(hoje.getDate() - 1);

                    // if (feature.properties.fim.slice(0, 10) < hoje.toISOString().slice(0, 10)) {
                    //     color = 'gray';
                    //     fillOpacity = 0.5;
                    // }

                    return {
                        stroke: false,
                        fillColor: color,
                        fillOpacity: fillOpacity
                    };
                }, onEachFeature: function (feature, layer) {
                     var titulo = (feature.geometry.type === 'Point') ? 'Ponto de atenção' : 'Cluster';

                    var conteudo = '<table class="table table-striped table-condensed">'
                        + '<thead>'
                        + '<tr><th colspan="2"> ' + titulo + '</th></tr>'
                        + '</thead>'
                        + '<tbody>'
                        + '<tr><th>ID</th><td>' + feature.id + '</td></tr>'
                        + '<tr><th>Início</th><td>' + feature.properties.inicio.slice(0, 10) + '</td></tr>';

                    var hoje = new Date();
                    hoje.setDate(hoje.getDate() - 1);

                    if (feature.properties.fim.slice(0, 10) < hoje.toISOString().slice(0, 10)) {
                        conteudo += '<tr><th>Fim</th><td>' + feature.properties.fim.slice(0, 10) + '</td></tr>';
                    }

                    conteudo += '<tr><th>Duração (em dias)</th><td>' + feature.properties.duracao + '</td></tr>'
                        + '<tr><th>Número de dias com foco</th><td>' + feature.properties.ndiascf + '</td></tr>'
                        + '<tr><th>Número de focos</th><td>' + feature.properties.nfocos + '</td></tr>'
                        + '<tr><th>Polígono estimado (km²)</th><td> ~ ' + Math.round(feature.properties.area_km) + '</td></tr>'
                        + '</tbody>'
                        + '</table>';
                    layer.bindPopup(conteudo);
                }, pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng).setRadius(300);
                }
            });
            camadaEventosExtintos.addLayer(features);
        };
        var callback_error = function (response) {
            console.log("Erro");
        };

        var url = BASE.URL_API + "/v1/ciman/get_requeima_geo_by_municipio_id/"+ munic_id +"?data="+data+"&tipo=inativo";
        Ajax.request("GET", url, that, callback_success, callback_error);
    };
    obj.add_evento_ativo = function(munic_id, data){
        var that = this;
        var callback_success = function (response) {
            var features = L.geoJson(response.data, {
                style: function (feature) {
                    var duracao = feature.properties.duracao;
                    var color = null;

                    if (duracao >= 15) {
                        color = 'red';
                    } else if (duracao >= 8) {
                        color = 'orange';
                    } else if (duracao >= 3) {
                        color = 'yellow';
                    } else {
                        color = 'blue';
                    }

                    var fillOpacity = 0.4;

                    var hoje = new Date();
                    hoje.setDate(hoje.getDate() - 1);

                    // if (feature.properties.fim.slice(0, 10) < hoje.toISOString().slice(0, 10)) {
                    //     color = 'gray';
                    //     fillOpacity = 0.5;
                    // }

                    return {
                        stroke: false,
                        fillColor: color,
                        fillOpacity: fillOpacity
                    };
                }, onEachFeature: function (feature, layer) {
                     var titulo = (feature.geometry.type === 'Point') ? 'Ponto de atenção' : 'Cluster';

                    var conteudo = '<table class="table table-striped table-condensed">'
                        + '<thead>'
                        + '<tr><th colspan="2"> ' + titulo + '</th></tr>'
                        + '</thead>'
                        + '<tbody>'
                        + '<tr><th>ID</th><td>' + feature.id + '</td></tr>'
                        + '<tr><th>Início</th><td>' + feature.properties.inicio.slice(0, 10) + '</td></tr>';

                    var hoje = new Date();
                    hoje.setDate(hoje.getDate() - 1);

                    if (feature.properties.fim.slice(0, 10) < hoje.toISOString().slice(0, 10)) {
                        conteudo += '<tr><th>Fim</th><td>' + feature.properties.fim.slice(0, 10) + '</td></tr>';
                    }

                    conteudo += '<tr><th>Duração (em dias)</th><td>' + feature.properties.duracao + '</td></tr>'
                        + '<tr><th>Número de dias com foco</th><td>' + feature.properties.ndiascf + '</td></tr>'
                        + '<tr><th>Número de focos</th><td>' + feature.properties.nfocos + '</td></tr>'
                        + '<tr><th>Polígono estimado (km²)</th><td> ~ ' + Math.round(feature.properties.area_km) + '</td></tr>'
                        + '</tbody>'
                        + '</table>';
                    layer.bindPopup(conteudo);
                }, pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng).setRadius(300);
                }
            });
            camadaEventosAtivosOntem.addLayer(features);
        };
        var callback_error = function (response) {
            console.log("Erro");
        };

        var url = BASE.URL_API + "/v1/ciman/get_requeima_geo_by_municipio_id/"+ munic_id +"?data="+data;
        Ajax.request("GET", url, that, callback_success, callback_error);
    };
    return obj;
});
