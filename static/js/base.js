function get_last_param_url(){
    var list_url = window.location.pathname.split("/");
    return list_url[list_url.length - 1]
}
Date.prototype.dd_mm_yyyy = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString();
    var dd  = this.getDate().toString();
    return (dd[1]?dd:"0"+dd[0])+ '-' + (mm[1]?mm:"0"+mm[0]) + '-' + yyyy;
};
Date.prototype.yyyy_mm_dd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString();
    var dd  = this.getDate().toString();
    return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
};

DATATABLE_CONFIG_LANGUAGE = {
    "emptyTable":     "Nenhum data disponível na tabela",
    "info":           "Mostrando _START_ de _END_. Total de _TOTAL_ registros",
    "infoEmpty":      "Mostrando 0 de 0 de 0 registro",
    "infoFiltered":   "(filtrado o total de _MAX_ registro)",
    "infoPostFix":    "",
    "thousands":      ",",
    "lengthMenu":     "Mostrar _MENU_ registro",
    "loadingRecords": "Carregando...",
    "processing":     "Processando...",
    "search":         "Busca:",
    "zeroRecords":    "Nenhum registro encontrado",
    "paginate": {
        "first":      "Primeiro",
        "last":       "Último",
        "next":       "Próximo",
        "previous":   "Anterior"
    },
    "aria": {
        "sortAscending":  ": ativar para classificar coluna ascendente",
        "sortDescending": ": ativar para classificar coluna descendente"
    }
}


var hoje = new Date();
var amanha = new Date();
var ontem = new Date();

data_atual = hoje.yyyy_mm_dd();
amanha.setDate(amanha.getDate() + 1);
ontem.setDate(ontem.getDate() - 1);

data_amanha = amanha.yyyy_mm_dd();
data_ontem = ontem.yyyy_mm_dd();

