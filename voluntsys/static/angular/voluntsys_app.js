var cimanApp = angular.module("cimanApp", ['ngSanitize', 'ui.select', 'ngCookies', 'ngProgress']);
cimanApp.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[').endSymbol(']}');
});

cimanApp.service("Ajax", function($http){
    return {
        request:function (method, url, data, callback_success, callback_error) {
            $http({
                method: method,
                data: data,
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function successCallback(response) {
                callback_success(response);
            }, function errorCallback(response) {
                callback_error(response);
            });
        }
    }
});



cimanApp.service("Graficos", function(Ajax, $filter){
    var obj = {
        filter: $filter
    };
    obj.ai_7 = function(response){
        var that = this;
        var dias = [
            ["Element", "Focos", { role: "style" } ]
        ];
        for (var i = 0; i < response.length; i++) {
            dias.push([
                that.filter("date")(response[i].day, "dd/MM"),
                response[i].quantidade_focos,
                "#3366CC"
            ])
        }
        function drawChart() {
            var data = google.visualization.arrayToDataTable(dias);
            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1, {calc: "stringify", sourceColumn: 1, type: "string", role: "annotation"}, 2]);
            var options = {
                title: "Situação dos últimos 7 dias (todos os satélites)",
                // width: 1700,
                // height: 400,
                bar: {groupWidth: "95%"},
                legend: {position: "none"},
            };
            var chart = new google.visualization.ColumnChart(document.getElementById("focos_grafico"));
            chart.draw(view, options);
        }
        google.charts.setOnLoadCallback(drawChart);
    };
    obj.serie_historica = function(response){
        var that = this;
        var dias = [
            ["Element", "Focos", { role: "style" } ]
        ];
        for (var i = 0; i < response.anos.length; i++) {
            dias.push([
                response.anos[i].toString(),
                response.totais[i],
                "#3366CC"
            ])
        }
        function drawChart() {
            var data = google.visualization.arrayToDataTable(dias);
            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1, {calc: "stringify", sourceColumn: 1, type: "string", role: "annotation"}, 2]);
            var options = {
                title: "Série Histórica (todos os satélites)",
                width: '100%',
                // height: 400

            };
            var chart = new google.visualization.ColumnChart(document.getElementById("serie_historica"));
            chart.draw(view, options);
        }
        google.charts.setOnLoadCallback(drawChart);
    }
    obj.anual = function(response){
        var that = this;
        function drawChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'meses');
            data.addColumn('number', 'Máximo');
            data.addColumn('number', 'Média');
            data.addColumn('number', 'Mínimo');
            var dados = []
            for (var i = 0; i < 12; i++) {
                dados.push([
                    obj.meses_br(i+1),
                    response.maximo[i],
                    response.media[i],
                    response.minimo[i],
                ])
            }
            data.addRows(dados);
            var options = {
              title: "Comparativo Anual (todos os satélites)",
            //   width: 1700,
            //   height: 400,
              colors: ['#CC0000', '#FF6600', '#FFCC00'],
            };
            var chart = new google.visualization.AreaChart(document.getElementById('anual'));
            chart.draw(data, options);
        }
        google.charts.setOnLoadCallback(drawChart);
    }
    obj.semestre1 = function(response){
        var that = this;
        function drawChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'meses');
            data.addColumn('number', 'Máximo');
            data.addColumn('number', 'Média');
            data.addColumn('number', 'Mínimo');
            var dados = []
            for (var i = 0; i < 6; i++) {
                dados.push([
                    obj.meses_br(i+1),
                    response.maximo[i],
                    response.media[i],
                    response.minimo[i],
                ])
            }
            data.addRows(dados);
            var options = {
              title: "Comparativo 1° Semestre (todos os satélites)",
              colors: ['#CC0000', '#FF6600', '#FFCC00']
            };
            var chart = new google.visualization.AreaChart(document.getElementById('semestre1'));
            chart.draw(data, options);
        }
        google.charts.setOnLoadCallback(drawChart);
    }
    obj.semestre2 = function(response){
        var that = this;
        function drawChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'meses');
            data.addColumn('number', 'Máximo');
            data.addColumn('number', 'Média');
            data.addColumn('number', 'Mínimo');
            var dados = []
            for (var i = 6; i < 12; i++) {
                dados.push([
                    obj.meses_br(i+1),
                    response.maximo[i],
                    response.media[i],
                    response.minimo[i],
                ])
            }
            data.addRows(dados);
            var options = {
              title: "Comparativo 2° Semestre (todos os satélites)",
              height: 400,
              colors: ['#CC0000', '#FF6600', '#FFCC00']
            };
            var chart = new google.visualization.AreaChart(document.getElementById('semestre2'));
            chart.draw(data, options);
        }
        google.charts.setOnLoadCallback(drawChart);
    }

    obj.columnFocosAI = function(response){
        var that = this;
        function drawChart() {
            var data = new google.visualization.arrayToDataTable([
              ['Dia - 6', 'Dia - 5', 'Dia - 4', 'Dia - 3', 'Dia - 2', 'Dia - 1', 'Dia - 0'],
              [response[0].dia_6, response[0].dia_5, response[0].dia_4, response[0].dia_3, response[0].dia_2, response[0].dia_1, response[0].dia_0]
            ]);

            var options = {
              width: 1800,
              height: 200,
              legend: { position: 'none'},
              isStacked: 'percent',
              hAxis: {
                title:'TESTE'
                // minValue: 0,
                // ticks: [0, .3, .6, .9, 1]
              }
              // colors:['#ff0000', '#FF8C00', '#FFD700', '#0000ff']
            };

        var chart = new google.charts.Bar(document.getElementById('chart_focos_ai'+response[0].ai_id));
        chart.draw(data, options);
      }
        google.charts.setOnLoadCallback(drawChart);
    }

    obj.barClassificacaoEventos = function(response){
        var that = this;
        function drawChart() {
          if(response.length > 0){
            var data = new google.visualization.arrayToDataTable([
              ['Classificação', '15 dias ou mais', 'De 8 a 14 dias', 'De 3 a 7 dias', '2 dias'],
              ['Requeimas', response[0].e_requeimas_vermelho, response[0].e_requeimas_laranja, response[0].e_requeimas_amarelo, response[0].e_requeimas_azul]
            ]);
          }

            var options = {
            //   width: 1800,
              height: 200,
              legend: { position: 'none'},
              isStacked: 'percent',
              hAxis: {
                minValue: 0,
                ticks: [0, .3, .6, .9, 1]
              },
              colors:['#ff0000', '#FF8C00', '#FFD700', '#0000ff']
            };

        var chart = new google.charts.Bar(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
        google.charts.setOnLoadCallback(drawChart);
    }

    obj.EventosBubble = function(response){
        var that = this;
        function drawChart() {
            var data = new google.visualization.DataTable();

            data.addColumn('date', 'Data');
            data.addColumn('number', 'Numero de Focos');

            var dados = []
            for (var i = 0; i < response.features.length; i++) {
                var DataOld = String(response.features[i].properties.data);
                var nData = DataOld.substring(6,8) + '/' +DataOld.substring(4,6) + '/' +  DataOld.substring(0,4);
                dados.push([
                  new Date(nData),
                  response.features[i].properties.numero_focos,

                ])
            }
            data.addRows(dados);

            var options = {
            //   width: 1800,
            //   height: 1000,
              title: 'Apresentação da relação de datas e quantidade de focos para os eventos',
              hAxis: {title: 'Data'},
              vAxis: {title: 'Quantidade de Focos'},
              bubble: {textStyle: {fontSize: 10}},
              colors:['#ff0000', '#FF8C00', '#FFD700', '#0000ff'],
              legend: {position: 'none'}
            };

        var chart = new google.visualization.ScatterChart(document.getElementById('chart_focos'));
        chart.draw(data, options);
      }
        google.charts.setOnLoadCallback(drawChart);
    }

    obj.meses_br = function(numero){
        if(numero == 1) return "Janeiro"
        if(numero == 2) return "Fevereiro"
        if(numero == 3) return "Março"
        if(numero == 4) return "Abril"
        if(numero == 5) return "Maio"
        if(numero == 6) return "Junho"
        if(numero == 7) return "Julho"
        if(numero == 8) return "Agosto"
        if(numero == 9) return "Setembro"
        if(numero == 10) return "Outubro"
        if(numero == 11) return "Novembro"
        if(numero == 12) return "Dezembro"
    }
    return obj;
});



