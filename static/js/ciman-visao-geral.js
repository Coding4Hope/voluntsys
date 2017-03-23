var camadaMunicipio = L.layerGroup();
var camadaLimites = L.layerGroup();
var camadaAreasInteresse = L.layerGroup();
var camadaPontosAtencao = L.layerGroup();
var camadaEventosAtivosOntem = L.layerGroup();
var camadaEventosExtintos = L.layerGroup();
var camadaOperacoes = L.layerGroup();
var camadaEstadoSelecionado = L.layerGroup();

var camadaFocosOntem = new L.MarkerClusterGroup({
    disableClusteringAtZoom: 13,
    removeOutsideVisibleBounds: true,
    showCoverageOnHover: false,
    maxClusterRadius: 30
});
var camadaFocosHoje = new L.MarkerClusterGroup({
    disableClusteringAtZoom: 13,
    removeOutsideVisibleBounds: true,
    showCoverageOnHover: false,
    maxClusterRadius: 30
});
var camadaBrigadas = new L.MarkerClusterGroup({
    disableClusteringAtZoom: 13, removeOutsideVisibleBounds: true, showCoverageOnHover: false, maxClusterRadius: 30,
    iconCreateFunction: function (cluster) {
        return new L.DivIcon({
            className: 'marcador-cluster-brigadas',
            html: '<div></div>'
        });
    }
});

var opcoesUrl = {
    subdomains: [1, 2, 3, 4],
    appId: 'jp8lSJgNGn21e6cUniXC',
    appCode: 'TN6fkxHoLvwcxH7LMYfArA',
    language: 'por',
    attribution: '&copy; 1998 - 2016 <a target="_blank" href="http://www.inpe.br/queimadas">INPE - Queimadas</a>'
};

var camadaTerreno = L.tileLayer('//{s}.aerial.maps.api.here.com/maptile/2.1/'
    + 'maptile/newest/terrain.day/{z}/{x}/{y}/256/png8'
    + '?app_id={appId}&app_code={appCode}&lg={language}', opcoesUrl);

var camadaSatelite = L.tileLayer('//{s}.aerial.maps.api.here.com/maptile/2.1/'
    + 'maptile/newest/satellite.day/{z}/{x}/{y}/256/jpg'
    + '?app_id={appId}&app_code={appCode}&lg={language}', opcoesUrl);

var camadaHibrido = L.tileLayer('//{s}.aerial.maps.api.here.com/maptile/2.1/'
    + 'maptile/newest/hybrid.day/{z}/{x}/{y}/256/jpg'
    + '?app_id={appId}&app_code={appCode}&lg={language}', opcoesUrl);

var camadaMeteorologiaRFPrev1d = L.tileLayer.wms("http://sirc.dgi.inpe.br/cgi-bin/mapserv?map=/srv/queimadas/meteorologia/mapfiles/meteorologia.map&", {
    layers: 'previsao_rf_prev1d',
    format: 'image/png',
    transparent: true
});

var camadaMeteorologiaRFPrev2d = L.tileLayer.wms("http://sirc.dgi.inpe.br/cgi-bin/mapserv?map=/srv/queimadas/meteorologia/mapfiles/meteorologia.map&", {
    layers: 'previsao_rf_prev2d',
    format: 'image/png',
    transparent: true
});

var camadaMeteorologiaRFPrev3d = L.tileLayer.wms("http://sirc.dgi.inpe.br/cgi-bin/mapserv?map=/srv/queimadas/meteorologia/mapfiles/meteorologia.map&", {
    layers: 'previsao_rf_prev3d',
    format: 'image/png',
    transparent: true
});

camadaMeteorologiaRFPrev1d.setOpacity(0.5);
camadaMeteorologiaRFPrev2d.setOpacity(0.5);
camadaMeteorologiaRFPrev3d.setOpacity(0.5);

hoje = new Date();
hoje.setDate(hoje.getDate() - 1);

