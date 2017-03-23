cimanApp.factory("Operacao", function (Ajax, AreaInteresse, Graficos,MapaAi, $http) {
    var obj = {
        lista_operacao: [],
        lista_operacoes: [],
        lista_operacoes_ativas: [],
        ai: AreaInteresse,
        requeima: [],
        requeima_cores: [],
        requeimas_no_mapa: [],
        checked_all: false,
        cor: false,
        e_requeimas_vermelho: false,
        e_requeimas_laranja: false,
        e_requeimas_amarelo: false,
        e_requeimas_azul: false,
        requeimas_selecionado_id: [],
        exportar_tipo: null,
        graficos: Graficos,
        features: null,
        hoje:new Date(),
        map: MapaAi,
        prop_fogo:[],
        prop_fogo_hoje:[],
        prop_estimativa:[],
        prop_dias:0
    };
    obj.exportar = function () {
        var tipo = obj.exportar_tipo;
        if (!tipo) return;
        obj.exportar_url = false;
        obj.loader = true;
        var that = this;
        var callback_success = function (response) {
            that.exportar_url = "//" + response.data.file;
            obj.loader = false;
        }
        var callback_error = function (response) {
            console.log("Erro");
        }
        var saida = {
            requeimas: obj.requeimas_selecionado_id,
            tipo: tipo
        }
        var dados = JSON.stringify(saida);
        var url = BASE.URL_API + "/v1/ciman/exportar_areas_filtradas?dados=" + dados;
        //// $('#loading').show();
        Ajax.request("GET", url, {}, callback_success, callback_error);
        // echo "csv, geojson, kml, shapefile"
    };

    obj.get_geo_diaria_total=function(id_op){
      // var ontem = new Date();
      // ontem.setDate()

        $http({
            method: "GET",
            params: {},
            url: BASE.URL_API + "/v1/ciman/requeimas_diario_op?op="+id_op+"&dt="+ontem.yyyy_mm_dd(),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            obj.prop_estimativa = response.data;

            var layer_total_est = L.geoJson(obj.prop_estimativa, {
               style: function (feature) {
                   return {
                         color: '#000',
                         weight: 2,
                         opacity: 1.0,
                         fillOpacity: 0.8,
                     };
                 }
             });

             var layer_diario_est = L.geoJson(obj.prop_estimativa.features[0].properties.geom_diario, {
                style: function (feature) {
                    return {
                          color: '#cc3333',
                          weight: 2,
                          opacity: 1.0,
                          fillOpacity: 0.8,
                      };
                  }
              });

             camada_total_est.clearLayers();
             camada_total_est.addLayer(layer_total_est);

             camada_diaria_est.clearLayers();
             camada_diaria_est.addLayer(layer_diario_est);

            //  if(layer_total_est){
            //    mapaestimativa.fitBounds(camadaAreasInteresse_op__est.getBounds());
            //  }

             $(".legend_mapaest").remove();

             LegendEst = L.control({position: 'bottomright'});

             LegendEst.onAdd = function (mapaestimativaOp) {
                  var legdiv = L.DomUtil.create('div', 'legend_mapaest');
                  legdiv.innerHTML +='<b class="legenda-titulo-topo"> ÁREA DE INTERESSE '+ obj.operacao_selecionada.area_interesse.titulo + '</b>' + '<br /> <b class="label label-danger legenda-titulo-est">EAQ Operacional:</b> ~' + Math.round(obj.prop_estimativa.features[0].properties.area_diaria) + '  km² <br>' + '<b class="label label-inverse legenda-titulo-est" style="background-color:#000;">EAQ Total:</b> ~' + Math.round(obj.prop_estimativa.features[0].properties.area_total) + '  km² <br>';
                 //  legdiv.update();
                  return legdiv;
              };
              LegendEst.addTo(mapaestimativaOp);

        }, function errorCallback(response) {
            console.log("erro");
        });
    }

    obj.set_geo_areainteresse=function(id_ai){
      $.ajax({
          dataType: "json",
          url: BASE.URL_API + "/v1/ciman/get_area_by_id/"+id_ai+"?retorno=geojson",
          success: function(data) {
              layer = L.geoJson(data, {
                  style: function (feature) {
                      return {
                        color: '#006a00',
                        weight: 4,
                        fillOpacity: 0.3,
                        fillColor: "transparent"
                      };
                  }
              });
              layerEst = L.geoJson(data, {
                  style: function (feature) {
                      return {
                        color: '#ff7e01',
                        weight: 4,
                        fillColor: "transparent"
                      };
                  }
              });

              camadaAreasInteresse_op.clearLayers();
              camadaAreasInteresse_op.addLayer(layer);
              camadaAreasInteresse_op__est.clearLayers();
              camadaAreasInteresse_op__est.addLayer(layerEst);
              mapaestimativaOp.fitBounds(layerEst.getBounds());

              // mapaestimativa.fitBounds(layerEst.getBounds());
          }
      });
    }
    obj.get_lista = function () {
        var that = this;
        var callback_success = function (response) {
            that.lista_operacao = response.data;
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        var url = BASE.URL_API + "/v1/ciman/get_lista_operacoes";
        //$('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    }
    obj.get_lista_ativa = function () {
        var that = this;
        var callback_success = function (response) {
            that.lista_operacao = response.data;
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        var url = BASE.URL_API + "/v1/ciman/get_lista_operacoes?situacao=ativo";
        //$('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    }
    obj.get_historico_todos_anos = function (id) {
        var that = this;
        var callback_success = function (response) {
            that.dados_historico = response.data;
            that.dados_historico.totais = [];
            that.dados_historico.maximo = [];
            that.dados_historico.minimo = [];
            that.dados_historico.media = [];
            that.dados_historico.anos = [];
            for (var i = 0; i < that.dados_historico.length; i++) {
                that.dados_historico[i].dcounts = [];
                for (var j = 0; j < that.dados_historico[i].meses.length; j++) {
                    that.dados_historico[i].dcounts.push(that.dados_historico[i].meses[j].dcount);
                }
                that.dados_historico[i].total = math.sum(that.dados_historico[i].dcounts);
                that.dados_historico.totais.push(that.dados_historico[i].total);
                that.dados_historico.anos[i] = that.dados_historico[i].ano;
            }
            that.dados_historico.meses = [];
            var k = [];
            for (var m = 0; m < 12; m++) {
                var mes = [];
                for (var i = 0; i < that.dados_historico.length - 1; i++) {
                    mes.push(that.dados_historico[i].dcounts[m]);
                }
                k[m] = mes;
                that.dados_historico.meses[m] = k;
                that.dados_historico.maximo[m] = math.max(mes);
                that.dados_historico.minimo[m] = math.min(mes);
                that.dados_historico.media[m] = parseInt(math.mean(mes));
            }
            that.dados_historico.maior = math.max(that.dados_historico.totais);
            that.dados_historico.menor = math.min(that.dados_historico.totais);
            that.dados_historico.meio = parseInt(math.mean(that.dados_historico.totais));
            // that.graficos.serie_historica(that.dados_historico);
            // that.graficos.anual(that.dados_historico);
            // that.graficos.semestre1(that.dados_historico);
            // that.graficos.semestre2(that.dados_historico);


            // //$('#loading').hide();
            return response.data;

        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }

        var url = BASE.URL_API + "/v1/ciman/focos_ai/" + obj.operacao_selecionada.area_interesse.id + "?tipo=historico";

        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    }
    obj.inicia_grafico = function () {
        $("#focos").addClass('active in')
        obj.graficos.anual(obj.dados_historico);
        obj.graficos.serie_historica(obj.dados_historico);
        obj.graficos.semestre1(obj.dados_historico);
        obj.graficos.semestre2(obj.dados_historico);
        obj.grafico_7_dias();
    };
    obj.grafico_7_dias = function () {
        var that = this;
        var callback_success = function (response) {
            that.graficos.ai_7(response.data);
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            // //$('#loading').hide();
            console.log("Erro");
        }
        //var id = get_last_param_url();
        var data = new Date();
        data.setDate(data.getDate() - 7);

        var url = BASE.URL_API + "/v1/ciman/focos_ai/" + obj.operacao_selecionada.area_interesse.id + "?tipo=quantitativo&data_inicio=" + data.yyyy_mm_dd();

        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error);
    }
    obj.get_lista_operacoes = function (texto, tipo, page) {
        if(obj.lista_operacoes && typeof obj.lista_operacoes.operacoes != "undefined" && obj.lista_operacoes.operacoes.length){
            return;
        }
        var that = this;
        texto_filtro = $("#ipTodasOperacao").val();
        data = $("#data").val();

        var callback_success = function (response) {
            that.lista_operacoes = response.data;
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }

        if (obj.lista_operacoes.length)
            for (var i = 0; i < that.paginacao.length; i++)
                if (that.paginacao[i].label == page && that.paginacao[i].classe == "active")
                    return;
        if (!page) page = 1
        if (page == "«") page = 1
        if (page == "»") page = -1
        if (page == "...") return;


        var url = BASE.URL_API + "/v1/ciman/get_lista_operacoes?texto=" + texto + "&tipo=" + tipo + "&page=" + page+"&filtro="+texto_filtro+"&data="+data;
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    }
    obj.get_lista_operacoes_ativas = function () {
        if(obj.lista_operacoes_ativas.length){
            return;
        }
        var that = this;
        texto = $("#ipOperacaoAtiva").val();

        var callback_success = function (response) {
            that.lista_operacoes_ativas = response.data;
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        var url = BASE.URL_API + "/v1/ciman/get_lista_operacoes_ativas?texto=" + texto;
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    }

    obj.get_op_by_id = function (id) {
        var that = this;
        var callback_success = function (response) {
            that.operacao_selecionada = response.data;
            that.operacao_selecionada.img_contexto_brasil = BASE.PREFIX_URL + "/static/img/" + that.operacao_selecionada.img_contexto_brasil;
            // //$('#loading').hide();

            //POPULANDO AS REQUEIMAS EM DIAS
            var callback_success = function (response) {
                that.list_req_ai_id = response.data;
                // //$('#loading').hide();
            }
            var callback_error = function (response) {
                console.log("Erro");
                // //$('#loading').hide();
            }
            var url = BASE.URL_API + "/v1/ciman/requeimas_by_ai_classificacao?inicio=" + that.operacao_selecionada.data_inicio + "&fim=" + that.operacao_selecionada.data_fim + "&ai_id=" + that.operacao_selecionada.area_interesse.id;
            //// $('#loading').show();
            Ajax.request("GET", url, that, callback_success, callback_error)


            //POPULANDO AS REQUEIMAS GERAL
            var callback_success = function (response) {
                that.list_req_all = response.data;
                // //$('#loading').hide();
            }
            var callback_error = function (response) {
                console.log("Erro");
                // //$('#loading').hide();
            }
            var url = BASE.URL_API + "/v1/ciman/requeimas_by_ai_all?inicio=" + that.operacao_selecionada.data_inicio + "&fim=" + that.operacao_selecionada.data_fim + "&ai_id=" + that.operacao_selecionada.area_interesse.id;
            //// $('#loading').show();
            Ajax.request("GET", url, that, callback_success, callback_error)


            //POPULANDO OS EVENTOS
            var callback_success = function (response) {
                that.list_evnt_all = response.data;
                // //$('#loading').hide();
            }
            var callback_error = function (response) {
                console.log("Erro");
                // //$('#loading').hide();
            }
            var url = BASE.URL_API + "/v1/ciman/eventos_by_ai_id_all?inicio=" + that.operacao_selecionada.data_inicio + "&fim=" + that.operacao_selecionada.data_fim + "&ai_id=" + that.operacao_selecionada.area_interesse.id;
            //// $('#loading').show();
            Ajax.request("GET", url, that, callback_success, callback_error);

            that.ai.id = that.operacao_selecionada.area_interesse.id;
            that.ai.get_area_by_id(that.operacao_selecionada.area_interesse.id, "geojson");
            // that.ai.get_requeima_cores(that.operacao_selecionada.area_interesse.id);
            // that.ai.get_requeima(that.operacao_selecionada.area_interesse.id);
            that.ai.get_requeimas_ativas(that.operacao_selecionada.area_interesse.id);
            that.get_historico_todos_anos(that.operacao_selecionada.area_interesse.id);
            that.set_geo_areainteresse(that.operacao_selecionada.area_interesse.id);
            // that.grafico_7_dias(that.operacao_selecionada.area_interesse.id);
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        var url = BASE.URL_API + "/v1/ciman/get_operacao_by_id/" + id;
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)

    }
    obj.inicia_grafico_requeima_cores = function(){
        if(!obj.mostra_grafico_requeima){
            obj.mostra_grafico_requeima = true;
            obj.get_requeima_cores(get_last_param_url());
        }
    }

    obj.get_requeima_cores = function (id, retorno) {
        var that = this;
        var callback_success = function (response) {
            that.requeima_cores = response.data;
            that.graficos.barClassificacaoEventos(response.data)
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        var url = BASE.URL_API + "/v1/ciman/requeimas_cores_op/" + id;
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };

    obj.get_requeima = function (id) {
        var that = this;
        var callback_success = function (response) {
            that.requeima = response.data;

            var inativos = [];
            if(that.requeima.features){
                for (var i = 0; i < that.requeima.features.length; i++) {
                    var element = that.requeima.features[i];
                    if(!element.properties.ativo){
                        inativos.push(element);
                    }
                }
            }
            camadaEventosRequeimaUltimaSemana.addLayer(adicionaRequeima(inativos));
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        var url = BASE.URL_API + "/v1/ciman/requeimas_op/" + id;
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };

    obj.get_requeima_ativos = function (id) {
        var that = this;
        var callback_success = function (response) {
            that.requeima_ativas = response.data;
            var ativos = [];
            if(that.requeima_ativas.features){
                for (var i = 0; i < that.requeima_ativas.features.length; i++) {
                    var element = that.requeima_ativas.features[i];
                    if(element.properties.ativo){
                        ativos.push(element);
                    }
                }
            }
            camadaEventosRequeima.addLayer(adicionaRequeima(ativos));
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        var url = BASE.URL_API + "/v1/ciman/requeimas_ativas_op?op_id=" + id;
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };


    obj.update_mapa_requeima = function () {
        for (var i = 0; i < obj.requeimas_no_mapa.length; i++) {
            mapa.removeLayer(obj.requeimas_no_mapa[i]);
        }
        // obj.requeimas_no_mapa = [];
        obj.requeimas_selecionado_id = [];
        for (var i = 0; i < obj.requeima.features.length; i++) {
            if (obj.requeima.features[i].checked) {
                obj.requeimas_selecionado_id.push(obj.requeima.features[i].id)
                var data = obj.requeima.features[i];
                var option = {
                    weight: 2,
                    opacity: 1.0,
                    fillOpacity: 0.6
                }
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

cimanApp.factory("AreaInteresse", function (Ajax, MapaAi, Graficos, ngProgressFactory, $sce, $http) {
    var obj = {
        id: get_last_param_url(),
        lista_areas: [],
        area: {},
        map: MapaAi,
        graficos: Graficos,
        dados_historico: [],
        requeima: [],
        requeima_cores: [],
        requeimas_no_mapa: [],
        lista_requeimasativas:[],
        checked_all: false,
        cor: false,
        e_requeimas_vermelho: false,
        e_requeimas_laranja: false,
        e_requeimas_amarelo: false,
        e_requeimas_azul: false,
        requeimas_selecionado_id: [],
        exportar_tipo: null,
        lista_path_row:[],
        total_km_queimado:0,
        total_campos_fut:0,
        fogograma:null,
        prop_estimativa:[],
        hoje:new Date()
    };

    obj.get_lista_areas = function (texto, tipo, hasop, hasfc, page) {
        var that = this;
        that.progressbar = ngProgressFactory.createInstance();
        that.progressbar.setHeight("5px");

        var callback_success = function (response) {
            that.lista_areas = response.data;
            // //$('#loading').hide();
            that.progressbar.complete();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }

        if (obj.lista_areas.length)
            for (var i = 0; i < that.paginacao.length; i++)
                if (that.paginacao[i].label == page && that.paginacao[i].classe == "active")
                    return;
        if (!page) page = 1
        if (page == "«") page = 1
        if (page == "»") page = -1
        if (page == "...") return;

        var url = BASE.URL_API + "/v1/ciman/get_lista_areas?texto=" + texto + "&tipo=" + tipo + "&hasop=" + hasop + "&hasfc=" + hasfc + "&page=" + page;
        that.progressbar.start();
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };
    obj.get_geo_diaria_total=function(id_ai){
      // var ontem = new Date();
      // ontem.setDate()

        $http({
            method: "GET",
            params: {},
            url: BASE.URL_API + "/v1/ciman/requeimas_diario_ai?ai="+id_ai+"&dt=2016-09-05",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {

            var opcoesUrl = {
                subdomains: [1, 2, 3, 4],
                appId: 'jp8lSJgNGn21e6cUniXC',
                appCode: 'TN6fkxHoLvwcxH7LMYfArA',
                language: 'por',
                attribution: '&copy; 1998 - 2016 <a target="_blank" href="http://www.inpe.br/queimadas">INPE - Queimadas</a>'
            };

            //Mapa estimativa

            var cloudmadeUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
              cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution});

            // Construindo a camada de terreno
            var camadaTerrenoEstimativa = L.tileLayer('//{s}.aerial.maps.api.here.com/maptile/2.1/'
                + 'maptile/newest/terrain.day/{z}/{x}/{y}/256/jpg'
                + '?app_id={appId}&app_code={appCode}&lg={language}', opcoesUrl);

            // Configurando o Padrão da estimativa
            var camada_total_est = L.layerGroup();
            var camada_diaria_est = L.layerGroup();
            var camada_geo_ai = L.layerGroup();
            var legend_est = L.control({position: 'bottomright'});
            var grid = L.latlngGraticule({
                        showLabel: true,
                        color:'#000',
                        weight:0.5,
                        opacity:0.6,
                        zoomInterval: [
                            {start: 2, end: 3, interval: 30},
                            {start: 4, end: 4, interval: 10},
                            {start: 5, end: 7, interval: 5},
                            {start: 8, end: 10, interval: 1}
                        ]
                    });

            // Definições
            mapaestimativa = L.map('mapaestimativa', {
              zoomControl:false,
              zoomAnimation:false,
              markerZoomAnimation:false,
              fadeAnimation:false,
              center: [-15.8, -47.9],
              layers: [cloudmade, camada_geo_ai, camada_total_est, camada_diaria_est, grid]
            });

            obj.prop_estimativa = response.data;

            layer_total_est = L.geoJson(obj.prop_estimativa.features[0].geometry, {
               style: function (feature) {
                   return {
                         color: '#000',
                         weight: 2,
                         opacity: 1.0,
                         fillOpacity: 0.8,
                     };
                 }
             });

             layer_diario_est = L.geoJson(obj.prop_estimativa.features[0].properties.geom_diario, {
                style: function (feature) {
                    return {
                          color: '#cc3333',
                          weight: 2,
                          opacity: 1.0,
                          fillOpacity: 0.8,
                      };
                  }
              });


              layer_geo_ai = L.geoJson(obj.area.geometry, {
                 style: function (feature) {
                     return {
                         color: '#ff7e01',
                         weight: 4,
                         fillColor: "transparent"
                       };
                   }
               });

             camada_total_est.clearLayers();
             camada_total_est.addLayer(layer_total_est);

             camada_diaria_est.clearLayers();
             camada_diaria_est.addLayer(layer_diario_est);

             camada_geo_ai.clearLayers();
             camada_geo_ai.addLayer(layer_geo_ai);

            //  if(layer_total_est){
            //    mapaestimativa.fitBounds(camadaAreasInteresse_op__est.getBounds());
            //  }

             $(".legend_mapaest").remove();

             LegendEst = L.control({position: 'bottomright'});

             LegendEst.onAdd = function (mapaestimativa) {
                  var legdiv = L.DomUtil.create('div', 'legend_mapaest');
                  legdiv.innerHTML +='<b class="legenda-titulo-topo"> ÁREA DE INTERESSE '+ obj.area.properties.titulo + '</b>' + '<br /> <b class="label label-danger legenda-titulo-est">EAQ Operacional:</b> ~' + Math.round(obj.prop_estimativa.features[0].properties.area_diaria) + '  km² <br>' + '<b class="label label-inverse legenda-titulo-est" style="background-color:#000;">EAQ Total:</b> ~' + Math.round(obj.prop_estimativa.features[0].properties.area_total) + '  km² <br>';
                 //  legdiv.update();
                  return legdiv;
              };
              LegendEst.addTo(mapaestimativa);

        }, function errorCallback(response) {
            console.log("erro");
        });
    };
    obj.get_historico_todos_anos = function (id) {
        var that = this;
        var callback_success = function (response) {
            that.dados_historico = response.data;
            that.dados_historico.totais = [];
            that.dados_historico.maximo = [];
            that.dados_historico.minimo = [];
            that.dados_historico.media = [];
            that.dados_historico.anos = [];
            for (var i = 0; i < that.dados_historico.length; i++) {
                that.dados_historico[i].dcounts = [];
                for (var j = 0; j < that.dados_historico[i].meses.length; j++) {
                    that.dados_historico[i].dcounts.push(that.dados_historico[i].meses[j].dcount);
                    that.dados_historico[i].dcounts.push(that.dados_historico[i].meses[j].dcount);
                }
                that.dados_historico[i].total = math.sum(that.dados_historico[i].dcounts);
                that.dados_historico.totais.push(that.dados_historico[i].total);
                that.dados_historico.anos[i] = that.dados_historico[i].ano;
            }
            that.dados_historico.meses = [];
            var k = [];
            for (var m = 0; m < 12; m++) {
                var mes = [];
                for (var i = 0; i < that.dados_historico.length - 1; i++) {
                    mes.push(that.dados_historico[i].dcounts[m]);
                }
                k[m] = mes;
                that.dados_historico.meses[m] = k;
                that.dados_historico.maximo[m] = math.max(mes);
                that.dados_historico.minimo[m] = math.min(mes);
                that.dados_historico.media[m] = parseInt(math.mean(mes));
            }
            that.dados_historico.maior = math.max(that.dados_historico.totais);
            that.dados_historico.menor = math.min(that.dados_historico.totais);
            that.dados_historico.meio = parseInt(math.mean(that.dados_historico.totais));
            // //$('#loading').hide();
            return response.data;
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        var url = BASE.URL_API + "/v1/ciman/focos_ai/" + id + "?tipo=historico";
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };
    obj.inicia_grafico = function () {
        $("#focos").addClass('active in')
        obj.graficos.anual(obj.dados_historico);
        obj.graficos.serie_historica(obj.dados_historico);
        obj.graficos.semestre1(obj.dados_historico);
        obj.graficos.semestre2(obj.dados_historico);
        obj.grafico_7_dias();
    }
    obj.inicia_grafico_requeima_cores = function(){
        if(!obj.mostra_grafico_requeima){
            obj.mostra_grafico_requeima = true;
            obj.get_requeima_cores(get_last_param_url());
        }
    }
    obj.get_requeima_cores = function (id, retorno) {
        var that = this;
        var callback_success = function (response) {
            that.requeima_cores = response.data;
            that.graficos.barClassificacaoEventos(that.requeima_cores);
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        var url = BASE.URL_API + "/v1/ciman/requeimas_cores_ai/" + id;
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };
    obj.foco_na_ai = function (id, retorno) {
        mapa.fitBounds(ai_layer.getBounds());
    };
    obj.get_path_row = function (id, retorno) {
        var that = this;
        var callback_success = function (response) {
            that.lista_path_row = response.data;
            // that.graficos.barClassificacaoEventos(response.data)
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        var url = BASE.URL_API + "/v1/ciman/path_row_ai/" + id;
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };
    obj.get_requeima = function (id) {
        var that = this;
        var callback_success = function (response) {
            that.requeima = response.data;
            var ativos = [];
            var inativos = [];
            if(that.requeima.features){
                for (var i = 0; i < that.requeima.features.length; i++) {
                    var element = that.requeima.features[i];
                    if(element.properties.ativo){
                        ativos.push(element);
                    } else {
                        inativos.push(element);
                    }
                }
            }
            camadaEventosRequeima.addLayer(adicionaRequeima(ativos));
            camadaEventosRequeimaUltimaSemana.addLayer(adicionaRequeima(inativos));

        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        var url = BASE.URL_API + "/v1/ciman/requeimas_ai/" + id;
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };

    obj.sce = function (src){
      return $sce.trustAsResourceUrl(src);
    }

    obj.get_area_by_id = function (id, retorno) {
        var that = this;
        var callback_success = function (response) {
            that.area = response.data;
            that.map.map_ai("geometria", that.area);

            var centroid = L.latLngBounds(ai_layer.getLatLngs()).getCenter();
            var imgFogograma = $("#ifFogograma");
            var url = "https://queimadas.dgi.inpe.br/queimada/risco_fogo/fogograma2.jsp?";
            fogograma = url+"x="+centroid.lng+"&y="+centroid.lat
            imgFogograma.attr("src", fogograma);

            that.get_geo_diaria_total(id);

        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        var url = BASE.URL_API + "/v1/ciman/get_area_by_id/" + id + "?retorno=" + retorno;
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };

    obj.grafico_7_dias = function () {
        var that = this;
        var data = new Date();
        data.setDate(data.getDate() - 7);

        var callback_success = function (response) {
            that.graficos.ai_7(response.data);
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }

        var url = BASE.URL_API + "/v1/ciman/focos_ai/" + obj.id + "?tipo=quantitativo&data_inicio=" + data.yyyy_mm_dd();
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error);
    };
    url_ponto_atencao_antiga = ""
    obj.get_pontosatencao = function (id, estado) {
        var that = this;
        var callback_success = function (response) {
            that.lista_areas = response.data;

             for (var i = 0; i < that.lista_areas.length; i++) {
               var area = that.lista_areas[i];
               area.total = area.e_requeimas_amarelo+area.e_requeimas_azul+area.e_requeimas_laranja+area.e_requeimas_vermelho;
             }
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }

        data = $("#data").val();
        texto = $("#ipEventosClassificacao").val();
        // estado = $("#estadoFiltro").val();

        data_ponto_atencao = data;
        if(data == hoje.yyyy_mm_dd()){
            data_ponto_atencao = ontem.yyyy_mm_dd();
        }

        url_ponto_atencao = BASE.URL_API + "/v1/ciman/pontos_ai?data=" + data_ponto_atencao + "&texto=" + texto + "&estado=" + estado.nome_bdq+"&inst="+getParameterByName('inst');
        if(url_ponto_atencao_antiga == url_ponto_atencao){
            return;
        }
        url_ponto_atencao_antiga = url_ponto_atencao;
        //// $('#loading').show();
        Ajax.request("GET", url_ponto_atencao, that, callback_success, callback_error)
    };
    obj.update_mapa_requeima = function () {
        for (var i = 0; i < obj.requeimas_no_mapa.length; i++) {
            mapa.removeLayer(obj.requeimas_no_mapa[i]);
        }
        // obj.requeimas_no_mapa = [];
        obj.requeimas_selecionado_id = [];
        for (var i = 0; i < obj.requeima.features.length; i++) {
            if (obj.requeima.features[i].checked) {
                obj.requeimas_selecionado_id.push(obj.requeima.features[i].id)
                var data = obj.requeima.features[i];
                var option = {
                    weight: 2,
                    opacity: 1.0,
                    fillOpacity: 0.6
                }
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
    obj.exportar = function () {
        var tipo = obj.exportar_tipo;
        if (!tipo) return;
        obj.exportar_url = false;
        obj.loader = true;
        var that = this;
        var callback_success = function (response) {
            that.exportar_url = "//" + response.data.file;
            obj.loader = false;
        }
        var callback_error = function (response) {
            console.log("Erro");
        }
        var saida = {
            requeimas: obj.requeimas_selecionado_id,
            tipo: tipo
        }
        var dados = JSON.stringify(saida);
        alert(dados);
        var url = BASE.URL_API + "/v1/ciman/exportar_areas_filtradas?dados=" + dados;
        //// $('#loading').show();
        Ajax.request("GET", url, {}, callback_success, callback_error);
        // echo "csv, geojson, kml, shapefile"
    };
    url_model_get_area_interesse_antiga = ""
    obj.get_area_interesse = function (retorno) {
        var that = this;
        var callback_success = function (response) {
            that.lista_areas = response.data;
            // //$('#loading').hide();

            // that.map.mapa = mapa;
            // // that.map.map_ai("mapa", that.lista_areas);
            // that.map.addcamadaAreasInteresse(that.lista_areas);
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        url_model_get_area_interesse = BASE.URL_API + "/v1/ciman/get_area_interesse?retorno=" + retorno;
        if(url_model_get_area_interesse_antiga == url_model_get_area_interesse){
            return;
        }
        url_model_get_area_interesse_antiga = url_model_get_area_interesse;
        //// $('#loading').show();
        Ajax.request("GET", url_model_get_area_interesse, that, callback_success, callback_error)
    };
    obj.geojson_eventos_requeimas_areas_interesse = function (data, estado) {
        var that = this;
        data = $("#data").val();
        // estado = $("#estadoFiltro").val();
        var callback_success = function (response) {
            that.requeima = response.data;
            // //$('#loading').hide();
        };
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        };
        var url = BASE.URL_API + "/v1/ciman/geojson_eventos_requeimas_areas_interesse?data=" + data+"&estado="+estado.nome_bdq+"&inst="+getParameterByName('inst');
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };
    obj.zoom_ai = function (lista) {
        var layers_ai_selecionadas = [];
        for (var i = 0; i < lista.length; i++) {
            for (var j = 0; j < layers_area_interesse.length; j++) {
                if (layers_area_interesse[j].feature.id == lista[i].ai_id && lista[i].checked) {
                    layers_ai_selecionadas.push(layers_area_interesse[j]);
                    break;
                }
            }
        }
        if (layers_ai_selecionadas.length) {
            var group = new L.featureGroup(layers_ai_selecionadas);
            mapa.fitBounds(group.getBounds(), {padding: [10, 10]});
        } else {
            mapa.fitBounds([[-35.9, -76.0], [7.3, -26.6]]);
        }
    };
    obj.get_requeimas_ativas = function (id) {
        var that = this;
        var callback_success = function (response) {
            that.lista_requeimasativas = response.data;

            for (var i = 0; i < that.lista_requeimasativas.length; i++) {
              that.total_km_queimado = that.total_km_queimado + that.lista_requeimasativas[i].area_km;
            }

            that.total_km_queimado = parseInt(that.total_km_queimado)
            // Adotado como medida 120m X 90m = 10800m² ~ 0,0108 km²
            that.total_campos_fut = parseInt(that.total_km_queimado/0.0108);
        }
        var callback_error = function (response) {
            console.log("Erro");
        }
        var url = BASE.URL_API + "/v1/ciman/requeimas_ativas_ai?ai_id="+id;
        Ajax.request("GET", url, that, callback_success, callback_error)
    };
    return obj;
});

cimanApp.factory("Municipio", function (Ajax, Graficos, Estado, MapaMunicipio, ngProgressFactory) {
    var obj = {
        mapa: MapaMunicipio,
        lista_municipios: [],
        Estado: Estado,
        paginacao: [],
        filtro_tipo: "nome",
        filtro_valor: "",
        munic_no_mapa: [],
        munic_selecionado:null,
        areas_interesses:null,
        requeimas:null,
        requeima_classif:null,
        graficos: Graficos,
        graficos_iniciados:false,
        requeimas_no_mapa:[],

    };
    obj.update_mapa_requeima = function () {

        for (var i = 0; i < obj.requeimas_no_mapa.length; i++) {
            mapa.removeLayer(obj.requeimas_no_mapa[i]);
        }
        obj.requeimas_no_mapa = [];
        obj.requeimas_selecionado_id = [];
        for (var i = 0; i < obj.requeimas.features.length; i++) {
            if (obj.requeimas.features[i].checked) {
                obj.requeimas_selecionado_id.push(obj.requeimas.features[i].id)
                var data = obj.requeimas.features[i];
                var option = {
                    weight: 2,
                    opacity: 1.0,
                    fillOpacity: 0.6
                }
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
        // } else {
        //     mapa.fitBounds(ai_layer.getBounds());
        }

    };

    obj.foco_municipio = function(){
        mapa.fitBounds(layer_municipio.getBounds(), {padding: [10, 10]});
    }

    obj.get_pontosatencao = function (id, estado) {
        if(obj.lista_municipios.length){
            return;
        }

        data = $("#data").val();
        texto = $("#ipEventoMunicipio").val();
        // estado = $("#estadoFiltro").val();

        var that = this;
        var callback_success = function (response) {
            that.lista_municipios = response.data;
            for (var i = 0; i < that.lista_municipios.length; i++) {
              var mn = that.lista_municipios[i];
              mn.total = mn.e_requeimas_amarelo+mn.e_requeimas_azul+mn.e_requeimas_laranja+mn.e_requeimas_vermelho;
            }
            // $scope.progressbar.complete();
            // //$('#loading').hide();
        };
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        };
        var url = BASE.URL_API + "/v1/ciman/eventos_requeimas_munic_all?data=" + data + "&texto=" + texto+"&estado=" + estado.nome_bdq;
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };

    obj.inicia_grafico = function(){
        if(obj.graficos_iniciados){
            return;
        }
        obj.graficos_iniciados = true;
        $("#focos").addClass('active in')
        obj.graficos.serie_historica(obj.dados_historico);
        obj.graficos.anual(obj.dados_historico);
        obj.graficos.semestre1(obj.dados_historico);
        obj.graficos.semestre2(obj.dados_historico);
        obj.grafico_7_dias(get_last_param_url());
    }

    obj.get_historico_todos_anos = function (id) {
        var that = this;
        var callback_success = function (response) {
            that.dados_historico = response.data;
            that.dados_historico.totais = [];
            that.dados_historico.maximo = [];
            that.dados_historico.minimo = [];
            that.dados_historico.media = [];
            that.dados_historico.anos = [];
            for (var i = 0; i < that.dados_historico.length; i++) {
                that.dados_historico[i].dcounts = [];
                for (var j = 0; j < that.dados_historico[i].meses.length; j++) {
                    that.dados_historico[i].dcounts.push(that.dados_historico[i].meses[j].quantidade_focos);
                }
                that.dados_historico[i].total = math.sum(that.dados_historico[i].dcounts);
                that.dados_historico.totais.push(that.dados_historico[i].total);
                that.dados_historico.anos[i] = that.dados_historico[i].ano;
            }
            that.dados_historico.meses = [];
            var k = [];
            for (var m = 0; m < 12; m++) {
                var mes = [];
                for (var i = 0; i < that.dados_historico.length - 1; i++) {
                    mes.push(that.dados_historico[i].dcounts[m]);
                }
                k[m] = mes;
                that.dados_historico.meses[m] = k;
                that.dados_historico.maximo[m] = math.max(mes);
                that.dados_historico.minimo[m] = math.min(mes);
                that.dados_historico.media[m] = parseInt(math.mean(mes));
            }
            that.dados_historico.maior = math.max(that.dados_historico.totais);
            that.dados_historico.menor = math.min(that.dados_historico.totais);
            that.dados_historico.meio = parseInt(math.mean(that.dados_historico.totais));
            // //$('#loading').hide();

            return response.data;
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        var url = BASE.URL_API + "/v1/ciman/focos_mn/" + id + "?tipo=historico";
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };

    obj.grafico_7_dias = function (id) {
        var that = this;
        var callback_success = function (response) {
            that.graficos.ai_7(response.data);
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        //var id = get_last_param_url();
        var data = new Date();
        data.setDate(data.getDate() - 7);

        var url = BASE.URL_API + "/v1/ciman/focos_mn/" + id + "?tipo=quantitativo&data_inicio=" + data.yyyy_mm_dd();
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error);
    };

    obj.get_municipio_by_id = function (id, retorno) {

        var that = this;
        var callback_success = function (response) {
            that.munic_selecionado = response.data;
            obj.mapa.add_munic(response.data);
            // //$('#loading').hide();
        };
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        };
        var url = BASE.URL_API + "/v1/geo/municipio/" + id + "?retorno=geojson&token=91829febdc84c8a904887890e549284b";
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };

    obj.get_areas_interesse_by_municipio_id = function (id, retorno) {
        var that = this;
        var callback_success = function (response) {
            that.areas_interesses = response.data;
            // //$('#loading').hide();
        };
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        };

        var url = BASE.URL_API + "/v1/ciman/get_lista_ai_by_municipio_id/" + id;
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };

    obj.get_requeima_by_municipio_id = function (id, retorno) {
        var dataAtual = new Date();
        var AnoAtual = dataAtual.getFullYear();

        var that = this;
        var callback_success = function (response) {
            that.requeimas = response.data;
            // //$('#loading').hide();
        };
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        };

        var url = BASE.URL_API + "/v1/ciman/get_requeima_by_municipio_id/" + id + "?data=" + AnoAtual + "-01-01";
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };

    obj.get_brigadas_by_municipio_id = function (id, retorno) {
        var that = this;
        var callback_success = function (response) {
            that.brigadas = response.data;
            // //$('#loading').hide();
        };
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        };

        var url = BASE.URL_API + "/v1/ciman/get_brigadas_by_municipio_id/" + id;
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };

    obj.inicia_grafico_requeima_cores = function(){
        if(!obj.mostra_grafico_requeima){
            obj.mostra_grafico_requeima = true;
            $("#eventos").addClass("active in");
            obj.get_evento_classificacao_by_municipio_id(get_last_param_url());
        }
    }

    obj.get_evento_classificacao_by_municipio_id = function (id, retorno) {
        var that = this;

        var dataAtual = new Date();
        var AnoAtual = dataAtual.getFullYear();

        var callback_success = function (response) {
            that.requeima_classif = response.data;
            that.graficos.barClassificacaoEventos(response.data);
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }

        var url = BASE.URL_API + "/v1/ciman/get_evento_classificacao_by_municipio_id/" + id + "?data=" + AnoAtual + "-01-01";
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    }

    obj.get_lista_municipios = function (page) {
        var that = this;
        var callback_success = function (response) {
            that.lista_municipios = response.data.municipios;
            that.paginacao = response.data.paginacao;
            that.exibindo = response.data.exibindo;
            // //$('#loading').hide();
        };
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        };
        if (obj.lista_municipios.length)
            for (var i = 0; i < that.paginacao.length; i++)
                if (that.paginacao[i].label == page && that.paginacao[i].classe == "active")
                    return;
        if (!page) page = 1;
        if (page == "«") page = 1;
        if (page == "»") page = -1;
        if (page == "...") return;
        var estados = [];
        for (var i = 0; i < obj.Estado.selecionados.length; i++) {
            estados.push(obj.Estado.selecionados[i].gid);
        }
        var url = BASE.URL_API + "/v1/ciman/lista_municipios?page=" + page + "&estados=" + estados + "&valor=" + that.filtro_valor + "&tipo=" + that.filtro_tipo;
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };
    obj.zoom_munic = function (munic_id) {
        var that = this;
        for (var i = 0; i < obj.munic_no_mapa.length; i++) {
            mapa.removeLayer(obj.munic_no_mapa[i]);
        }
        var callback_success = function (response) {
            var poli = L.geoJson(response.data, {
                style: function (feature) {
                    return {
                        color: '#0000ff',
                        "fillColor": "transparent",
                        "weight": 2,
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

            poli.addTo(mapa);
            obj.munic_no_mapa.push(poli.getLayers()[0]);
            if (obj.munic_no_mapa.length) {
                var group = new L.featureGroup(obj.munic_no_mapa);
                mapa.fitBounds(group.getBounds(), {padding: [10, 10]});
            } else {
                mapa.fitBounds([[-35.9, -76.0], [7.3, -26.6]]);
            }
            // //$('#loading').hide();
        };
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        };
        for (var i = 0; i < obj.munic_no_mapa.length; i++) {
            var poli = obj.munic_no_mapa[i];
            if (obj.munic_no_mapa[i].feature && obj.munic_no_mapa[i].feature.id == munic_id) {
                poli.addTo(mapa);
                mapa.fitBounds(poli.getBounds());
                return;
            }
        }
        var url = BASE.URL_API + "/v1/geo/municipio/" + munic_id + "?retorno=geojson&token=" + token;
        //// $('#loading').show();
        Ajax.request("GET", url, {}, callback_success, callback_error);
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
        for (var i = 0; i < obj.requeimas.features.length; i++) {
            var data = obj.requeimas.features[i];
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
    obj.get_munic_lista_municipios = function (lista, lista_geo) {
        var selecionadas = [];
        for (var i = 0; i < lista.length; i++) {
            for (var j = 0; j < lista_geo.length; j++) {
                if (lista_geo[j].id == lista[i].munic_id && lista[i].checked) {
                    lista_geo[j].checked = true;
                    selecionadas.push(lista_geo[j]);
                    break;
                }
            }
        }
        obj.zoom_munic(selecionadas);
    };
    return obj;
});

cimanApp.factory("Foco", function (Ajax, Graficos) {
    var obj = {
        lista_municipios: [],
        lista_focos_7_munic: [],
        graficos: Graficos
    };
    obj.foco_municipio = function (ai_id_selecionado) {
        var that = this;
        for (var i = 0; i < layers_area_interesse.length; i++) {
            if (layers_area_interesse[i].feature && layers_area_interesse[i].feature.id == ai_id_selecionado) {
                mapa.fitBounds(layers_area_interesse[i].getBounds());
                return;
            }
        }
        var callback_success = function (response) {
            var features = L.geoJson(response.data, {
                style: function (feature) {
                    switch (feature.properties.tipo) {
                        default:
                            preenchimento = '#0000ff';
                            break;
                    }

                    return {
                        "color": preenchimento,
                        "fillColor": "transparent",
                        "weight": 2
                    };
                }, onEachFeature: function (feature, layer) {
                    var conteudo = '<table class="table table-striped table-condensed">'
                        + '<thead>'
                        + '<tr><th colspan="2">Área de interesse</th></tr>'
                        + '</thead>'
                        + '<tbody>'
                        + '<tr><th>Nome</th><td>' + feature.properties.titulo + '</td></tr>'
                        + '<tr><th>Tipo</th><td>' + feature.properties.tipo + '</td></tr>'
                        + '<tr><th>Município</th><td>' + feature.properties.municipio + '</td></tr>'
                        + '<tr><th>ID</th><td>' + feature.id + '</td></tr>'
                        + '<tr><th>UF</th><td>' + feature.properties.uf + '</td></tr>'
                        // + '<tr><th>Instituição</th><td>' + feature.properties.instituicao + '</td></tr>'
                        + '</tbody>'
                        + '<tfooter>'
                        + '<tr><td colspan="2" class="text-right"><a href="/area-interesse/' + feature.id + '">Ver detalhes</a></td></tr>'
                        + '</tfooter>'
                        + '</table>';

                    layer.bindPopup(conteudo);
                    layers_area_interesse.push(layer);
                    geojson_area_interesse.push(feature);
                }
            });
            mapa.fitBounds(features.getBounds());
            camadaAreasInteresse.addLayer(features);
            layers_area_interesse.push(features);
            // //$('#loading').hide();
        };
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        };

        var url = BASE.URL_API + "/v1/ciman/get_area_by_id/" + ai_id_selecionado + "?retorno=geojson&visao_geral=1";
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error);
    };
    url_get_focos_7_dias_antiga = ""
    obj.get_focos_7_dias = function (id, estado, callback) {
        var that = this;

        data = $("#data").val();
        texto = $('#ipFoco7Nome').val()
        if ($("#data").val() == '') {
            var today = new Date();
            today = today.yyyy_mm_dd();
            data = today;
        }

        // estado = $("#estadoFiltro").val();

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
            that.lista_municipios = response.data;
            for (var i = 0; i < that.lista_municipios.length; i++) {
              var foco = that.lista_municipios[i];
              foco.total = foco.dia_0+foco.dia_1+foco.dia_2+foco.dia_3+foco.dia_4+foco.dia_5+foco.dia_6;
            }
            if(typeof callback == 'function'){
                callback();
            }
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }

        url_get_focos_7_dias = BASE.URL_API + "/v1/ciman/focos_7_ai?dt=" + data+"&texto=" + texto+"&estado="+estado.nome_bdq+"&inst="+getParameterByName('inst');
        if(url_get_focos_7_dias_antiga == url_get_focos_7_dias){
            return;
        }
        url_get_focos_7_dias_antiga = url_get_focos_7_dias;
        //$('#loading').show();
        Ajax.request("GET", url_get_focos_7_dias, that, callback_success, callback_error)
    }

    obj.get_focos_munic_7_dias = function (todos_ids) {
        if(obj.lista_focos_7_munic.length){
            return;
        }
        var that = this;
        var data = data_filtro;
        var ids = todos_ids.splice(0, 5);
        estado = $("#estadoFiltro").val();

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

        that.lista_focos_7_munic = [];
        while (ids.length > 0) {
            var callback_success = function (response) {
                that.lista_focos_7_munic.push.apply(that.lista_focos_7_munic, response.data);
                for (var i = 0; i < that.lista_focos_7_munic.length; i++) {
                  var mn = that.lista_focos_7_munic[i];
                  mn.total = mn.dia_6+mn.dia_5+mn.dia_4+mn.dia_3+mn.dia_2+mn.dia_1+mn.dia_0;
                }
                // //$('#loading').hide();
            };
            var callback_error = function (response) {
                console.log("Erro");
                // //$('#loading').hide();
            };
            var url = BASE.URL_API + "/v1/ciman/focos_7_munic?data=" + data + "&ids=" + ids+"&estado="+estado;
            //$('#loading').show();
            Ajax.request("GET", url, that, callback_success, callback_error);
            ids = todos_ids.splice(0, 30);
        }
    };
    obj.get_focos_munic_7_dias_list_ids = function (data, estado) {
        if(obj.lista_focos_7_munic.length){
            return;
        }
        var that = this;
        texto = $('#ipMunicipio7').val()

        data = $("#data").val();
        if ($("#data").val() == '') {
            var today = new Date();
            today = today.yyyy_mm_dd();
            data = today;
        }

        // estado = $("#estadoFiltro").val();
        var callback_success = function (response) {
            that.get_focos_munic_7_dias(response.data);
            // //$('#loading').hide();
        };
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        };
        var url = BASE.URL_API + "/v1/ciman/focos_7_munic?list_ids=1&data=" + data+"&texto="+texto+"&estado="+estado.nome_bdq;
        //$('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };
    return obj;
});

cimanApp.factory("Instituicao", function (Ajax) {
    var obj = {
        lista_instituicoes: [],
        instituicao: {}
    };
    obj.get_instituicao_areas = function () {
        var that = this;
        var callback_success = function (response) {
            that.lista_instituicoes = response.data;
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        var url = BASE.URL_API + "/v1/ciman/get_lista_areas";
        //$('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    }
    obj.get_instituicao_by_id = function (id, retorno) {
        var that = this;
        var callback_success = function (response) {
            that.instituicao = response.data;
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        var url = BASE.URL_API + "/v1/ciman/get_instituicao_by_id/" + id + "?retorno=" + retorno;
        //$('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    }
    return obj;
});

cimanApp.factory("Brigada", function (Ajax) {
    var obj = {
        lista_brigadas: [],
        rdTipo: null,
        ipTexto: null,
        ipNome:null,
        ckHasOp: false
    };
    obj.get_brigada = function (page) {

        var that = this;
        var callback_success = function (response) {
            that.lista_brigadas = response.data;
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }

        if (obj.lista_brigadas.length)
            for (var i = 0; i < that.paginacao.length; i++)
                if (that.paginacao[i].label == page && that.paginacao[i].classe == "active")
                    return;
        if (!page) page = 1
        if (page == "«") page = 1
        if (page == "»") page = -1
        if (page == "...") return;

        var url = BASE.URL_API + "/v1/ciman/get_lista_brigadas?page=" + page + "&texto=" + obj.ipTexto + "&tipo=" + obj.rdTipo + "&HasOp=" + obj.ckHasOp;
        //$('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    }

    obj.get_brigada_by_id = function (id, retorno) {
        var that = this;
        var callback_success = function (response) {
            that.brigada_selecionada = response.data;
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        var url = BASE.URL_API + "/v1/ciman/get_brigada_by_id/" + id;
        //$('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    }
    return obj;
});

cimanApp.factory("Pais", function (Ajax) {
    var obj = {
        lista_paises: [],
        selecionados: []
    };
    obj.get_lista_paises = function () {
        var that = this;
        var callback_success = function (response) {
            that.lista_paises = response.data;
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        var url = BASE.URL_API + "/v1/ciman/paises";
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    }
    return obj;
});

cimanApp.factory("Estado", function (Ajax, $http, Pais,$cookies) {
    var obj = {
        pais: Pais,
        lista_estados: [],
        selecionados: [],
        ip:0,
        local:[]
    };
    obj.get_lista_estados = function () {
        var that = this;
        var callback_success = function (response) {
            that.lista_estados = response.data;
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        var ids = [];
        for (var i = 0; i < obj.pais.selecionados.length; i++) {
            ids.push(obj.pais.selecionados[i].gid)
        }
        var url = BASE.URL_API + "/v1/ciman/estados?pais_gid=" + ids;
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };

    obj.get_local_ip = function(callback){
      var that = this;
      var json = 'https://freegeoip.net/json/' + that.ip;
      $http.get(json).then(function(result) {
          that.local = result.data;
          for (var i = 0; i < that.lista_estados.length; i++) {
            if (that.lista_estados[i].nome_bdq == that.local.region_code) {
              that.estadoFiltro = that.lista_estados[i];
              $cookies.putObject("estadoFiltro", that.estadoFiltro);
              break;
            }
          }
          if(typeof callback=='function'){
            callback()
          }
      }, function(e) {
          alert("error");
      });
    };

    obj.get_local = function (callback) {
        var that = this;
        var uf = $cookies.getObject("estadoFiltro");
        if (typeof uf != 'undefined') {
            obj.estadoFiltro = uf;
            if (typeof callback == 'function') {
                callback()
            }
        } else {
            var json = 'https://ipv4.myexternalip.com/json';
            $http.get(json).then(function (result) {
                that.ip = result.data.ip;
                obj.get_local_ip(callback);
            }, function (e) {
                alert("error");
            });
        }
    };

    obj.get_lista_estados_pais_brasil = function () {
        var that = this;
        var callback_success = function (response) {
            that.lista_estados = [
                {pais_gid: -1, gid: -1, nome_bdq: "Brasil"}
            ]
            that.lista_estados.push.apply(that.lista_estados, response.data)
            // that.lista_estados = response.data;
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        var ids = [256];

        var url = BASE.URL_API + "/v1/ciman/estados?pais_gid=" + ids;
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };

    obj.get_estado = function () {
        var that = this;
        var estado = $("#estadoFiltro").val();
        var callback_success = function (response) {
            that.estado_selecionado = response.data;
            $cookies.putObject("estados", that.estado_selecionado);
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            //$('#loading').hide();
        }
        var ids = [33];

        var url = BASE.URL_API + "/v1/geo/estados?nome_bdq=" + estado + "&pais="+ids+"&token=91829febdc84c8a904887890e549284b&retorno=geo";
        //// $('#loading').show();
        Ajax.request("GET", url, that, callback_success, callback_error)
    };

    obj.reload_estados = function () {
        var remover = [];
        var pais_ids = [];
        for (var i = 0; i < obj.pais.selecionados.length; i++) {
            pais_ids.push(obj.pais.selecionados[i].gid);
        }
        for (var i = 0; i < obj.selecionados.length; i++) {
            if (pais_ids.indexOf(obj.selecionados[i].pais_gid) == -1)
                remover.push(obj.selecionados[i]);
        }
        for (var i = 0; i < remover.length; i++) {
            var index = obj.selecionados.indexOf(remover[i]);
            obj.selecionados.splice(index, 1);
        }
        if (remover.length) {
            return true;
        } else {
            return false;
        }
    }
    return obj;
});

function between(x, min, max) {
    return x >= min && x <= max;
}

cimanApp.factory("User", function (Ajax, $cookies) {
    var obj = {
        id: null,
        preferencias: null
    };
    obj.get_preferencia_munic = function (Estado) {
        var that = this;
        var paises = $cookies.getObject("paises");
        var estados = $cookies.getObject("estados");
        var callback_success = function (response) {
            Estado.pais.selecionados = response.data.paises;
            Estado.selecionados = response.data.estados;
            // //$('#loading').hide();
        }
        var callback_error = function (response) {
            console.log("Erro");
            // //$('#loading').hide();
        }
        if (paises && estados) {
            Estado.pais.selecionados = paises;
            Estado.selecionados = estados;
        } else {
            var url = BASE.URL_API + "/v1/ciman/user_preferencia?tipo=[paises,estados]";
            //// $('#loading').show();
            Ajax.request("GET", url, that, callback_success, callback_error)
        }
    };
    obj.set_preferencia_munic = function (Estado) {
        $cookies.remove("paises");
        $cookies.remove("estados");
        $cookies.putObject("paises", Estado.pais.selecionados);
        $cookies.putObject("estados", Estado.selecionados);
    }
    return obj;
});

cimanApp.factory("Satelites", function ($http) {
    var obj = {
        imagens: []
    };
    var url = BASE.URL_API + "/v1/satelites/landsat/imagens?o_p=221_067&quantidade=2";
    $http({
        method: "GET",
        params: {},
        url: url,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function successCallback(response) {
        obj.imagens = response.data;
    }, function errorCallback(response) {
        console.log("erro");
    });
    return obj;
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
