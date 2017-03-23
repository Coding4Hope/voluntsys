cimanApp.service("MapaRequeimaEventos", function(){
  var camadaEventos = L.layerGroup()
  var camadaEventosRequeima = L.layerGroup()
  var camadaEventosRequeimaGerado = L.layerGroup()
  var camadaFocosHoje = L.layerGroup()
  var camadaFocosAntigos = L.layerGroup()
    var obj = {
        opcoesUrl: {
            subdomains: [1, 2, 3, 4],
            appId: 'jp8lSJgNGn21e6cUniXC',
            appCode: 'TN6fkxHoLvwcxH7LMYfArA',
            language: 'por',
        },
        mapa: null,

    };

    obj.PopGeral = function(elem_id){
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
            	layers: [camadaTerreno, camadaEventosRequeima, camadaEventosRequeimaGerado],
            	fullscreenControl: true,
            })
            //.fitBounds([[-35.9, -76.0], [7.3, -26.6]]);
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
        	'Evento Requeima': camadaEventosRequeima,
        	'Eventos': camadaEventos,
        	'Focos (atual)': camadaFocosHoje,
        	'Focos (anteriores)': camadaFocosAntigos,
          'Evento Requeima Gerada': camadaEventosRequeimaGerado
        }).addTo(mapa);
    }

    obj.PopEventos = function(elem_id, data){
        // adiciona as camadas
        camadaEventos.addLayer(
            L.geoJson(data, {
                style: function(feature) {
                    ai_feature = feature;
                        preenchimento = '#5cb85c';

                    return {
                        color: preenchimento,
                        weight: 2,
                        opacity: 1.0,
                        fillOpacity: 0.6
                    };
                }, onEachFeature: function(feature, layer) {
                    var conteudo = '<table class="table table-striped table-condensed">'
                        + '<thead>'
                        + '<tr><th colspan="2">Evento #'+feature.id+'  </th></tr>'
                        + '</thead>'
                        + '<tbody>'
                        + '<tr><th>Data</th><td>' + feature.properties.data + '</td></tr>'
                        + '<tr><th>Número de Focos</th><td>' + feature.properties.numero_focos + '</td></tr>'
                        + '</tbody>'
                        + '</table>';
                    ai_layer = layer;
                    // mapa.fitBounds(layer.getBounds());
                    layer.bindPopup(conteudo);
                }
            })
        );
    }

    obj.PopRequeimaEvento = function(elem_id, data){
        // adiciona as camadas
        camadaJson = L.geoJson(data, {
            style: function(feature) {
                ai_feature = feature;
                preenchimento = '#cc3333';

                return {
                    color: preenchimento,
                    weight: 2,
                    opacity: 1.0,
                    fillOpacity: 0.6
                };
            }, onEachFeature: function(feature, layer) {
                var conteudo = mapa_conteudo_evento(feature)
                ai_layer = layer;
                mapa.fitBounds(layer.getBounds());
                layer.bindPopup(conteudo);
            }
        });
        camadaEventosRequeima.addLayer(camadaJson);
        mapa.fitBounds(camadaJson.getBounds());
    }

      obj.foco_na_rq = function(){
          mapa.fitBounds(camadaJson.getBounds());
      };
      obj.PopRequeimaEventoGerado = function(elem_id, data){
        camadaEventosRequeimaGerado.clearLayers();

        camadaEventosRequeimaGerado.addLayer(
          L.geoJson(data, {
            style: function(feature) {
                ai_feature = feature;
                preenchimento = '#0000ff';

                return {
                    color: preenchimento,
                    weight: 2,
                    opacity: 1.0,
                    fillOpacity: 0.6
                };
            }, onEachFeature: function(feature, layer) {
                var conteudo = '<table class="table table-striped table-condensed">'
                    + '<thead>'
                    + '<tr><th colspan="2">Evento Requeima</th></tr>'
                    + '</thead>'
                    + '<tbody>'
                    + '<tr><th>Data Inicial (Com Focos)</th><td>' + feature.properties.min_data+ '</td></tr>'
                    + '<tr><th>Data Final (Com Focos)</th><td>' + feature.properties.max_data+ '</td></tr>'
                    + '<tr><th>Área KM²</th><td>' + feature.properties.area_km+ '</td></tr>'
                    + '<tr><th>Duração</th><td>' + feature.properties.duracao+ '</td></tr>'
                    + '<tr><th>Quantidade de Focos</th><td>' + feature.properties.nfocos+ '</td></tr>'
                    + '</tbody>'
                    + '</table>';
                ai_layer = layer;
                // mapa.fitBounds(layer.getBounds());
                layer.bindPopup(conteudo);
            }
        })
      );
    }

    obj.PopFocos = function(elem_id, data){
        var json_ontem = [];
        var json_hoje = [];
        for (var i = 0; i < data.features.length; i++) {
            var element = data.features[i];
            if(element.properties.data_hora_gmt.slice(0, 10) ==  data_ontem){
                json_hoje.push(element)
            } else {
                json_ontem.push(element)
            }  
        }
        camadaFocosAntigos.clearLayers();
        camadaFocosHoje.clearLayers();
        camadaFocosHoje.addLayer(pin_focos(json_hoje, data_ontem));
        camadaFocosAntigos.addLayer(pin_focos(json_ontem)); 
        // adiciona as camadas
        // camadaFocos.addLayer(
        //     pin_focos(data)
        // );
    }

    obj.PopGeral("geometria");
    return obj;
});