aqua_250m_truecolor = L.tileLayer.wms("https://static0{s}-queimadas.dgi.inpe.br/wms/queimadas/", {
    subdomains: '1234',
    layers: 'aqua_250m_truecolor',
    format: 'image/png',
    transparent: true,
    attribution: '<a href="https://dev-queimadas.dgi.inpe.br/queimadas/">Programa Queimadas - INPE</a>',
    crs: L.CRS.EPSG4326,
    time: hoje.toISOString().slice(0, 10)
});

terra_250m_truecolor = L.tileLayer.wms("https://static0{s}-queimadas.dgi.inpe.br/wms/queimadas/", {
    subdomains: '1234',
    layers: 'terra_250m_truecolor',
    format: 'image/png',
    transparent: true,
    attribution: '<a href="https://dev-queimadas.dgi.inpe.br/queimadas/">Programa Queimadas - INPE</a>',
    crs: L.CRS.EPSG4326,
    time: hoje.toISOString().slice(0, 10)
});

npp_250m_truecolor = L.tileLayer.wms("https://static0{s}-queimadas.dgi.inpe.br/wms/queimadas/", {
    subdomains: '1234',
    layers: 'npp_250m_truecolor',
    format: 'image/png',
    transparent: true,
    attribution: '<a href="https://dev-queimadas.dgi.inpe.br/queimadas/">Programa Queimadas - INPE</a>',
    crs: L.CRS.EPSG4326,
    time: hoje.toISOString().slice(0, 10)
});

mapa = L.map('mapa', {
    zoom: 4,
    minZoom: 4,
    center: [-15.8, -47.9],
    maxBounds: [[-35.9, -76.0], [7.3, -26.6]],
    layers: [camadaTerreno, camadaOperacoes, camadaPontosAtencao, camadaAreasInteresse, camadaMunicipio, camadaLimites, camadaFocosOntem, camadaFocosHoje, camadaEstadoSelecionado, camadaEventosAtivosOntem, camadaEventosExtintos],
    fullscreenControl: true
}).fitBounds([[-35.9, -76.0], [7.3, -26.6]]);

// mapa.locate({setView: true});

mapa.on('resize', function (e) {
    mapa.fitBounds([[-35.9, -76.0], [7.3, -26.6]]);
});

L.control.scale().addTo(mapa);

L.control.layers({
    'Terreno': camadaTerreno,
    'Satélite': camadaSatelite,
    'Híbrido': camadaHibrido
}, {
    'AQUA': aqua_250m_truecolor,
    'TERRA': terra_250m_truecolor,
    'NPP': npp_250m_truecolor,
    'Previsão de risco de fogo - 1 dia': camadaMeteorologiaRFPrev1d,
    'Previsão de risco de fogo - 2 dias': camadaMeteorologiaRFPrev2d,
    'Previsão de risco de fogo - 3 dias': camadaMeteorologiaRFPrev3d,
    'Áreas de interesse': camadaAreasInteresse,
    'Brigadas': camadaBrigadas,
    'Pontos de atenção (ontem)': camadaPontosAtencao,
    'Eventos ativos (ontem)': camadaEventosAtivosOntem,
    'Eventos extintos (7 dias)': camadaEventosExtintos,
    'Focos (ontem)': camadaFocosOntem,
    'Focos (hoje)': camadaFocosHoje,
    'Operações': camadaOperacoes
}).addTo(mapa);
token = "91829febdc84c8a904887890e549284b";
hoje = new Date();
ontem = new Date(hoje.yyyy_mm_dd());

