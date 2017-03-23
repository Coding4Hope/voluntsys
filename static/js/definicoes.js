var iconeFocoSize = [16, 17];
var iconeFoco = L.icon({iconUrl: BASE.PREFIX_URL+'/static/images/glyphicons/glyphicons_022_fire.png', iconSize:  iconeFocoSize});
var iconeFocoCinza = L.icon({iconUrl: BASE.PREFIX_URL+'/static/images/glyphicons/glyphicons_022_fire_gray.png', iconSize:  iconeFocoSize});
var iconeOperacao = L.icon({iconUrl: BASE.PREFIX_URL+'/static/images/rodofogo.png', iconSize: [40, 20]});

camadaAreasInteresse = L.layerGroup();
camadaEventosRequeima = L.layerGroup();
camadaEventosRequeimaUltimaSemana = L.layerGroup();

function mapa_style_evento(feature){
    if(!feature.properties.ativo){
        return {
            stroke: false,
            fillColor: "gray",
            fillOpacity: 0.4
        };
    }
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
    return {
        fillColor: color,
        weight: 2,
        opacity: 0.9,
        color: color,
        fillOpacity: 0.2
    }
}

function mapa_conteudo_evento(feature, titulo){
    
    if(typeof titulo != "undefined"){
        var titulo = titulo;
    } else {
        var titulo = 'Evento';
    }

    var inicio = feature.properties.inicio && feature.properties.inicio.length >= 10 ? feature.properties.inicio.slice(0, 10) : feature.properties.inicio;
    var fim = feature.properties.fim && feature.properties.fim.length >= 10 ? feature.properties.fim.slice(0, 10) : feature.properties.fim;
    
    var conteudo = '<table class="table table-striped table-condensed">'
        + '<thead>'
        + '<tr><th colspan="2"> ' + titulo + '</th></tr>'
        + '</thead>'
        + '<tbody>'
        + '<tr><th>Início</th><td>' + inicio + '</td></tr>'
        + '<tr><th>Fim</th><td>' + fim + '</td></tr>';

    var hoje = new Date();
    hoje.setDate(hoje.getDate() - 1);

    if ( fim && (fim < hoje.toISOString().slice(0, 10))) {
        conteudo += '<tr><th>Fim</th><td>' + feature.properties.fim.slice(0, 10) + '</td></tr>';
    }

    var footer = "";
    if(typeof uf != 'undefined'){
        footer = '<tfooter>'
                + '<tr><td colspan="2" class="text-right"><a href="'+BASE.PREFIX_URL+'/evento-requeima/' + feature.id + '?label='+ uf +'">Ver detalhes</a></td></tr>'
                + '</tfooter>'
    }

    conteudo += '<tr><th>Duração (em dias)</th><td>' + feature.properties.duracao + '</td></tr>'
        + '<tr><th>Número de dias com foco</th><td>' + feature.properties.ndiascf + '</td></tr>'
        + '<tr><th>Número de focos</th><td>' + feature.properties.nfocos + '</td></tr>'
        + '<tr><th>Área km²</th><td> ~ ' + Math.round(feature.properties.area_km) + '</td></tr>'
        + footer
        + '</tbody>'
        + '</table>';
    return conteudo;
}

function mapa_conteudo_ai(feature){
    return '<table class="table table-striped table-condensed">'
    + '<thead>'
    + '<tr><th colspan="2">Área de interesse</th></tr>'
    + '</thead>'
    + '<tbody>'
    + '<tr><th>Nome</th><td>' + feature.properties.titulo + '</td></tr>'
    + '<tr><th>Tipo</th><td>' + feature.properties.tipo + '</td></tr>'
    + '<tr><th>Município</th><td>' + feature.properties.municipio + '</td></tr>'
    + '<tr><th>UF</th><td>' + feature.properties.uf + '</td></tr>'
    + '</tbody>'
    + '<tfooter>'
    + '<tr><td colspan="2" class="text-right"><a href="'+BASE.PREFIX_URL+'/area-interesse/' + feature.id + '">Ver detalhes</a></td></tr>'
    + '</tfooter>'
    + '</table>';
}
function mapa_style_ai(feature){
    return {
        color: '#006a00',
        weight: 4,
        fillOpacity: 0.3,
        fillColor: "transparent"
    };
}

function pin_focos(focos, data_hoje){
    var hoje = new Date();
    data_atual = hoje.yyyy_mm_dd() 
    if(typeof data_hoje != "undefined"){
        data_atual = data_hoje;
    }
    return L.geoJson(focos, {
        pointToLayer: function (feature, latlng) {

            var icone = iconeFoco;
            if(feature.properties.data_hora_gmt.slice(0, 10) != data_atual){
                icone = iconeFocoCinza;
            }
            return new L.marker(latlng, {
                title: feature.properties.data,
                riseOnHover: true,
                icon: icone
            });
        }, onEachFeature: function (feature, layer) {
            var conteudo = '<table class="table table-striped table-condensed">'
                + '<thead>'
                + '<tr><th colspan="2">Foco</th></tr>'
                + '</thead>'
                + '<tbody>'
                + '<tr><th>Data</th><td>' + feature.properties.data_hora_gmt.slice(0, 10) + '</td></tr>'
                + '<tr><th>Satélite</th><td>' + feature.properties.satelite + '</td></tr>'
                + '<tr><th>Município</th><td>' + feature.properties.municipio + '</td></tr>'
                + '</tbody>'
                + '</table>';

            layer.bindPopup(conteudo);
        }
    });
}

function mapa_conteudo_landsat(feature){
    return '<table class="table table-striped table-condensed">'
    + '<thead>'
    + '<tr><th colspan="2">Grade Landsat</th></tr>'
    + '</thead>'
    + '<tbody>'
    + '<tr><th>Órbita Ponto</th><td>' + feature.properties.path_row + '</td></tr>'
    + '</tbody>'
    + '</table>';
}
function mapa_style_landsat(feature){
    return {
        color: '#0276ba',
        weight: 4,
        fillOpacity: 1,
        strokeOpacity: 1,
        opacity: 1,
        fillColor: "transparent"
    };
}
