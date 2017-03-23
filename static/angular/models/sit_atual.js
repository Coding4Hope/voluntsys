cimanApp.factory("SitAtual", function(Ajax, $cookies,$http){
 var obj =  {
   paises: [],
   paisesLabels : [],
   paisesDados : [],
   estados: [],
   estadosLabels : [],
   estadosDados : [],
   municipios: [],
   municipiosLabels : [],
   municipiosDados : [],
   tipo: 'tabela',
   tempo: 'ano',
   urlBase: 'https://dev-queimadas.dgi.inpe.br/api/v1/',
   params: {
    token: 'a6bc36eb0364cb3f9bc3adb0a81018f2'
  },
  anosTotal: [],
  anosTotalEstados: [],
  loader: false,
  ano: (parseInt(new Date().getFullYear())),
  gLabels : [],
  gDados: [],
  paises_list : [
  {id: 12,nome: 'Argentina', anos:[]},
  {id: 28,nome: 'Bolívia', anos:[]},
  {id: 33,nome: 'Brasil', anos:[]},
  {id: 48,nome: 'Chile', anos:[]},
  {id: 53,nome: 'Colômbia', anos:[]},
  {id: 59,nome: 'Cuba', anos:[]},
  {id: 68,nome: 'Ecuador', anos:[]},
  {id: 98,nome: 'Guyana', anos:[]},
  {id: 80,nome: 'Guyana Francesa', anos:[]},
  {id: 177,nome: 'Paraguai', anos:[]},
  {id: 178,nome:'Peru', anos:[]},
  {id: 219,nome: 'Suriname', anos:[]},
  {id: 245,nome: 'Uruguai', anos:[]},
  {id: 249,nome: 'Venezuela', anos:[]}
  ],
  estados_list:[
  {id: 1, nome:'AC', anos:[]},
  {id: 2, nome:'AL', anos:[]},
  {id: 4, nome:'AM', anos:[]},
  {id: 3, nome:'AP', anos:[]},
  {id: 5, nome:'BA', anos:[]},
  {id: 6, nome:'CE', anos:[]},
  {id: 7, nome:'DF', anos:[]},
  {id: 8, nome:'ES', anos:[]},
  {id: 9, nome:'GO', anos:[]},
  {id: 10, nome:'MA', anos:[]},
  {id: 13, nome:'MG', anos:[]},
  {id: 11, nome:'MS', anos:[]},
  {id: 12, nome:'MT', anos:[]},
  {id: 14, nome:'PA', anos:[]},
  {id: 15, nome:'PB', anos:[]},
  {id: 17, nome:'PE', anos:[]},
  {id: 18, nome:'PI', anos:[]},
  {id: 16, nome:'PR', anos:[]},
  {id: 19, nome:'RJ', anos:[]},
  {id: 20, nome:'RN', anos:[]},
  {id: 22, nome:'RO', anos:[]},
  {id: 23, nome:'RR', anos:[]},
  {id: 21, nome:'RS', anos:[]},
  {id: 25, nome:'SC', anos:[]},
  {id: 26, nome:'SE', anos:[]},
  {id: 24, nome:'SP', anos:[]},
  {id: 27, nome:'TO', anos:[]},
  {id: 0, nome:'INDETERMINADO', anos:[]}
  ],
};

obj.carregaDados = function(){
  //obj.exibePaises();
  //obj.exibeEstados();
}

obj.exibeEstados = function(){
  obj.estados = [];
  obj.estadosLabels = [];
  obj.estadosDados = [];

  var url = obj.urlBase + "focos/estados?unidade="+ obj.tempo +"&token=" + obj.params.token;
  url += "&inicio=" + obj.get_datas(obj.tempo)[0];
  url += "&fim=" + obj.get_datas(obj.tempo)[1];
  url += "&pais=33&ref=true";
  obj.loader = true;

  var callback_success = function(data){
    $(data.data).each(function(index){
      estado_id = $(this)[0].estado_id;

      var result = obj.estados_list.filter(function( obj ) {
        return obj.id == estado_id;
      });

      if(obj.tipo == 'tabela')
      {
        var estado = { nome: result[0].nome, focos: $(this)[0].quantidade_focos };
        obj.estados.push(estado);
      }
      else if(obj.tipo == 'grafico')
      {
        obj.estadosLabels.push(result[0].nome);
        obj.estadosDados.push($(this)[0].quantidade_focos);
      }
    });
    obj.estados.sort(function(a, b){ //ordenando o array pelos paises
      return a.nome > b.nome;
    });
    obj.loader = false;
  };

  var callback_error = function(excep)
  {
    console.log(excep);
    obj.loader = false;
  }

  Ajax.request("GET", url, null,callback_success, callback_error)
};

obj.exibePaises = function(){
  var paises = obj.paises_list;
  var str_paises = '';
  obj.paises = [];
  obj.paisesLabels = [];
  obj.paisesDados = [];

  $(paises).each(function(index){
    str_paises += $(this).attr('id') + ',';
  });
  str_paises = str_paises.substring(0,str_paises.length - 1);

  var url = obj.urlBase + "focos/paises?unidade="+ obj.tempo +"&token=" + obj.params.token;
  url += "&inicio=" + obj.get_datas(obj.tempo)[0];
  url += "&fim=" + obj.get_datas(obj.tempo)[1];
  url += "&pais=" + str_paises;
  url += "&ref=true";
  obj.loader = true;

  var callback_success = function(data){
    $(data.data).each(function(index){
      pais_id = $(this)[0].pais_id0;

      var result = paises.filter(function( obj ) {
        return obj.id == pais_id;
      });

      if(obj.tipo == 'tabela')
      {
        var pais = { nome: result[0].nome, focos: $(this)[0].quantidade_focos };
        obj.paises.push(pais);
      }
      else if(obj.tipo == 'grafico')
      {
        obj.paisesLabels.push(result[0].nome);
        obj.paisesDados.push($(this)[0].quantidade_focos);
      }
    });
    obj.paises.sort(function(a, b){ //ordenando o array pelos paises
      return a.nome > b.nome;
    });
    obj.loader = false;
  };

  var callback_error = function(excep)
  {
    console.log(excep);
    obj.loader = false;
  }

  Ajax.request("GET", url, null,callback_success, callback_error)
};

obj.exibeTabela = function(a,b){
  var paises = obj.paises_list;
  var str_paises = '';
  $(paises).each(function(index){
    str_paises += $(this).attr('id') + ',';
  });

  for (var i=6; i >= 0; i--) {
   var data = new Date();
//   data.setDate(data.getDate()-1);
   var mes = (data.getMonth()+1 > 9) ? (data.getMonth()+1).toString() : '0' + (data.getMonth()+1).toString();
   var dia = data.getDate() > 9 ? data.getDate().toString() : '0' + data.getDate().toString();

   var url = obj.urlBase + "focos/paises?unidade=ano&token=" + obj.params.token;
   url += "&inicio=" + ((parseInt(new Date().getFullYear()) -i)) + "-01-01";
   url += "&fim=" + (parseInt(new Date().getFullYear()) -i) + "-" + mes + "-" + dia;
   url += "&pais=" + str_paises.slice(0,-1);
   url += "&ref=true";

   for(i2=0; i2<paises.length; i2++)
   {
    var item = { ano: (parseInt(new Date().getFullYear())-i), quantidade_focos: 0 };
    paises[i2].anos.push(item);

    var result = obj.anosTotal.filter(function( obj ) {
      return obj.ano == item.ano;
    });

    if(result.length == 0)
      obj.anosTotal.push({ ano: (parseInt(new Date().getFullYear())-i), quantidade_focos: 0 });
  }

  var callback_success = function(data){

    $(data.data).each(function(index){
      quantidade_focos = $(this)[0].quantidade_focos;
      ano = $(this)[0].data_ano;
      pais = $(this)[0].pais_id0;

      var result = paises.filter(function( obj ) {
        return obj.id == pais;
      });

      var result2 = result[0].anos.filter(function( obj ) {
        return obj.ano == ano;
      });

      result2[0].quantidade_focos = quantidade_focos;

      result[0].anos.sort(function (a,b) { return a.ano-b.ano });

      //populando os totais
      var result3 = obj.anosTotal.filter(function( obj ) {
        return obj.ano == ano;
      });
      result3[0].quantidade_focos += quantidade_focos;
    });
  };

  var callback_error = function(excep)
  {
    console.log(excep);
  }

  $http({
    method: "GET",
    params: {},
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

obj.exibeTabela2 = function(a,b){
  var paises = obj.paises_list;
  var str_paises = '';
  $(paises).each(function(index){
    str_paises += $(this).attr('id') + ',';
  });

  for (var i=6; i >= 0; i--) {
    var data = new Date();
//    data.setDate(data.getDate()-1);

    var mes = (data.getMonth()+1 > 9) ? (data.getMonth()+1).toString() : '0' + (data.getMonth()+1).toString();
    var dia = data.getDate() > 9 ? data.getDate().toString() : '0' + data.getDate().toString();

    // data.setDate(data.getDate()-1);
    // var mes2 = (data.getMonth()+1 > 9) ? (data.getMonth()+1).toString() : '0' + (data.getMonth()+1).toString();
    // var dia2 = data.getDate() > 9 ? data.getDate().toString() : '0' + data.getDate().toString();

    var url = obj.urlBase + "focos/paises?unidade=ano&token=" + obj.params.token;
    url += "&inicio=" + ((parseInt(new Date().getFullYear()) -i)) + "-" + mes + "-01";
    url += "&fim=" + (parseInt(new Date().getFullYear()) -i) + "-" + mes + "-" + dia;
    url += "&pais=" + str_paises.slice(0,-1);
    url += "&ref=true";

    for(i2=0; i2<paises.length; i2++)
    {
      var item = { ano: (parseInt(new Date().getFullYear())-i), quantidade_focos: 0 };
      paises[i2].anos.push(item);

      var result = obj.anosTotal.filter(function( obj ) {
        return obj.ano == item.ano;
      });

      if(result.length == 0)
        obj.anosTotal.push({ ano: (parseInt(new Date().getFullYear())-i), quantidade_focos: 0 });
    }

    var callback_success = function(data){

      $(data.data).each(function(index){
        quantidade_focos = $(this)[0].quantidade_focos;
        ano = $(this)[0].data_ano;
        pais = $(this)[0].pais_id0;

        var result = paises.filter(function( obj ) {
          return obj.id == pais;
        });

        var result2 = result[0].anos.filter(function( obj ) {
          return obj.ano == ano;
        });

        result2[0].quantidade_focos = quantidade_focos;

        result[0].anos.sort(function (a,b) { return a.ano-b.ano });

      //populando os totais
      var result3 = obj.anosTotal.filter(function( obj ) {
        return obj.ano == ano;
      });
      result3[0].quantidade_focos += quantidade_focos;
    });
    };

    var callback_error = function(excep)
    {
      console.log(excep);
    }

    $http({
      method: "GET",
      params: {},
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

obj.exibeTabelaEstados = function(){

  for (var i=6; i >= 0; i--) {
   var data = new Date();
//   data.setDate(data.getDate()-1);
   var mes = (data.getMonth()+1 > 9) ? (data.getMonth()+1).toString() : '0' + (data.getMonth()+1).toString();
   var dia = data.getDate() > 9 ? data.getDate().toString() : '0' + data.getDate().toString();

   var estados = obj.estados_list;
   var url = obj.urlBase + "focos/estados?unidade=ano&token=" + obj.params.token;
   url += "&pais=33";
   url += "&inicio=" + ((parseInt(new Date().getFullYear()) -i)) + "-01-01";
   url += "&fim=" + (parseInt(new Date().getFullYear())-i) + "-" + mes + "-" + dia;
   url += "&ref=true";

   for(i2=0; i2<estados.length; i2++)
   {
    var item = { ano: (parseInt(new Date().getFullYear())-i), quantidade_focos: 0 };
    estados[i2].anos.push(item);

    var result = obj.anosTotalEstados.filter(function( obj ) {
      return obj.ano == item.ano;
    });

    if(result.length == 0)
      obj.anosTotalEstados.push({ ano: (parseInt(new Date().getFullYear())-i), quantidade_focos: 0 });
  }

  var callback_success = function(data){

    $(data.data).each(function(index){
      quantidade_focos = $(this)[0].quantidade_focos;
      ano = $(this)[0].data_ano;
      estado = $(this)[0].estado_id1;

      var result = estados.filter(function( obj ) {
        return obj.id == estado;
      });

      var result2 = result[0].anos.filter(function( obj ) {
        return obj.ano == ano;
      });

      result2[0].quantidade_focos = quantidade_focos;
      result[0].anos.sort(function (a,b) { return a.ano-b.ano });

      //populando os totais
      var result3 = obj.anosTotalEstados.filter(function( obj ) {
        return obj.ano == ano;
      });
      result3[0].quantidade_focos += quantidade_focos;
    });
  };

  var callback_error = function(excep)
  {
    console.log(excep);
  }

  $http({
    method: "GET",
    params: {},
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
};

obj.exibeTabelaEstados2 = function(){

  for (var i=6; i >= 0; i--) {
    var data = new Date();
//    data.setDate(data.getDate()-1);

    var mes = (data.getMonth()+1 > 9) ? (data.getMonth()+1).toString() : '0' + (data.getMonth()+1).toString();
    var dia = data.getDate() > 9 ? data.getDate().toString() : '0' + data.getDate().toString();

    // data.setDate(data.getDate()-1);
    // var mes2 = (data.getMonth()+1 > 9) ? (data.getMonth()+1).toString() : '0' + (data.getMonth()+1).toString();
    // var dia2 = data.getDate() > 9 ? data.getDate().toString() : '0' + data.getDate().toString();

    var estados = obj.estados_list;
    var url = obj.urlBase + "focos/estados?unidade=ano&token=" + obj.params.token;
    url += "&pais=33";
    url += "&inicio=" + ((parseInt(new Date().getFullYear()) -i)) + "-" + mes + "-01";
    url += "&fim=" + (parseInt(new Date().getFullYear()) -i) + "-" + mes + "-" + dia;
    url += "&ref=true";

    for(i2=0; i2<estados.length; i2++)
    {
      var item = { ano: (parseInt(new Date().getFullYear())-i), quantidade_focos: 0 };
      estados[i2].anos.push(item);

      var result = obj.anosTotalEstados.filter(function( obj ) {
        return obj.ano == item.ano;
      });

      if(result.length == 0)
        obj.anosTotalEstados.push({ ano: (parseInt(new Date().getFullYear())-i), quantidade_focos: 0 });
    }

    var callback_success = function(data){

      $(data.data).each(function(index){
        quantidade_focos = $(this)[0].quantidade_focos;
        ano = $(this)[0].data_ano;
        estado = $(this)[0].estado_id1;

        var result = estados.filter(function( obj ) {
          return obj.id == estado;
        });

        var result2 = result[0].anos.filter(function( obj ) {
          return obj.ano == ano;
        });

        result2[0].quantidade_focos = quantidade_focos;
        result[0].anos.sort(function (a,b) { return a.ano-b.ano });

      //populando os totais
      var result3 = obj.anosTotalEstados.filter(function( obj ) {
        return obj.ano == ano;
      });
      result3[0].quantidade_focos += quantidade_focos;
    });
    };

    var callback_error = function(excep)
    {
      console.log(excep);
    }

    $http({
      method: "GET",
      params: {},
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
};

obj.get_pais = function(id){
  for (var i = 0; i < obj.paises_list.length; i++) {
    if(obj.paises_list[i].id == id)
      return obj.paises_list[i]
  }

};

obj.get_datas = function(tipo){
  var dado = []
  if(tipo == '48h')
  {
    var d1 = new Date(new Date().setDate(new Date().getDate()-2));
    var d2 = new Date(new Date().setDate(new Date().getDate()));

    var mes = (d1.getMonth()+1 > 9) ? (d1.getMonth()+1).toString() : '0' + (d1.getMonth()+1).toString();
    var dia = (d1.getDate()> 9) ? (d1.getDate()).toString() : '0' + (d1.getDate()).toString();
    var ano = new Date().getFullYear().toString();
    dado[0] = ano + '-' + mes + '-' + dia;

    mes = (d2.getMonth()+1 > 9) ? (d2.getMonth()+1).toString() : '0' + (d2.getMonth()+1).toString();
    dia = (d2.getDate()> 9) ? (d2.getDate()).toString() : '0' + (d2.getDate()).toString();
    ano = new Date().getFullYear().toString();
    dado[1] = ano + '-' + mes + '-' + dia;
  }
  else if(tipo == 'mes')
  {
    var mes = (new Date().getMonth()+1 > 9) ? (new Date().getMonth()+1).toString() : '0' + (new Date().getMonth()+1).toString();
    var dia = ((new Date().getDate()-1) > 9) ? (new Date().getDate()-1).toString() : '0' + (new Date().getDate()-1).toString();
    var ano = new Date().getFullYear().toString();

    dado[0] = ano + '-' + mes + '-01';
    dado[1] = ano + '-' + mes + '-' + dia;
  }
  else if(tipo == 'ano')
  {
    var mes = (new Date().getMonth()+1 > 9) ? (new Date().getMonth()+1).toString() : '0' + (new Date().getMonth()+1).toString();
    var dia = ((new Date().getDate()-1) > 9) ? (new Date().getDate()-1).toString() : '0' + (new Date().getDate()-1).toString();
    var ano = new Date().getFullYear().toString();

    dado[0] = ano + '-01-01';
    dado[1] = ano + '-' + mes + '-' + dia;
  }

  return dado;
}
return obj;
});