function adicionaMunicipio(resposta) {
    return L.geoJson(resposta, {
        style: function (feature) {
            return {
                color: '#cc3333',
                weight: 2,
                opacity: 1.0,
                fillOpacity: 0,
            };
        }, onEachFeature: function (feature, layer) {
            if (feature.properties.nome != null) {
                var conteudo = '<table class="table table-striped table-condensed">'
                    + '<thead>'
                    + '<tr><th colspan="2">Município</th></tr>'
                    + '</thead>'
                    + '<tbody>'
                    + '<tr><th>Nome</th><td>' + feature.properties.nome + '</td></tr>'
                    + '</tbody>'
                    + '</table>';

                layer.bindPopup(conteudo);
            }
        }
    });
}
var layers_area_interesse = [];
var geojson_area_interesse = [];
function adicionaAreasInteresse(tipo_tabelas) {

    camadaAreasInteresse.clearLayers();
    for (var i = 0; i < tipo_tabelas.length; i++) {
        Ajax({
            method: "GET",
            url: BASE.URL_API +'/v1/ciman/get_area_interesse?tipo_tabela='+tipo_tabelas[i].tipo_tabela,
            headers: {'Content-Type': 'application/json'}
        }).then(function successCallback(resposta) {
            var features = L.geoJson(resposta.data, {
                style: mapa_style_ai, 
                onEachFeature: function (feature, layer) {
                    var conteudo = mapa_conteudo_ai(feature);
                    layer.bindPopup(conteudo);
                    layer.bindLabel(feature.properties.titulo)
                    layers_area_interesse.push(layer);
                    geojson_area_interesse.push(feature);
                }
            });
            camadaAreasInteresse.addLayer(features);
        });
    }
}

function adicionaBrigadas(resposta) {
    var features = L.geoJson(resposta, {
        pointToLayer: function (feature, latlng) {
            switch (feature.properties.instituicao.toLowerCase()) {
                case 'IBAMA'.toLowerCase():
                    icone = L.icon({iconUrl: BASE.PREFIX_URL+'/static/images/logos/ibama.png', iconSize: [41, 40]});
                    break;
                case 'ICMBio'.toLowerCase():
                    icone = L.icon({iconUrl: BASE.PREFIX_URL+'/static/images/logos/icmbio.png', iconSize: [36, 40]});
                    break;
                default:
                    icone = L.icon({
                        iconUrl: BASE.PREFIX_URL+'/static/images/glyphicons/glyphicons_043_group.png',
                        iconSize: [32, 22]
                    });
            }

            return new L.marker(latlng, {
                title: feature.properties.area_atuacao,
                riseOnHover: true,
                icon: icone
            });
        }, onEachFeature: function (feature, layer) {
            var conteudo = '<table class="table table-striped table-condensed">'
                + '<thead>'
                + '<tr><th colspan="2">Brigada</th></tr>'
                + '</thead>'
                + '<tbody>'
                + '<tr><th>Área de atuação</th><td>' + feature.properties.area_atuacao + '</td></tr>'
                + '<tr><th>Área de apoio</th><td>' + feature.properties.area_apoio + '</td></tr>'
                + '<tr><th>Tipo</th><td>' + feature.properties.tipo + '</td></tr>'
                + '<tr><th>Número de brigadistas</th><td>' + feature.properties.numero_brigadistas + '</td></tr>'
                + '<tr><th>Município</th><td>' + feature.properties.municipio + '</td></tr>'
                + '<tr><th>UF</th><td>' + feature.properties.uf + '</td></tr>'
                + '<tr><th>Instituição</th><td>' + feature.properties.instituicao + '</td></tr>'
                + '</tbody>'
                + '<tfooter>'
                + '<tr><td colspan="2" class="text-right"><a href="/brigada/' + feature.id + '">Ver detalhes</a></td></tr>'
                + '</tfooter>'
                + '</table>';
            layer.bindPopup(conteudo);
        }
    });

    camadaBrigadas.clearLayers();
    camadaBrigadas.addLayer(features);
}

function adicionaFoco(focos) {
    pin_focos(focos);
}