cimanApp.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      var keys = Object.keys(props);

      items.forEach(function(item) {
        var itemMatches = false;

        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      out = items;
    }
    return out;
  };
});

cimanApp.filter('ifEmpty', function() {
    return function(input, defaultValue) {
        if (angular.isUndefined(input) || input === null || input === '') {
            return defaultValue;
        }

        return input;
    }
});


cimanApp.service("MapaPadrao", function(){

    var obj = {
        opcoesUrl: {
            subdomains: [1, 2, 3, 4],
            appId: 'jp8lSJgNGn21e6cUniXC',
            appCode: 'TN6fkxHoLvwcxH7LMYfArA',
            language: 'por',
            attribution: '&copy; 1998 - 2016 <a target="_blank" href="http://www.inpe.br/queimadas">INPE - Queimadas</a>'
        },
        checked_all: false,
        requeimas_no_mapa: [],
        requeimas_selecionado_id: [],
        e_requeimas_vermelho: false,
        e_requeimas_laranja: false,
        e_requeimas_amarelo: false,
        e_requeimas_azul: false
    };
    obj.camadaTerreno = L.tileLayer('//{s}.aerial.maps.api.here.com/maptile/2.1/'
                    + 'maptile/newest/terrain.day/{z}/{x}/{y}/256/png8'
                    + '?app_id={appId}&app_code={appCode}&lg={language}', obj.opcoesUrl);
    obj.camadaSatelite = L.tileLayer('//{s}.aerial.maps.api.here.com/maptile/2.1/'
                    + 'maptile/newest/satellite.day/{z}/{x}/{y}/256/jpg'
                    + '?app_id={appId}&app_code={appCode}&lg={language}', obj.opcoesUrl);
    obj.camadaHibrido = L.tileLayer('//{s}.aerial.maps.api.here.com/maptile/2.1/'
                    + 'maptile/newest/hybrid.day/{z}/{x}/{y}/256/jpg'
                    + '?app_id={appId}&app_code={appCode}&lg={language}', obj.opcoesUrl);
    obj.layers = [obj.camadaTerreno];
    obj.control_layers = {
        'Terreno': obj.camadaTerreno,
        'Satélite': obj.camadaSatelite,
        'Híbrido': obj.camadaHibrido
    };
    obj.iconeFoco = L.icon({iconUrl: BASE.PREFIX_URL+ '/static/images/glyphicons/glyphicons_022_fire.png', iconSize: [21, 26]});
    obj.update_mapa_requeima = function () {
        for (var i = 0; i < obj.requeimas_no_mapa.length; i++) {
            mapa.removeLayer(obj.requeimas_no_mapa[i]);
        }
        obj.requeimas_no_mapa = [];
        obj.requeimas_selecionado_id = [];
        for (var i = 0; i < obj.requeima.features.length; i++) {
            if (obj.requeima.features[i].checked) {
                obj.requeimas_selecionado_id.push(obj.requeima.features[i].id);
                var data = obj.requeima.features[i];
                var option = {
                    weight: 2,
                    opacity: 1.0,
                    fillOpacity: 0.6
                };
                if (between(data.properties.duracao, 0, 2)) {
                    option.color = "blue";
                }
                if (between(data.properties.duracao, 3, 7)) {
                    option.color = "yellow";
                }
                if (between(data.properties.duracao, 8, 14)) {
                    option.color = "orange";
                }
                if (15 <= data.properties.duracao) {
                    option.color = "red";
                }
                var polygon = L.geoJson(data, option);
                obj.requeimas_no_mapa.push(polygon);
                var conteudo = '<table class="table table-striped table-condensed">'
                    + '<thead>'
                    + '<tr><th colspan="2">Área de interesse</th></tr>'
                    + '</thead>'
                    + '<tbody>'
                    + '<tr><th>Início</th><td>' + data.properties.inicio + '</td></tr>'
                    + '<tr><th>Fim</th><td>' + data.properties.fim + '</td></tr>'
                    + '<tr><th>Duração</th><td>' + data.properties.duracao + '</td></tr>'
                    + '<tr><th>Número dias com foco</th><td>' + data.properties.ndiascf + '</td></tr>'
                    + '<tr><th>Número de focos</th><td>' + data.properties.nfocos + '</td></tr>'
                    + '<tr><th>Área km²</th><td>' + data.properties.area_km + '</td></tr>'
                    + '</tbody>'
                    + '</table>';
                polygon.bindPopup(conteudo);
                polygon.addTo(mapa);
            }
        }
        if (obj.requeimas_no_mapa.length) {
            var group = new L.featureGroup(obj.requeimas_no_mapa);
            mapa.fitBounds(group.getBounds(), {padding: [10, 10]});
        } else {
            mapa.fitBounds(ai_layer.getBounds());
        }
    };
    obj.selecionar_todos = function () {
        if (obj.checked_all) {
            for (var i = 0; i < obj.requeima.features.length; i++) {
                obj.requeima.features[i].checked = true;
            }
            obj.e_requeimas_vermelho = true;
            obj.e_requeimas_laranja = true;
            obj.e_requeimas_amarelo = true;
            obj.e_requeimas_azul = true;
        } else {
            for (var i = 0; i < obj.requeima.features.length; i++) {
                obj.requeima.features[i].checked = false;
                obj.e_requeimas_vermelho = false;
                obj.e_requeimas_laranja = false;
                obj.e_requeimas_amarelo = false;
                obj.e_requeimas_azul = false;
            }
        }
        obj.update_mapa_requeima();
    };
    obj.selecionar_cor = function (cor) {
        for (var i = 0; i < obj.requeima.features.length; i++) {
            var data = obj.requeima.features[i];
            if (cor == 'blue' && between(data.properties.duracao, 0, 2)) {
                data.checked = obj.e_requeimas_azul;
            }
            if (cor == 'yellow' && between(data.properties.duracao, 3, 7)) {
                data.checked = obj.e_requeimas_amarelo;
            }
            if (cor == 'orange' && between(data.properties.duracao, 8, 14)) {
                data.checked = obj.e_requeimas_laranja;
            }
            if (cor == 'red' && 15 <= data.properties.duracao) {
                data.checked = obj.e_requeimas_vermelho;
            }
        }
        obj.checked_all = false;
        obj.update_mapa_requeima();
    };
    return obj;
});

