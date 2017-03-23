cimanApp.controller('homeCtrl', function($scope, Operacao) {
    $scope.BASE = BASE;
    $scope.op = Operacao;
    $scope.op.get_lista_ativa();

    $scope.sort_old = "";
    $scope.sorte = null;
    $scope.Order = function (OrderValue) {
      if($scope.sorte == OrderValue){
        $scope.sorte = "-" + OrderValue;
      } else {
        $scope.sorte = OrderValue;
      }
    }
});

cimanApp.controller('areasInteresseCtrl', function($scope, AreaInteresse) {
    $scope.BASE = BASE;
    $scope.ai = AreaInteresse;
    $scope.ai.get_lista_areas();

    $scope.filtrar = function (){
        $scope.ai.get_lista_areas($scope.ipTexto, $scope.rdTipo, $scope.ckHasOp, $scope.ckHasFc);
    }

    $scope.sort_old = "";
    $scope.sorte = null;
    $scope.Order = function (OrderValue) {
      if($scope.sorte == OrderValue){
        $scope.sorte = "-" + OrderValue;
      } else {
        $scope.sorte = OrderValue;
      }
    }
});

cimanApp.controller('eventorequeimaCtrl', function($scope, EventoRequeima) {
    $scope.BASE = BASE;
    google.charts.load("current", {packages:['corechart']});
    $scope.rq = EventoRequeima;
    $scope.rq.get_evento_requeima_id(get_last_param_url());
    $scope.rq.get_eventos_by_requeima_id(get_last_param_url());
    $scope.rq.get_focos_by_requeima_id(get_last_param_url());
    // $scope.dt_inicio = $scope.rq.evento_requeima_selecionada.properties.inicio
    // $scope.dt_final = $scope.rq.evento_requeima_selecionada.properties.fim

    $scope.filtrar = function (){
        $scope.rq.get_evento_requeima_by_range_data(get_last_param_url(), $scope.dt_inicio, $scope.dt_final);
    }

    $scope.sort_old = "";
    $scope.sorte = null;
    $scope.Order = function (OrderValue) {
      if($scope.sorte == OrderValue){
        $scope.sorte = "-" + OrderValue;
      } else {
        $scope.sorte = OrderValue;
      }
    }
});

cimanApp.controller('areaInteresseCtrl', function($scope, AreaInteresse) {
    $scope.BASE = BASE;
    google.charts.load("current", {packages:['corechart', 'line','bar']});
    $scope.ai = AreaInteresse;
    $scope.ai.get_area_by_id(get_last_param_url(), "geojson");
    $scope.ai.get_historico_todos_anos(get_last_param_url());
    // $scope.ai.grafico_7_dias();
    // $scope.ai.get_requeima_cores(get_last_param_url());
    $scope.ai.get_requeima(get_last_param_url());
    $scope.ai.get_path_row(get_last_param_url());
    $scope.ai.get_requeimas_ativas(get_last_param_url());
    // $scope.ai.get_geo_diaria_total(get_last_param_url());
    $scope.date_current = new Date();
    $scope.orderProp='date';
    $scope.encontra_historico = function (req_id){
      for (var i = 0; i < $scope.ai.requeima.features.length; i++) {
        if($scope.ai.requeima.features[i].id == req_id)
        {
          $scope.ai.requeima.features[i].checked=!$scope.ai.requeima.features[i].checked;
          break;
        }
      }
      $scope.ai.update_mapa_requeima()
    }


});

cimanApp.controller('municipioCtrl', function($scope, Municipio) {
    $scope.BASE = BASE;
    google.charts.load("current", {packages:['corechart', 'line','bar']});
    $scope.date_current = new Date();
    $scope.mn = Municipio;
    $scope.mn.mapa.iniciar_mapa("geometria");
    hoje = new Date();
    ontem = new Date();
    ontem.setDate(ontem.getDate()-1);
    $scope.mn.mapa.add_evento_inativo(get_last_param_url(), ontem.yyyy_mm_dd());
    $scope.mn.mapa.add_evento_ativo(get_last_param_url(), ontem.yyyy_mm_dd());
    $scope.mn.mapa.add_focos_7(get_last_param_url());
    $scope.mn.get_municipio_by_id(get_last_param_url());
    $scope.mn.get_areas_interesse_by_municipio_id(get_last_param_url());
    $scope.mn.get_brigadas_by_municipio_id(get_last_param_url());
    // $scope.mn.get_evento_classificacao_by_municipio_id(get_last_param_url());
    $scope.mn.get_requeima_by_municipio_id(get_last_param_url());

    $scope.mn.get_historico_todos_anos(get_last_param_url());
});