function adicionaOperacoes(operacoes) {
    return L.geoJson(operacoes, {
        style: {
            stroke: false,
            fill: false
        },
        pointToLayer: function (feature, latlng) {
            return new L.marker(latlng, {
                title: feature.properties.nome,
                riseOnHover: true,
                icon: iconeOperacao
            });
        },
        onEachFeature: function (feature, layer) {
            var conteudo = '<table class="table table-striped table-condensed">'
                + '<thead>'
                + '<tr><th colspan="2">Operação</th></tr>'
                + '</thead>'
                + '<tbody>'
                + '<tr><th>Nome</th><td>' + feature.properties.nome + '</td></tr>'
                + '<tr><th>Data de início</th><td>' + feature.properties.data_inicio.slice(0, 10) + '</td></tr>'
                + '</tbody>'
                + '<tfooter>'
                + '<tr><td colspan="2" class="text-right"><a href="/operacao/' + feature.id + '">Ver detalhes</a></td></tr>'
                + '</tfooter>'
                + '</table>';
            layer.bindPopup(conteudo);
        }
    });
}

$(document).ready(function () {

    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd',
        language: 'pt-BR',
        todayBtn: true,
        todayHighlight: true,
        autoclose: true
    });

    var d = new Date();
    d.setDate(d.getDate());
    $('#data').val(d.toISOString().slice(0, 10));
});
estado_antigo = ""
function ajax_data_estado(){
    if(estado_antigo == estado){
        return;
    }
    estado_antigo = estado;
    Ajax({
        method: "GET",
        // url: BASE.URL_API + "/v1/geo/estados?nome_bdq=" + estado + "&pais=33&token=91829febdc84c8a904887890e549284b&retorno=geo",
        url: BASE.URL_API + "/v1/ciman/get_estado?nome_bdq=" + estado + "&pais=33&token=91829febdc84c8a904887890e549284b&retorno=geo",
        headers: {'Content-Type': 'application/json'}
    }).then(function successCallback(resposta) {
        if(resposta.data.features[0] != undefined){
            camadaJson = L.geoJson(resposta.data.features[0].geometry, {style:{
                "color": "#ff0000",
                "fillColor": "transparent",
                "weight": 2,
            }});
            camadaEstadoSelecionado.clearLayers();
            camadaEstadoSelecionado.addLayer(camadaJson);
            mapa.fitBounds(camadaJson.getBounds());
            camadaJson.bringToBack();
            ajax_evento_requeima_ativo();
        }
    });
}
url_foco_antiga = "";
function ajax_focos(){
    url_foco = BASE.URL_API + "/v1/ciman/getgeofocospaises?token=" + token + "&inicio=" + novo_d0.yyyy_mm_dd() + "&fim=" +  amanha.yyyy_mm_dd() + "&pais=256&retorno=geojson&estado=" + estado
    if(url_foco_antiga == url_foco){
        return;
    }
    url_foco_antiga = url_foco;
    $('#loading').show();
    Ajax({
        method: "GET",
        url: url_foco,
        headers: {'Content-Type': 'application/json'}
    }).then(function successCallback(resposta) {
        var json_ontem = [];
        var json_hoje = [];
        for (var i = 0; i < resposta.data.features.length; i++) {
            var element = resposta.data.features[i];
            if(element.properties.data_hora_gmt.slice(0, 10) ==  novo_d){
                json_hoje.push(element)
            } else {
                json_ontem.push(element)
            }  
        }
        camadaFocosOntem.clearLayers();
        camadaFocosHoje.clearLayers();
        camadaFocosHoje.addLayer(pin_focos(json_hoje, novo_d));
        camadaFocosOntem.addLayer(pin_focos(json_ontem));
        ajax_evento_requeima_inativo();
        ajax_operacoes();
        ajax_brigadas();
        $('#loading').hide();
    }, function errorCallback(response) {
        console.log("Erro");
        $('#loading').hide();
    });
}
url_operacoes_antiga = ""
function ajax_operacoes(){
    url_operacoes = BASE.URL_API + "/v1/ciman/geojson_operacoes_ativas";
    if(url_operacoes_antiga == url_operacoes){
        return;
    }
    url_operacoes_antiga = url_operacoes;
    Ajax({
        method: "GET",
        url: url_operacoes,
        headers: {'Content-Type': 'application/json'}
    }).then(function successCallback(resposta) {
        camadaOperacoes.clearLayers();
        camadaOperacoes.addLayer(adicionaOperacoes(resposta.data));
    });
}
url_brigada_antiga = ""
function ajax_brigadas(){
    url_brigada = BASE.URL_API + "/v1/ciman/geojson_brigadas_area_interesses";
    if(url_brigada_antiga == url_brigada){
        return;
    }
    url_brigada_antiga = url_brigada;
    Ajax({
        method: "GET",
        url: url_brigada,
        headers: {'Content-Type': 'application/json'}
    }).then(function successCallback(resposta) {
        adicionaBrigadas(resposta.data);
    }, function errorCallback(response) {
        console.log("Erro");
        $('#loading').hide();
    });
}
url_evento_requeima_ativo_antiga = ""
function ajax_evento_requeima_ativo(){
    url_evento_requeima_ativo = BASE.URL_API + "/v1/ciman/geojson_eventos_requeimas_areas_interesse?tipo=ativo&data=" + novo_d0.yyyy_mm_dd() + "&estado=" + estado;
    if(url_evento_requeima_ativo_antiga == url_evento_requeima_ativo){
        return;
    }
    url_evento_requeima_ativo_antiga = url_evento_requeima_ativo;
    Ajax({
        method: "GET",
        url: url_evento_requeima_ativo,
        headers: {'Content-Type': 'application/json'}
    }).then(function successCallback(resposta) {
        lista_evento_requeima = resposta.data;
        camadaPontosAtencao.clearLayers();
        camadaPontosAtencao.addLayer(adicionaPontoAtencao(lista_evento_requeima));
        camadaEventosAtivosOntem.clearLayers();
        camadaEventosAtivosOntem.addLayer(adicionaEventoAtivoOntem(resposta.data));
        mapa.on('zoomend', function() {
            if (mapa.getZoom() >= 11) {
                camadaPontosAtencao.clearLayers();
            } else {
                camadaPontosAtencao.addLayer(adicionaPontoAtencao(lista_evento_requeima));
            }
        });
        ajax_area_interesse();
    });
}
url_evento_requeima_inativo_antiga = ""
function ajax_evento_requeima_inativo(){
    url_evento_requeima_inativo = BASE.URL_API + "/v1/ciman/geojson_eventos_requeimas_areas_interesse?tipo=inativo&data=" + novo_d0.yyyy_mm_dd() + "&estado=" + estado;
    if(url_evento_requeima_inativo_antiga == url_evento_requeima_inativo){
        return;
    }
    url_evento_requeima_inativo_antiga = url_evento_requeima_inativo;
    Ajax({
        method: "GET",
        url: url_evento_requeima_inativo,
        headers: {'Content-Type': 'application/json'}
    }).then(function successCallback(resposta) {
        camadaEventosExtintos.clearLayers();
        camadaEventosExtintos.addLayer(adicionaEventoExtinto(resposta.data));
        $('#loading').hide();
    }, function errorCallback(response) {
        console.log("Erro");
        $('#loading').hide();
    });
}
url_ai_antiga = ""
function ajax_area_interesse(){
    url_ai = BASE.URL_API + "/v1/ciman/get_tipos_area_interesse";
    if(url_ai_antiga == url_ai){
        return;
    }
    url_ai_antiga = url_ai;
    Ajax({
        method: "GET",
        url: url_ai,
        headers: {'Content-Type': 'application/json'}
    }).then(function successCallback(resposta) {
        adicionaAreasInteresse(resposta.data);
    }, function errorCallback(response) {
        console.log("Erro");
    });
}