cimanApp.factory("EventoRequeima", function(Ajax, MapaRequeimaEventos, Graficos){
    var obj = {
        lista_eventos: [],
        map: MapaRequeimaEventos,
        lista_focos: [],
        graficos: Graficos
    };
    obj.get_evento_requeima_id = function(id){

        var that = this;
        var callback_success = function(response){
            that.evento_requeima_selecionada = response.data;
            $("#dt_inicio").datepicker("setDate", that.evento_requeima_selecionada.properties.inicio);
            $("#dt_final").datepicker("setDate", that.evento_requeima_selecionada.properties.fim);

            that.map.PopRequeimaEvento("geometria", response.data)
        }
        var callback_error = function(response){
            console.log("Erro");
        }
        var url = BASE.URL_API + "/v1/ciman/get_requeima_by_id?retorno=geojson&id=" + id;

        Ajax.request("GET", url, that, callback_success, callback_error)

    }
    obj.get_evento_requeima_by_range_data = function(id, data_inicial, data_final){

        var that = this;
        var callback_success = function(response){
            that.evento_requeima_gerada = response.data;
            that.map.PopRequeimaEventoGerado("geom", response.data)
        }
        var callback_error = function(response){
            console.log("Erro");
        }
        var dt_inicio = new Date(data_inicial).yyyy_mm_dd();
        var dt_final = new Date(data_final).yyyy_mm_dd();

        var url = BASE.URL_API + "/v1/ciman/gen_requeima_by_data/"+id+"?inicio="+dt_inicio+"&fim="+dt_final;

        Ajax.request("GET", url, that, callback_success, callback_error)

    }
    obj.get_eventos_by_requeima_id = function(id){

        var that = this;
        var callback_success = function(response){
            that.lista_eventos = response.data;
            that.map.PopEventos("geometria", response.data)
        }
        var callback_error = function(response){
            console.log("Erro");
        }
        var url = BASE.URL_API + "/v1/ciman/get_eventos_by_requeima_id?retorno=geojson&rid=" + id;
        Ajax.request("GET", url, that, callback_success, callback_error)
    };
    obj.inicia_grafico = function () {
        $("#eventos").addClass('active in')
        obj.graficos.EventosBubble(obj.lista_eventos);
    }
    obj.get_focos_by_requeima_id = function(id){

        var that = this;
        var callback_success = function(response){
            that.lista_focos = response.data;
            that.map.PopFocos("geometria", response.data);
            focos_requeima = response.data;
        }
        var callback_error = function(response){
            console.log("Erro");
        }
        var url = BASE.URL_API + "/v1/ciman/get_focos_by_requeima_id?rid=" + id;
        Ajax.request("GET", url, that, callback_success, callback_error)
    }
    return obj;
});

$(document).ready(function () {
    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd',
        language: 'pt-BR',
        todayBtn: true,
        todayHighlight: true,
        autoclose: true
    });
});