cimanApp.directive('historicoAiTabela', function () {
    return {
        templateUrl: BASE.PREFIX_URL + '/static/angular/directives/historico_ai_tabela.html',
        restrict: 'A',
        transclude: false,
        scope: {
          lista: "="
        },
    };
});


cimanApp.directive('mapEventos', function () {
    return {
        templateUrl: BASE.PREFIX_URL + '/static/angular/directives/map_eventos.html',
        restrict: 'A',
        transclude: false,
        scope: {
          lista: "="
        },
    };
});


cimanApp.directive('apresentacaoConteudo', function () {
    return {
        templateUrl: BASE.PREFIX_URL + '/static/angular/directives/apresentacao-conteudo.html',
        restrict: 'A',
        transclude: false,
        scope: {},
        link: function(scope, elem, attr){
            scope.hoje = new Date();
            scope.hoje = scope.hoje.yyyy_mm_dd();
        }
    };
});

cimanApp.directive('tabelaFocosSete', function ($http, AreaInteresse, Foco) {
    return {
        templateUrl: BASE.PREFIX_URL + '/static/angular/directives/tabela_focos_7.html',
        restrict: 'A',
        transclude: false,
        scope: {
            data: '@',
            estado: '@'
        },
        link: function(scope, elem, attr){
            scope.ai = AreaInteresse;
            scope.focos_7 = Foco;
            scope.focos_7.get_focos_7_dias = function () {
                var estado = scope.estado;
                var data = scope.data;
                var that = this;

                texto = '';
                if (data == '') {
                    var today = new Date();
                    today = today.yyyy_mm_dd();
                    data = today;
                }

                var novo_d0 = new Date(data);
                var novo_d1 = new Date(data);
                var novo_d2 = new Date(data);
                var novo_d3 = new Date(data);
                var novo_d4 = new Date(data);
                var novo_d5 = new Date(data);
                var novo_d6 = new Date(data);


                that.d0 = new Date(novo_d0.setDate(novo_d0.getDate())).yyyy_mm_dd();
                that.d1 = new Date(novo_d1.setDate(novo_d1.getDate() - 1)).yyyy_mm_dd();
                that.d2 = new Date(novo_d2.setDate(novo_d2.getDate() - 2)).yyyy_mm_dd();
                that.d3 = new Date(novo_d3.setDate(novo_d3.getDate() - 3)).yyyy_mm_dd();
                that.d4 = new Date(novo_d4.setDate(novo_d4.getDate() - 4)).yyyy_mm_dd();
                that.d5 = new Date(novo_d5.setDate(novo_d5.getDate() - 5)).yyyy_mm_dd();
                that.d6 = new Date(novo_d6.setDate(novo_d6.getDate() - 6)).yyyy_mm_dd();

                var callback_success = function (response) {
                    scope.focos_7_lista = response.data;
                    for (var i = 0; i < scope.focos_7_lista.length; i++) {
                      var foco = scope.focos_7_lista[i];
                      foco.total = foco.dia_0+foco.dia_1+foco.dia_2+foco.dia_3+foco.dia_4+foco.dia_5+foco.dia_6;
                    }
                    $('#loading').hide();
                }
                var callback_error = function (response) {
                    console.log("Erro");
                    $('#loading').hide();
                }

                var url = BASE.URL_API + "/v1/ciman/focos_7_ai?inst=null&dt=" + data + "&estado=" + estado;
                $('#loading').show();
                $http({
                    method: "GET",
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
            };
            scope.focos_7.get_focos_7_dias(scope.data, scope.estado);
        }
    };
});


cimanApp.directive('tabelaPontoAtencao', function ($http, AreaInteresse, Foco) {
    return {
        templateUrl: BASE.PREFIX_URL + '/static/angular/directives/tabela_ponto_atencao.html',
        restrict: 'A',
        transclude: false,
        scope: {
            data: '@',
            estado: '@'
        },
        link: function(scope, elem, attr){
            scope.ai = AreaInteresse;
            scope.focos_7 = Foco;
            scope.ai.get_pontosatencao = function () {
                var that = this;
                var callback_success = function (response) {
                    scope.lista_areas = response.data;

                     for (var i = 0; i < scope.lista_areas.length; i++) {
                       var area = scope.lista_areas[i];
                       area.total = area.e_requeimas_amarelo+area.e_requeimas_azul+area.e_requeimas_laranja+area.e_requeimas_vermelho;
                     }
                    $('#loading').hide();
                }
                var callback_error = function (response) {
                    console.log("Erro");
                    $('#loading').hide();
                }

                var data = scope.data;
                var estado = scope.estado;

                var url = BASE.URL_API + "/v1/ciman/pontos_ai?inst=null&data=" + data + "&estado=" + estado;
                $('#loading').show();
                $http({
                    method: "GET",
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
            };
            scope.ai.get_pontosatencao(scope.data, scope.estado);
        }
    };
});


cimanApp.directive('tabelaEstatisticaPaises', function (EstatisticaFocos) {
    return {
        templateUrl: BASE.PREFIX_URL + '/static/angular/directives/tabela_estatistica_paises.html',
        restrict: 'A',
        transclude: false,
        scope: {},
        link: function(scope, elem, attr){
            scope.lista = [];
            scope.focos = EstatisticaFocos;
            scope.focos.call_grafico = false;
            scope.focos.get_paises(scope.focos.estatistica_paises);
        }
    };
});

cimanApp.directive('comparativoHistorico', function (EstatisticaFocos) {
    return {
        templateUrl: BASE.PREFIX_URL + '/static/angular/directives/comparativo_historico.html',
        restrict: 'A',
        transclude: false,
        scope: {},
        link: function(scope, element, attrs){
            setDataISO();
            charts_visualization_load();
            scope.lista = [];
            scope.focos = EstatisticaFocos;
            scope.focos.call_grafico = true;
            scope.focos.show_comparativo_historico = true,
            scope.focos.get_paises(scope.focos.estatistica_paises);
        }
    };
});

cimanApp.directive('customTabelaFocosEstados', function (EstatisticaFocos) {
    return {
        templateUrl: BASE.PREFIX_URL + '/static/angular/directives/tabela_estatistica_estados.html',
        restrict: 'A',
        transclude: false,
        scope: {},
        link: function(scope, element, attrs){
            setDataISO();
            charts_visualization_load()
            scope.lista = [];
            scope.focos = EstatisticaFocos;
            scope.focos.call_grafico = true;
            scope.focos.show_comparativo_anual = true,
            scope.focos.show_comparativo_historico = true,
            scope.focos.show_comparativo_semestre1 = true,
            scope.focos.show_comparativo_semestre2 = true,
            scope.focos.get_estados(scope.focos.estatistica_estados);
        }
    };
});

cimanApp.directive('situacaoAtualMedia', function (SitAtual) {
    return {
        templateUrl: BASE.PREFIX_URL + '/static/angular/directives/situacao_atual_media.html',
        restrict: 'A',
        transclude: false,
        scope: {},
        link: function(scope, element, attrs){
            scope.lista = [];
            scope.sa = SitAtual;
            scope.sa.exibeTabela();
            scope.sa.exibeTabelaEstados();
            scope.sa.carregaDados();
            scope.hoje = new Date();
            var a = scope.hoje.yyyy_mm_dd();
            scope.dd_mm = a.split('-')[2]+'/'+a.split('-')[1];
        }
    };
});

cimanApp.directive('estatisticaUc', function ($http) {
    return {
        templateUrl: BASE.PREFIX_URL + '/static/angular/directives/estatistica_uc.html',
        restrict: 'A',
        transclude: false,
        scope: {},
        link: function(scope, element, attrs){
            scope.lista = [];
            scope.hoje = new Date();
            scope.ontem = new Date();
            scope.ontem.setDate(scope.ontem.getDate() - 1);
            scope.hoje = scope.hoje.yyyy_mm_dd();
            scope.ontem = scope.ontem.yyyy_mm_dd();
            var url = BASE.URL_API + "/v1/ciman/estatistica_uc?token=91829febdc84c8a904887890e549284b&inicio=" + scope.ontem +"&fim="+ scope.hoje;
            $http(
                {method: "GET", url: url, headers: {'Content-Type': 'application/json'}}
            ).then(function successCallback(response) {
                var dado = response.data;
                charts_visualization_load()
                google.charts.setOnLoadCallback(drawChart);
                function drawChart() {
                    var data = google.visualization.arrayToDataTable([
                        ['Task', 'Hours per Day'],
                        ['UC sem foco:' + (dado.uc - dado.uc_focos), dado.uc - dado.uc_focos],
                        ['UC com foco:' + dado.uc_focos, dado.uc_focos],
                    ]);
                    var options = {
                      title: '% no Total de unidades de conservação federal:' + dado.uc,
//                      pieSliceText: 'value'
                    };
                    var chart = new google.visualization.PieChart(document.getElementById('estatistica_uc'));
                    chart.draw(data, options);

                    var data = google.visualization.arrayToDataTable([
                        ['Task', 'Hours per Day'],
                        ['Área de Interesse sem foco:' + (dado.uc_ai - dado.uc_ai_focos), (dado.uc_ai - dado.uc_ai_focos)],
                        ['Área de Interesse com foco:' + dado.uc_ai_focos, dado.uc_ai_focos],
                    ]);
                    var options = {
                      title: '% no total de unidades de conservação federal com brigada:' + dado.uc_ai,
                      slices: {
                          0: { color: 'green' },
                          1: { color: '#ff6200' }
                      },
                    };
                    var chart = new google.visualization.PieChart(document.getElementById('estatistica_uc_ai'));
                    chart.draw(data, options);
                }
            }, function errorCallback(response) {
                console.log('erro')
                console.log(response);
            });
        }
    };
});

cimanApp.directive('estatisticaTi', function ($http) {
    return {
        templateUrl: BASE.PREFIX_URL + '/static/angular/directives/estatistica_ti.html',
        restrict: 'A',
        transclude: false,
        scope: {},
        link: function(scope, element, attrs){
            scope.lista = [];
            scope.hoje = new Date();
            scope.ontem = new Date();
            scope.ontem.setDate(scope.ontem.getDate() - 1);
            scope.hoje = scope.hoje.yyyy_mm_dd();
            scope.ontem = scope.ontem.yyyy_mm_dd();
            var url = BASE.URL_API + "/v1/ciman/estatistica_ti?token=91829febdc84c8a904887890e549284b&inicio=" + scope.ontem +"&fim="+ scope.hoje;
            $http(
                {method: "GET", url: url, headers: {'Content-Type': 'application/json'}}
            ).then(function successCallback(response) {
                var dado = response.data;
                charts_visualization_load()
                google.charts.setOnLoadCallback(drawChart);
                function drawChart() {
                    var data = google.visualization.arrayToDataTable([
                        ['Task', 'Hours per Day'],
                        ['TI sem foco:' + (dado.ti - dado.ti_focos), dado.ti - dado.ti_focos],
                        ['TI com foco:' + dado.ti_focos, dado.ti_focos],
                    ]);
                    var options = {
                      title: '% no total de terra indígena federal:' + dado.ti,
//                      pieSliceText: 'value'
                    };
                    var chart = new google.visualization.PieChart(document.getElementById('estatistica_ti'));
                    chart.draw(data, options);

                    var data = google.visualization.arrayToDataTable([
                        ['Task', 'Hours per Day'],
                        ['Área de Interesse sem foco:' + (dado.ti_ai - dado.ti_ai_focos), (dado.ti_ai - dado.ti_ai_focos)],
                        ['Área de Interesse com foco:' + dado.ti_ai_focos, dado.ti_ai_focos],
                    ]);
                    var options = {
                      title: '% no total de terra indígena federal com brigada:' + dado.ti_ai,
                      slices: {
                          0: { color: 'green' },
                          1: { color: '#ff6200' }
                      },
                    };
                    var chart = new google.visualization.PieChart(document.getElementById('estatistica_ti_ai'));
                    chart.draw(data, options);
                }
            }, function errorCallback(response) {
                console.log('erro')
                console.log(response);
            });
        }
    };
});


cimanApp.directive('estatisticaPa', function ($http) {
    return {
        templateUrl: BASE.PREFIX_URL + '/static/angular/directives/estatistica_pa.html',
        restrict: 'A',
        transclude: false,
        scope: {},
        link: function(scope, element, attrs){
            scope.lista = [];
            scope.hoje = new Date();
            scope.ontem = new Date();
            scope.ontem.setDate(scope.ontem.getDate() - 1);
            scope.hoje = scope.hoje.yyyy_mm_dd();
            scope.ontem = scope.ontem.yyyy_mm_dd();
            var url = BASE.URL_API + "/v1/ciman/estatistica_pa?token=91829febdc84c8a904887890e549284b&inicio=" + scope.ontem +"&fim="+ scope.hoje;
            $http(
                {method: "GET", url: url, headers: {'Content-Type': 'application/json'}}
            ).then(function successCallback(response) {
                var dado = response.data;
                charts_visualization_load()
                google.charts.setOnLoadCallback(drawChart);
                function drawChart() {
                    var data = google.visualization.arrayToDataTable([
                        ['Task', 'Hours per Day'],
                        ['PA sem foco:' + (dado.pa - dado.pa_focos), dado.pa - dado.pa_focos],
                        ['PA com foco:' + dado.pa_focos, dado.pa_focos],
                    ]);
                    var options = {
                      title: '% no Total de assentamentos:' + dado.pa,
//                      pieSliceText: 'value'
                    };
                    var chart = new google.visualization.PieChart(document.getElementById('estatistica_pa'));
                    chart.draw(data, options);

                    var data = google.visualization.arrayToDataTable([
                        ['Task', 'Hours per Day'],
                        ['Área de Interesse sem foco:' + (dado.pa_ai - dado.pa_ai_focos), (dado.pa_ai - dado.pa_ai_focos)],
                        ['Área de Interesse com foco:' + dado.pa_ai_focos, dado.pa_ai_focos],
                    ]);
                    var options = {
                      title: '% no total de assentamentos com brigada:' + dado.pa_ai,
                      slices: {
                          0: { color: 'green' },
                          1: { color: '#ff6200' }
                      },
                    };
                    var chart = new google.visualization.PieChart(document.getElementById('estatistica_pa_ai'));
                    chart.draw(data, options);
                }
            }, function errorCallback(response) {
                console.log('erro')
                console.log(response);
            });
        }
    };
});

cimanApp.directive('landsatImagens', function ($http, AreaInteresse, Foco) {
    return {
        templateUrl: BASE.PREFIX_URL + '/static/angular/directives/landsat-imagens.html',
        restrict: 'A',
        transclude: false,
        scope: {
            op: '@',
            quantidade: '@',
            classe: '@'
        },
        link: function(scope, elem, attr){
            $('#loading').show();
            scope.imagens = [];
            scope.classe = attr.classe;
            scope.op = attr.op;
            var url = BASE.URL_API + "/v1/satelites/landsat/imagens";
            $http({
                method: "GET",
                params: {op: attr.op, quantidade: attr.quantidade},
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function successCallback(response) {
                scope.imagens = response.data;
                $('#loading').hide();
            }, function errorCallback(response) {
                console.log("Erro");
                $('#loading').hide();
            });
            scope.add_to_map = function(s){
                if(!s.layer){
                    imageUrl = s.thumb_false_color;
                    aaa = [
                        [-9.07273, -50.78069],
                        [-11.1837, -48.68329]
                    ]
                    imageBounds = [
                        [parseFloat(s.max_lat), parseFloat(s.min_lon)],
                        [parseFloat(s.min_lat), parseFloat(s.max_lon)]
                    ];
                    s.layer = L.imageOverlay(imageUrl, imageBounds).addTo(mapa);
                    s.layer.bringToBack()
                } else {
                    mapa.removeLayer(s.layer);
                    s.layer = null;
                }
            }
        }
    };
});

cimanApp.directive('loader', function ($http) {
    return {
        templateUrl: BASE.PREFIX_URL + '/static/angular/directives/loader.html',
        restrict: 'A',
        transclude: true,
        // scope: {},
        link: function(scope, elem, attr){
            scope.loader = $http.pendingRequests;
            scope.img_loader = BASE.PREFIX_URL + "/static/img/loader.gif";
        }
    };
});

cimanApp.directive('datatable', function ($timeout) {
    return function(scope, element, attrs){
        if (scope.$last){
            $timeout(function () {
                var table_elem = $("#"+attrs.tableId);
                if(table_elem && table_elem.detroy){
                    table_elem.detroy();
                }
                table_elem.DataTable({
                    "paging": true,
                    "lengthChange": false,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "pageLength": 15,
                    "autoWidth": false,
                    "language": DATATABLE_CONFIG_LANGUAGE
                });
            }, 0);
        }
    }
});