function atualiza_mapa_por_data(estado_arg, data_arg, angular_http) {
    Ajax = angular_http;
    input_data = $('#data');
    novo_d = data_arg;

    aqua_250m_truecolor.setParams({time: novo_d});
    terra_250m_truecolor.setParams({time: novo_d});
    npp_250m_truecolor.setParams({time: novo_d});

    novo_d0 = new Date(novo_d);
    novo_d1 = new Date(novo_d);
    novo_d2 = new Date(novo_d);
    novo_d3 = new Date(novo_d);
    novo_d4 = new Date(novo_d);
    novo_d5 = new Date(novo_d);
    novo_d6 = new Date(novo_d);
    amanha = new Date(novo_d);

    amanha.setDate(amanha.getDate() + 2);
    novo_d0.setDate(novo_d0.getDate());
    novo_d1.setDate(novo_d1.getDate() - 1);
    novo_d2.setDate(novo_d2.getDate() - 2);
    novo_d3.setDate(novo_d3.getDate() - 3);
    novo_d4.setDate(novo_d4.getDate() - 4);
    novo_d5.setDate(novo_d5.getDate() - 5);
    novo_d6.setDate(novo_d6.getDate() - 6);

    estado = $("#estadoFiltro").val() && $("#estadoFiltro").val() != '?' ? $("#estadoFiltro").val() : estado_arg;

    ajax_data_estado();
    ajax_focos();

    input_data.val(novo_d0.toISOString().slice(0, 10));
}

