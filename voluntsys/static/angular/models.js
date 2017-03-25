URL_BASE = "http://127.0.0.1:8000/js/";

function getTokens(){
    var tokens = [];            // new array to hold result
    var query = location.search; // everything from the '?' onward
    query = query.slice(1);     // remove the first character, which will be the '?'
    query = query.split('&');   // split via each '&', leaving us an array of something=something strings

    // iterate through each something=something string
    $.each(query, function(i,value){

        // split the something=something string via '=', creating an array containing the token name and data
        var token = value.split('=');

        // assign the first array element (the token name) to the 'key' variable
        var key = decodeURIComponent(token[0]);

        // assign the second array element (the token data) to the 'data' variable
        var data = decodeURIComponent(token[1]);

        tokens[key] = data;     // add an associative key/data pair to our result array, with key names being the URI token names
    });

    return tokens;  // return the array
}

TOKENS = getTokens();

voluntsysApp.factory("TipoAssociado", function (Ajax,$http) {
    var obj = {
        lista_associados: [],
        retorno : false,
    };
    obj.get_tiposassociados= function () {
        var url = URL_BASE + "tiposassociados";
        var params = {
        }
        $http({
            method: "GET",
            params: params,
            url: url,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            obj.lista_associados= response.data;
        }, function errorCallback(response) {
            console.log("Erro");
        });
    };
    return obj;
});


voluntsysApp.factory("Associado", function (Ajax,$http) {
    var obj = {
        lista_associados: [],
        retorno : false,
    };
    obj.get_associados= function () {
        var url = URL_BASE + "associados";
        var params = {
        }
        $http({
            method: "GET",
            params: params,
            url: url,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            obj.lista_associados = response.data;
        }, function errorCallback(response) {
            console.log("Erro");
        });
    };
    return obj;
});