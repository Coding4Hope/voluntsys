voluntsysApp.controller('associadoTipoCtrl', function($scope, AssociadoTipo) {
    $scope.ac = Associado;
    $scope.at = AssociadoTipo

    $scope.ct = Categoria;
    $scope.ct.get_categorias();
    $scope.ct.get_categoria();

    $scope.filtrar = function(){
        $scope.ct.get_categorias(document.getElementById("ipFiltroCategoria").value);
    }
    $scope.atualizar = function(){
        $scope.ct.save_categoria(document.getElementById("nome").value);
    }
    $scope.excluir = function(){
      $scope.ct.excluir_categoria();
    }
});


voluntsysApp.controller('associadoCtrl', function($scope, Associado, AssociadoTipo) {
    $scope.ac = Associado;
    $scope.at = AssociadoTipo

    $scope.ac.get_associados();
    $scope.at.get_tiposassociados();

    $scope.filtrar = function(){
        $scope.ct.get_categorias(document.getElementById("ipFiltroCategoria").value);
    }
    $scope.atualizar = function(){
        $scope.ct.save_categoria(document.getElementById("nome").value);
    }
    $scope.excluir = function(){
      $scope.ct.excluir_categoria();
    }
});