function ClassificandoEvento (dur){
  var tipo = "";
  if(dur >= 15){
    return "Mais que 15 dias";
  }
  else if ((dur >= 8) && (dur<15)){
    return "De 8 a 14 dias";
  }
  else if ((dur >=3) && (dur < 8)){
    return "De 3 a 7 dias";
  }
  else {
    return "Até 2 dias";
  }
}


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function setDataISO(){
    $('.lblFigura').each(function() {
        $(this).html(getDataISO(0));
    });
}


function getDataISO(dias) {
    var dayMonth = new Date().getDate();
    dayMonth += dias;
    var d = new Date();
    d.setDate(dayMonth);

    var day = d.getDate();
    var monthIndex = d.getMonth()+1;
    var year = d.getFullYear();

    return (day > 9 ? day : '0' + day.toString()) + '/' + (monthIndex > 9 ? monthIndex : '0' + monthIndex.toString()) + '/' + year;
}

cimanApp.filter("integer", function(){
    return function(input){
        var resultado = parseInt(input, 10);
        if(isNaN(resultado)){
            resultado = 0;
        }
        return resultado;
    }
});


load_google_visualization = false;
function charts_visualization_load(){
    if(!load_google_visualization){
        google.charts.load("current", {packages:['corechart','line'], 'language': 'pt'});
        load_google_visualization = true;
    }
}



cimanApp.factory('$HttpSync', ['$http', '$cacheFactory',
    function ($http, $cacheFactory) {
        var cache = $cacheFactory('$HttpSync');

        var _wrap = function (promise) {
            return promise.then(function (response) {
                return response.data;
            });
        };

        return {
            get: function (url, options) {
                return _wrap(cache.get(url) || cache.put(url, $http.get(url, options)));
            }
        };
    }
]);


cimanApp.filter('to_int', function() {
    return function(input) {
       return parseInt(input);
    }
});

cimanApp.filter('data_iso', function() {
    return function(input) {
       return setDataISO(input);
    }
});

cimanApp.filter('data_revert', function() {
    return function(input) {
        if(input.indexOf('/')){
            var a = input.split("/");
            return b=a[2]+"/"+a[1]+"/"+a[0];
        } else {
            var a = input.split("-");
            return b=a[2]+"-"+a[1]+"-"+a[0];
        }
    }
});
