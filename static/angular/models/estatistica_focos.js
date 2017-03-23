cimanApp.factory("EstatisticaFocos", function($http, $cookies){
 var obj =  {
   pais: null,
   estado: {id:getParameterByName('estado')},
   params: {
    token: 'a6bc36eb0364cb3f9bc3adb0a81018f2'
  },
  loader: false,
  estados: [],
  paises: [],
  option_paises: [],
  option_estados: [],
  dadosSemestre:[],
  dadosHistorico:[],
  graficos: [],
  dado_historico: {},
  monthNames:["Jan", "Fev", "Mar", "Abr", "Mai", "Jun","Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  urlBase: "https://dev-queimadas.dgi.inpe.br/api/v1/",
  show_comparativo_historico: false,
    show_comparativo_anual: false,
    show_comparativo_semestre1: false,
    show_comparativo_semestre2: false,
};
obj.estatistica_paises = function(callback){
 var that = obj;
 that.loader = true;
 var callback_success = function(response){
   that.paises = response.data;
   that.paises
   var agrupado = [];
   for (var i = 0; i < that.paises.length; i++) {
     var flag = true;
     for (var j = 0; j < agrupado.length; j++)
       if(agrupado[j].ano == that.paises[i].data_ano){
         agrupado[j].meses_existente.push(that.paises[i])
         flag = false;
       }
       var obj = {ano: that.paises[i].data_ano, meses_existente: [that.paises[i]]}
       obj.meses = [];
       for (var j = 0; j < 12; j++)
         obj.meses[j] = {data_mes: j + 1, quantidade_focos: 0};
       if(flag)
        agrupado.push(obj);
    }
    for (var i = 0; i < agrupado.length; i++)
     for (var j = 0; j < agrupado[i].meses_existente.length; j++) {
       var item = agrupado[i].meses_existente[j];
       agrupado[i].meses[item.data_mes - 1] = item;
     }
     that.paises = agrupado;
     that.paises.maior = 0;
     that.paises.menor = 99999999990;
     that.paises.meio = 0;
     that.paises.maximo = [0,0,0,0,0,0,0,0,0,0,0,0];
     that.paises.media = [0,0,0,0,0,0,0,0,0,0,0,0];
     that.paises.minimo = [99999999990,99999999990,99999999990,99999999990,99999999990,99999999990,99999999990,99999999990,99999999990,99999999990,99999999990,99999999990];
     that.paises.total = [0,0,0,0,0,0,0,0,0,0,0,0];
     var current_year = new Date().getFullYear()
     for (var i = 0; i < that.paises.length; i++) {
            if(that.paises[i].ano == current_year)
            {
              that.paises[i].total = 0;

              $.each(that.paises[i].meses, function (index, value) {
                  that.paises[i].total += value.quantidade_focos;
              });

              continue;
            }

            that.paises[i].total = 0;
            for (var j = 0; j < that.paises[i].meses.length; j++) {
                //    if(that.paises[i].ano != current_year){
                 if(that.paises.maximo[j] < that.paises[i].meses[j].quantidade_focos){
                   that.paises.maximo[j] = that.paises[i].meses[j].quantidade_focos;
                   //that.paises.maior = that.paises[i].meses[j].quantidade_focos < that.paises.maior? that.paises.maior : that.paises[i].meses[j].quantidade_focos;
                 }
                 if(that.paises.minimo[j] > that.paises[i].meses[j].quantidade_focos && that.paises[i].meses[j].quantidade_focos > 0){
                   that.paises.minimo[j] = that.paises[i].meses[j].quantidade_focos;
                   //that.paises.menor = that.paises[i].meses[j].quantidade_focos > that.paises.maior? that.paises.menor : that.paises[i].meses[j].quantidade_focos;
                 }
                 that.paises.media[j] = that.paises.media[j] + that.paises[i].meses[j].quantidade_focos;
                //    }
                that.paises[i].total = that.paises[i].total + that.paises[i].meses[j].quantidade_focos;
                that.paises.total[i] = that.paises[i].total;
              }
            }

            for (var i = 0; i < that.paises.minimo.length; i++) {
             if(that.paises.minimo[i] == 99999999990){
               that.paises.minimo[i] = 0;
             }
           }
           for (var i = 0; i < that.paises.media.length; i++) {
             that.paises.media[i] = parseInt(that.paises.media[i]/(that.paises.length-1));
           }

           that.paises.meio = parseInt(getAvg(that.paises.total));
           that.paises.maior = that.paises.total.clean(undefined).max();
           that.paises.menor = that.paises.total.clean(undefined).min();

           if(that.paises.menor ==99999999990){
             that.paises.menor = 0;
           }
           that.dados_graficos();
           that.loader = false;
           if(typeof callback == "function"){
            callback(that.data);
           }

            if(that.call_grafico){
                that.get_grafico_historico(that.paises);
            }
         }
         var callback_error = function(response){
           console.log("Erro.");
           that.loader = false;
         }
         var url = obj.urlBase + "focos/paises?unidade=mes&token=" + obj.params.token
       // var url = "//sirc.dgi.inpe.br/v1/focos/paises?unidade=mes&token=" + obj.params.token
       url = url + "&pais=" + obj.pais.id + "&ref=true";
       $cookies.put("pais_id", obj.pais.id);
       $http({
            method: "GET",
            data: {},
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
     obj.set_pais = function(){
       var cookie = $cookies.get("pais_id");
       var pais = 33;
       if (cookie){
         pais = cookie
       }
       for (var i = 0; i < obj.option_paises.length; i++) {
         if(obj.option_paises[i].id == pais){
           obj.pais = obj.option_paises[i];
         }
       }
     };
     obj.set_estado = function(){
       var cookie = $cookies.get("estado_id");
       var estado = 1;
       if (cookie){
         estado = cookie
       }
       for (var i = 0; i < obj.option_estados.length; i++) {
         if(obj.option_estados[i].id == estado){
           obj.estado = obj.option_estados[i];
         }
       }
     };
     obj.get_paises = function(callback){
       var that = this;
       that.loader = true;
       var callback_success = function(response){
         for (var i = 0; i < response.data.length; i++) {
           obj.option_paises.push(
           {
             id: response.data[i].pk,
             nome: response.data[i].nome_bdq
           }
           )
         }
         that.set_pais();
         that.loader = false;
         if(typeof callback == "function")
           callback();
       }
       var callback_error = function(response){
         console.log("Erro.");
       }
       var url = obj.urlBase + "geo/paises?continente=8&token=" + that.params.token
    //    var url = "//sirc.dgi.inpe.br/v1/geo/paises?continente=8&token=" + that.params.token
        $http({
            method: "GET",
            data: {},
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
  obj.dados_graficos = function(){
   var labels = [];
   var data = [];
   for (var i = 0; i < obj.paises.length; i++) {
     labels.push(obj.paises[i].ano);
   }
   for (var i = 0; i < obj.paises.length; i++) {
     data.push(obj.paises[i].total);
   }
   obj.dado_historico.labels = labels;
   obj.dado_historico.data = data;
   obj.set_menu(1);
 }
 obj.set_menu = function(index){
   obj.menu = index;
 }
 obj.map_1 = null;
 obj.grafico_historico = function(){
   for (var i = 0; i < obj.graficos.length; i++) {
     obj.graficos[i].destroy();
   }
   var bar_data = {
     labels: obj.dado_historico.labels,
     datasets: [
     {
       fillColor: "rgba(60,141,188,0.9)",
       strokeColor: "rgba(60,141,188,0.8)",
       pointColor: "#3b8bba",
       pointStrokeColor: "rgba(60,141,188,1)",
       pointHighlightFill: "#fff",
       pointHighlightStroke: "rgba(60,141,188,1)",
       data: obj.dado_historico.data
     }
     ]
   };
   var grafic_canvas = $("#grafico_historico").get(0).getContext("2d");
   var grafic = new Chart(grafic_canvas);

   var grafic_options = {
     scaleBeginAtZero: true,
     scaleShowGridLines: true,
     scaleGridLineColor: "rgba(0,0,0,.05)",
     scaleGridLineWidth: 1,
     scaleShowHorizontalLines: true,
     scaleShowVerticalLines: true,
     barShowStroke: true,
     barStrokeWidth: 1,
     barValueSpacing: 1,
     barDatasetSpacing: 1,
     responsive: true
   };

   grafic_options.datasetFill = false;
   obj.graficos.push(grafic.Bar(bar_data, grafic_options));
 }

 obj.get_estados = function(callback){
   var that = this;
   that.loader = true;
   var callback_success = function(response){
     for (var i = 0; i < response.data.length; i++) {
       obj.option_estados.push(
       {
         id: response.data[i].fields.id_1,
         nome: response.data[i].fields.name_1
       }
       )
     }
     that.set_estado();
     that.loader = false;
     if(typeof callback == "function")
       callback();
   }
   var callback_error = function(response){
     console.log("Erro.");
   }
   var url = obj.urlBase + "geo/estados?pais=33&token=" + that.params.token
   $http({
        method: "GET",
        data: {},
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

 obj.get_grafico_historico = function(obj_dados)
 {

  function drawChartHistorico() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Meses');
    data.addColumn('number', 'Valor');

    var dados = []
    for (var i = 0; i < obj_dados.length; i++) {
      var count = 0;
      for(var i2=0; i2< obj_dados[i].meses.length; i2++)
      {
        count += obj_dados[i].meses[i2].quantidade_focos;
      }

      dados.push([
        obj_dados[i].ano.toString(),
        count
        ]);
    }

    dados.sort(function(a, b) {
      return parseInt(b) - parseInt(a);
    });

    data.addRows(dados);
    var options = {
      chart: {
        title: 'Comparativo Histórico',
      },
      width: '100%',
      height: 300,
      legend: {position: "none"},
      focusTarget: 'category',
      hAxis: {
        direction: -1,
        slantedText: true,
        slantedTextAngle: 45 // here you can even use 180
      },
      colors: ['#CC0000', '#FF6600', '#FFCC00']
    };
    var chart = new google.visualization.ColumnChart(document.getElementById('comparativo_historico'));
    chart.draw(data, options);
  }

  function drawChartAnual() {

    var data = new google.visualization.DataTable();
    var dados = [];
    data.addColumn('string', 'Mês');
    data.addColumn('number', "Máx");
    data.addColumn('number', "Méd");
    data.addColumn('number', "Mín");

    for (var i = 0; i < obj_dados.maximo.length; i++) {
      dados.push([obj.monthNames[i], obj_dados.maximo[i],obj_dados.media[i], obj_dados.minimo[i]]);
    }
    data.addRows(dados);

    var options = {
      chart: {
//        title: 'Comparativo anual',
//        subtitle: 'Focos encontrados'
      },
      focusTarget: 'category',
      width: '100%',
      height: 300
    };

    var chart = new google.charts.Line(document.getElementById('comparativo_anual'));
    chart.draw(data, options);
  }

  function drawChartSemestre() {
    var data = new google.visualization.DataTable();
    var data2 = new google.visualization.DataTable();

    var dados = [];
    var dados2 = [];

    data.addColumn('string', 'Mês');
    data.addColumn('number', "Mês");
    data.addColumn('number', "Máx");
    data.addColumn('number', "Méd");
    data.addColumn('number', "Mín");

    data2.addColumn('string', 'Mês');
    data2.addColumn('number', "Mês");
    data2.addColumn('number', "Máx");
    data2.addColumn('number', "Méd");
    data2.addColumn('number', "Mín");

    var dados_ano = obj_dados.filter(function( obj ) {
        return obj.ano == new Date().getFullYear();
    });

    for(var i2=0; i2 <= 5; i2++)
    {
      dados.push([obj.monthNames[i2], dados_ano[0].meses[i2].quantidade_focos, obj_dados.maximo[i2], obj_dados.media[i2], obj_dados.minimo[i2]]);
    }

    for(var i2=6; i2 <= 11; i2++)
    {
      dados2.push([obj.monthNames[i2], dados_ano[0].meses[i2].quantidade_focos, obj_dados.maximo[i2], obj_dados.media[i2], obj_dados.minimo[i2]]);
    }

  data.addRows(dados);
  data2.addRows(dados2);

  var options = {
    title : 'Dados comparativos do primeiro semestre',
    vAxis: {title: 'N° Focos'},
    hAxis: {title: 'Mês'},
    seriesType: 'bars',
    focusTarget: 'category',
    series: {1: {type: 'line'}, 2: {type: 'line',visibleInLegend: false}, 3: {type: 'line',visibleInLegend: false}},
    width: '100%',
    height: 300
  };

  if(obj.show_comparativo_semestre1){
        var chart = new google.visualization.ComboChart(document.getElementById('comparativo_semestre'));
  chart.draw(data, options);
    }
    if(obj.show_comparativo_semestre2){
        var chart2 = new google.visualization.ComboChart(document.getElementById('comparativo_semestre2'));
        chart2.draw(data2, options);
    }
}

    if(obj.show_comparativo_historico){
        google.charts.setOnLoadCallback(drawChartHistorico);
    }
    if(obj.show_comparativo_anual){
        google.charts.setOnLoadCallback(drawChartAnual);
    }
    if(obj.show_comparativo_semestre1){
        google.charts.setOnLoadCallback(drawChartSemestre);
    }
    if(obj.show_comparativo_semestre2){
        google.charts.setOnLoadCallback(drawChartSemestre);
    }
}

obj.estatistica_estados = function(callback){
 var that = obj;
 that.loader = true;
 var callback_success = function(response){
   that.estados = response.data;

   that.estados;
   var agrupado = [];
   for (var i = 0; i < that.estados.length; i++) {
     var flag = true;
     for (var j = 0; j < agrupado.length; j++)
       if(agrupado[j].ano == that.estados[i].data_ano){
         agrupado[j].meses_existente.push(that.estados[i])
         flag = false;
       }
       var obj = {ano: that.estados[i].data_ano, meses_existente: [that.estados[i]]}
       obj.meses = [];
       for (var j = 0; j < 12; j++)
         obj.meses[j] = {data_mes: j + 1, quantidade_focos: 0};
       if(flag)
        agrupado.push(obj);
    }

    for (var i = 0; i < agrupado.length; i++)
     for (var j = 0; j < agrupado[i].meses_existente.length; j++) {
       var item = agrupado[i].meses_existente[j];
       agrupado[i].meses[item.data_mes - 1] = item;
     }


     that.estados = agrupado;
     that.estados.maior = 0;
     that.estados.menor = 99999999990;
     that.estados.meio = 0;
     that.estados.maximo = [0,0,0,0,0,0,0,0,0,0,0,0];
     that.estados.media = [0,0,0,0,0,0,0,0,0,0,0,0];
     that.estados.minimo = [99999999990,99999999990,99999999990,99999999990,99999999990,99999999990,99999999990,99999999990,99999999990,99999999990,99999999990,99999999990];
     var current_year = new Date().getFullYear()
     for (var i = 0; i < that.estados.length; i++) {
      that.estados[i].total = 0;
      for (var j = 0; j < that.estados[i].meses.length; j++) {
       if(that.estados.maximo[j] < that.estados[i].meses[j].quantidade_focos){
         that.estados.maximo[j] = that.estados[i].meses[j].quantidade_focos;
         that.estados.maior = that.estados[i].meses[j].quantidade_focos < that.estados.maior? that.estados.maior : that.estados[i].meses[j].quantidade_focos;
       }
       if(that.estados.minimo[j] > that.estados[i].meses[j].quantidade_focos && that.estados[i].meses[j].quantidade_focos > 0){
         that.estados.minimo[j] = that.estados[i].meses[j].quantidade_focos;
         that.estados.menor = that.estados[i].meses[j].quantidade_focos > that.estados.maior? that.estados.menor : that.estados[i].meses[j].quantidade_focos;
       }
       that.estados.media[j] = that.estados.media[j] + that.estados[i].meses[j].quantidade_focos;
                //    }
                that.estados[i].total = that.estados[i].total + that.estados[i].meses[j].quantidade_focos;
              }
            }
            for (var i = 0; i < that.estados.minimo.length; i++) {
             if(that.estados.minimo[i] == 99999999990){
               that.estados.minimo[i] = 0;
             }
           }
           for (var i = 0; i < that.estados.media.length; i++) {
             that.estados.media[i] = parseInt(that.estados.media[i]/(that.estados.length-1));
           }
           // for (var i = 0; i < that.estados.length; i++) {
           //   that.estados.meio = that.estados.meio + that.estados.media[i];
           // }
           that.estados.meio = parseInt(getAvg(that.estados.media));

           if(that.estados.menor ==99999999990){
             that.estados.menor = 0;
           }
           that.dados_graficos();
           that.loader = false;
           if(typeof callback == "function")
             callback(that.data);

           that.get_grafico_historico(that.estados);
         }
         var callback_error = function(response){
           console.log("Erro.");
           that.loader = false;
         }

         var url = obj.urlBase + "focos/estados?unidade=mes&token=" + obj.params.token
         url = url + "&estado=" + obj.estado.id;
         url += "&pais=33";
         url += "&ref=true";
         $cookies.put("estado_id", obj.estado.id);

         if(obj.estado.id)//se nenhum estado foi selecionado ainda
          $http({
                method: "GET",
                data: {},
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

      return obj;
    });


function getAvg(grades) {
    return grades.reduce(function (p, c) {return p + c;}) / grades.length;
}
function getSum(grades) {
	return grades.reduce((a, b) => a + b, 0);
}

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