cimanApp.controller('instituicaoCtrl', function($scope, Instituicao) {
    $scope.BASE = BASE;
    $scope.inst = Instituicao;
    $scope.inst.get_instituicao_by_id(get_last_param_url());
});

cimanApp.controller('visaogeralCtrl', function($scope, AreaInteresse, Operacao, Municipio, Foco, Estado, $http, $rootScope, $cookies, $q) {
    root_scope = $rootScope;
    $scope.BASE = BASE;
    $scope.loader = $http.pendingRequests;
    $scope.img_loader = BASE.PREFIX_URL + "/static/img/loader.gif";
    google.charts.load("current", {packages:['corechart', 'bar']});

    ai = $scope.ai = AreaInteresse;
    $scope.op = Operacao;
    $scope.st = Estado;
    $scope.focos_7 = Foco;
    $scope.munic = Municipio;
    $scope.st.get_lista_estados_pais_brasil();
    $scope.dtFiltro = new Date().yyyy_mm_dd();
    $scope.st.atualiza_mapa_por_data = atualiza_mapa_por_data;
    $scope.filtrar = function (){
        $cookies.putObject("estadoFiltro", $scope.st.estadoFiltro);
        uf = $scope.st.estadoFiltro.nome_bdq;
        data_filtro = $scope.dtFiltro;
        $scope.st.atualiza_mapa_por_data($scope.st.estadoFiltro.nome_bdq, data_filtro, $http)
        $("#options").find("li").removeClass("active");
        $("#options").find("li").first() ? $("#options").find("li").first().addClass("active") : null;
        $("#focos").addClass("active");
        $scope.focos_7.get_focos_7_dias(data_filtro, {nome_bdq: estado});
        $scope.focos_7.lista_focos_7_munic = [];
        $scope.munic.lista_municipios = [];
        $scope.op.lista_operacoes_ativas = [];
        if($scope.op.lista_operacoes) $scope.op.lista_operacoes.operacoes = [];
    };

    $scope.st.get_local($scope.filtrar);

    $scope.filtrarFocos7 = function (){
        $scope.focos_7.get_focos_7_dias($scope.dtFiltro, $scope.ipFoco7Nome);
    };

    $scope.filtrarEventosClassificacao = function (){
        $scope.ai.get_pontosatencao($scope.dtFiltro,$scope.ipEventosClassificacao);
    };

    $scope.filtrarMunicipio7 = function (){
        $scope.focos_7.get_focos_munic_7_dias_list_ids($scope.dtFiltro,$scope.ipMunicipio7);
    };

    $scope.filtrarEventoMunicipio = function (){
        $scope.munic.get_pontosatencao($scope.dtFiltro,$scope.ipEventoMunicipio);
    };
    $scope.filtrarOperacoesAtivas = function (){
        $scope.op.get_lista_operacoes_ativas($scope.dtFiltro,$scope.ipOperacaoAtiva);
    };
    $scope.filtrarTodasOperacoes = function (){
        $scope.op.get_lista_operacoes($scope.dtFiltro,$scope.ipTodasOperacao);
    };

    $scope.sort_old = "";
    $scope.sorte = null;
    $scope.Order = function (OrderValue) {
      if($scope.sorte == OrderValue){
        $scope.sorte = "-" + OrderValue;
      } else {
        $scope.sorte = OrderValue;
      }
    }
});