function adicionaEventoExtinto(resposta) {
    return L.geoJson(resposta, {
        style: mapa_style_evento 
        // function (feature) {
        //     var duracao = feature.properties.duracao;
        //     var color = null;

        //     color = 'gray';

        //     var fillOpacity = 0.4;

        //     var hoje = new Date();
        //     hoje.setDate(hoje.getDate() - 1);

        //     // if (feature.properties.fim.slice(0, 10) < hoje.toISOString().slice(0, 10)) {
        //     //     color = 'gray';
        //     //     fillOpacity = 0.5;
        //     // }

        //     return {
        //         stroke: false,
        //         fillColor: color,
        //         fillOpacity: fillOpacity
        //     };
        
    // }
    , onEachFeature: function (feature, layer) {
            var conteudo = mapa_conteudo_evento(feature);
            layer.bindPopup(conteudo);
        }, pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng).setRadius(300);
        }
    });
}

function adicionaEventoAtivoOntem(resposta) {
    return L.geoJson(resposta, {
        style: mapa_style_evento,
        onEachFeature: function (feature, layer) {
            var conteudo = mapa_conteudo_evento(feature);
            layer.bindPopup(conteudo);
        }, pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng).setRadius(300);
        }
    });
}

function adicionaPontoAtencao(resposta) {
    return L.geoJson(resposta, {
        style: {
            stroke: false,
            fill: false
        },
        onEachFeature: function (feature, layer) {
            var conteudo = mapa_conteudo_evento(feature, 'Ponto de atenção');
            var limite = L.latLngBounds(feature.geometry.coordinates);
            var centro = limite.getCenter();

            var color = null;
            var duracao = feature.properties.duracao;
            if (duracao >= 15) {
                color = 'red';
            } else if (duracao >= 8) {
                color = 'orange';
            } else if (duracao >= 3) {
                color = 'yellow';
            } else {
                color = 'blue';
            }
            var icone = L.icon({iconUrl: BASE.PREFIX_URL+'/static/images/glyphicons/icone_' + color +'.png'});

            var marcador = L.marker([centro.lng, centro.lat], {
                title: 'Ponto de atenção',
                riseOnHover: true,
                icon: icone
            }).bindPopup(conteudo);
            layer.addLayer(marcador);
            layer.bindPopup(conteudo);

        }
    });
}