cimanApp.controller('brigadasCtrl', function($scope, Brigada) {
    $scope.BASE = BASE;
    $scope.br = Brigada;
    $scope.br.get_brigada();


    $scope.filtrar = function (){
        $scope.br.get_brigadas();
    }

    $scope.sort_old = "";
    $scope.sorte = null;
    $scope.Order = function (OrderValue) {
      if($scope.sorte == OrderValue){
        $scope.sorte = "-" + OrderValue;
      } else {
        $scope.sorte = OrderValue;
      }
    }
});

cimanApp.controller('brigadaCtrl', function($scope, Brigada) {
    $scope.BASE = BASE;
    $scope.br = Brigada;
    $scope.br.get_brigada_by_id(get_last_param_url());
});


cimanApp.controller('municipiosCtrl', function($scope, Municipio, Estado, User) {
    $scope.BASE = BASE;
    $scope.user = User;
    $scope.munic = Municipio;
    $scope.Estado = Estado;

    $scope.user.get_preferencia_munic($scope.Estado);
    $scope.Estado.pais.get_lista_paises();
    $scope.munic.get_lista_municipios(1);
    $scope.$watch('Estado.pais.selecionados', function(newValue, oldValue) {
        if (newValue.length < oldValue.length) {
            var reload = $scope.Estado.reload_estados();
            if(reload){
                $scope.munic.get_lista_municipios();
            }
        }
        if(newValue.length){
            $scope.Estado.get_lista_estados();
        } else {
            $scope.Estado.lista_estados = [];
            $scope.Estado.selecionados = [];
        }
    });
    $scope.$watch('Estado.selecionados', function(newValue, oldValue) {
        $scope.munic.get_lista_municipios();
    });
    $scope.$watch('munic.lista_municipios', function(newValue, oldValue) {
        $scope.user.set_preferencia_munic($scope.Estado);
    });

    $scope.sort_old = "";
    $scope.sorte = null;
    $scope.Order = function (OrderValue) {
      if($scope.sorte == OrderValue){
        $scope.sorte = "-" + OrderValue;
      } else {
        $scope.sorte = OrderValue;
      }
    }
});

cimanApp.controller('operacoesCtrl', function($scope, Operacao) {
    $scope.BASE = BASE;
    $scope.op = Operacao;
    $scope.op.get_lista_operacoes();
    $scope.filtrar = function (){
        $scope.op.get_lista_operacoes($scope.ipTexto, $scope.rdTipo );
    }

    $scope.sort_old = "";
    $scope.sorte = null;
    $scope.Order = function (OrderValue) {
      if($scope.sorte == OrderValue){
        $scope.sorte = "-" + OrderValue;
      } else {
        $scope.sorte = OrderValue;
      }
    }
});

cimanApp.controller('operacaoCtrl', function($scope, Operacao, $http) {
    $scope.BASE = BASE;
    $scope.op = Operacao;
    // $scope.op.get_requeima_cores(get_last_param_url());
    $scope.op.get_requeima(get_last_param_url());
    $scope.op.get_op_by_id(get_last_param_url());
    $scope.op.get_requeima_ativos(get_last_param_url());
    $scope.op.get_geo_diaria_total(get_last_param_url());

    // $scope.op.grafico_7_dias();
    // $scope.op.get_historico_todos_anos(get_last_param_url());
    $scope.date_current = new Date();
    $scope.encontra_historico = function (req_id){
      for (var i = 0; i < $scope.op.requeima.features.length; i++) {
        if($scope.op.requeima.features[i].id == req_id)
        {
          $scope.op.requeima.features[i].checked=!$scope.op.requeima.features[i].checked;
          break;
        }
      }
      $scope.op.update_mapa_requeima()
    }

    $scope.IniciarAnimacao = function(data_inicio, data_final, id_op, id_ai){
      operacao_id = id_op
      dt_inicial = new Date(data_inicio);

      if(data_final)
        dt_final = new Date(data_final);
      else {
        dt_final = new Date();

      }
      time = setInterval(atualiza_mapa, 1000);

      mapaop.invalidateSize();
      // $scope.op.set_geo_areainteresse(id_ai);
      atualiza_mapa();
    }

    function atualiza_mapa(){
       dt_inicial.setDate(dt_inicial.getDate() + 1)

       if(dt_inicial < dt_final){

         try{
           $http({
               method: "GET",
               params: {},
               url: BASE.URL_API + "/v1/ciman/requeimas_diario_op?op="+operacao_id+"&dt=" + dt_inicial.yyyy_mm_dd(),
               headers: {
                   'Content-Type': 'application/json'
               }
           }).then(function successCallback(response) {
               $scope.op.prop_fogo = response.data;

               var layerTotal = L.geoJson($scope.op.prop_fogo, {
                  style: function (feature) {
                      return {
                            color: '#000',
                            weight: 2,
                            opacity: 1.0,
                            fillOpacity: 0.8,
                        };
                    }
                });

                var layerDiaria = L.geoJson($scope.op.prop_fogo.features[0].properties.geom_diario, {
                   style: function (feature) {
                       return {
                             color: '#cc3333',
                             weight: 2,
                             opacity: 1.0,
                             fillOpacity: 0.8,
                         };
                     }
                 });

                camada.clearLayers();
                camada.addLayer(layerTotal);

                camadaDiaria.clearLayers();
                camadaDiaria.addLayer(layerDiaria);

                //  Retornando os dias
                data_ref = new Date($scope.op.operacao_selecionada.data_ref);
                data_final = new Date($scope.op.prop_fogo.features[0].properties.data_fim);
                $scope.op.dias = parseInt((data_final-data_ref)/(1000*60*60*24));

                $(".legend_mapaop").remove();

                Legend = L.control({position: 'bottomright'});

                Legend.onAdd = function (mapaop) {
                     var legdiv = L.DomUtil.create('div', 'legend_mapaop');
                     legdiv.innerHTML +='<div class="img-logo-sm" style="margin-bottom:10px;"></div><ul><li><b class="legenda-titulo-topo">'+ $scope.op.operacao_selecionada.area_interesse.titulo + '</b></li><li><b class="label label-default legenda-titulo">Data:</b> ' + $scope.op.prop_fogo.features[0].properties.data_fim + '</li><li><b class="label label-danger legenda-titulo">Área Queimada Diária:</b> ~' + Math.round($scope.op.prop_fogo.features[0].properties.area_diaria) + '  km² </li><li><b class="label label-inverse legenda-titulo" style="background-color:#000;">Área Queimada Total:</b> ~' + Math.round($scope.op.prop_fogo.features[0].properties.area_total) + '  km² </li><li><b class="label label-info legenda-titulo">Total de Dias:</b> ' + $scope.op.dias  + '</li>';
                    //  legdiv.update();
                     return legdiv;
                 };
                 Legend.addTo(mapaop);

                 mapaop.fitBounds(layer.getBounds());


           }, function errorCallback(response) {
               console.log("erro");
           });
        }
        catch(err){
          console.log("erro" + data_inicial);
        }
      }
      else{
        clearInterval(time);
      }
    }

    google.charts.load("current", {packages:['corechart', 'line','bar']});
});


cimanApp.controller('apresentacaoCtrl', function($scope, AreaInteresse, Estado, Foco, EstatisticaFocos) {
    $scope.BASE = BASE;
    $scope.hoje = new Date();
    $scope.ontem = new Date();
    $scope.amanha = new Date();

    $scope.ontem.setDate($scope.hoje.getDate() - 1);
    $scope.amanha.setDate($scope.hoje.getDate() + 1);
    $scope.ontem = $scope.ontem.yyyy_mm_dd();
    $scope.hoje = $scope.hoje.yyyy_mm_dd();
    $scope.amanha = $scope.amanha.yyyy_mm_dd();
    $scope.dtFiltro = $scope.ontem;

    $scope.ai = AreaInteresse;
    $scope.st = Estado;
    $scope.focos_7 = Foco;

    $scope.st.get_lista_estados_pais_brasil();
    $scope.st.get_estado();

    $scope.focos = EstatisticaFocos;
    $scope.focos.get_estados();
});
