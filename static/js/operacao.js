
// Configuração dos atributos da Data
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

// Configurando as datas que são globais
var dt_inicial = new Date('2016-07-01');
var dt_final = new Date();
mapa_principal_v = true;


// Configurando o Padrão do Mapa
var camada = L.layerGroup();
var camadaDiaria = L.layerGroup();
var camadaAreasInteresse_op = L.layerGroup();
var legend = L.control({position: 'bottomright'});

var opcoesUrl = {
    subdomains: [1, 2, 3, 4],
    appId: 'jp8lSJgNGn21e6cUniXC',
    appCode: 'TN6fkxHoLvwcxH7LMYfArA',
    language: 'por',
    attribution: '&copy; 1998 - 2016 <a target="_blank" href="http://www.inpe.br/queimadas">INPE - Queimadas</a>'
};

var camadaTerreno = L.tileLayer('//{s}.aerial.maps.api.here.com/maptile/2.1/'
    + 'maptile/newest/terrain.day/{z}/{x}/{y}/256/png8'
    + '?app_id={appId}&app_code={appCode}&lg={language}', opcoesUrl);

var camadaSatelite = L.tileLayer('//{s}.aerial.maps.api.here.com/maptile/2.1/'
    + 'maptile/newest/satellite.day/{z}/{x}/{y}/256/jpg'
    + '?app_id={appId}&app_code={appCode}&lg={language}', opcoesUrl);

var camadaHibrido = L.tileLayer('//{s}.aerial.maps.api.here.com/maptile/2.1/'
    + 'maptile/newest/hybrid.day/{z}/{x}/{y}/256/jpg'
    + '?app_id={appId}&app_code={appCode}&lg={language}', opcoesUrl);

mapaop = L.map('mapaop', {
   zoom: 4,
   minZoom: 4,
   center: [-15.8, -47.9],
  //  maxBounds: [[-35.9, -76.0], [7.3, -26.6]],
   layers: [camada, camadaTerreno, camadaAreasInteresse_op, camadaDiaria],
   fullscreenControl: true
});

L.control.scale().addTo(mapaop);

L.control.layers({
    'Terreno': camadaTerreno,
    'Satélite': camadaSatelite,
    'Híbrido': camadaHibrido
}, {
    'Área Queimada Total': camada,
    'Área Queimada Diária': camadaDiaria,
    'Áreas de interesse': camadaAreasInteresse_op
}).addTo(mapaop);


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
var camadaAreasInteresse_op__est = L.layerGroup();
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
mapaestimativaOp = L.map('mapaestimativaOp', {
  zoomControl:false,
  zoomAnimation:false,
  markerZoomAnimation:false,
  fadeAnimation:false,
  center: [-15.8, -47.9],
  layers: [cloudmade, camadaAreasInteresse_op__est, camada_total_est, camada_diaria_est, grid]
});


L.control.scale().addTo(mapaestimativaOp);

$(function() {
    $("#printar").click(function() {
      console.log($(".estimativa-print"));
        html2canvas($(".estimativa-print"), {
            flashcanvas: "flashcanvas.min.js",
            logging: true,
            profile: true,
            allowTaint: true,
            onrendered: function(canvas) {
                theCanvas = canvas;

                if(theCanvas.getContext)
                {
                  var ctx = theCanvas.getContext('2d');

                  var img = new Image();
                  img.src = 'https://someurl.com/image.jpg';
                  img.crossOrigin = "Anonymous";

                  img.onload = function() {
                    ctx.drawImage(img,0,0);
                    ctx.fillStyle="#CCC";
                    ctx.font="bold 20px Arial";
                    ctx.fillText(visitor_name, 750, 270);
                    ctx.fillText(visitor_identity_num, 750, 295);
                    ctx.font="bold 25px Arial";
                    ctx.fillText(unique_number, 620, 325);
                  }

                  var imgMp = theCanvas.toDataURL("image/png");
                  // theCanvas.getContext('2d').getImageData(0, 0, 100, 100);

                  // img.src=theCanvas.toDataURL("image/png");


                }

                // var mywindow = window.open('', 'div_print');
                // mywindow.document.write('<html><head><title>Estimativa de Área Queimada (EAQ)</title>');
                // mywindow.document.write('<style></style>');
                // mywindow.document.write('</head><body >');
                // mywindow.document.write('<img src="'+theCanvas.toDataURL("image/png")+'"/>');
                // mywindow.document.write('</body></html>');
                //
                //
                // mywindow.document.close(); // necessary for IE >= 10
                // mywindow.focus(); // necessary for IE >= 10
            }
        });
        // $(".estimativaOp-print").print();

    });
});

// Configurando a impressão
function PrintElem(elem)
    {
        Popup($(elem).html());
    }

    function Popup(data)
    {
        var mywindow = window.open('', 'div_print');
        mywindow.document.write('<html><head><title>Estimativa de Área Queimada (EAQ)</title>');
        mywindow.document.write('<style></style>');
        mywindow.document.write('</head><body >');
        mywindow.document.write(data);
        mywindow.document.write('</body></html>');


        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10

        // mywindow.print();
        // mywindow.close();

        return true;
    }

function centralizarEstimativaOp(){
  console.log("aqui");
  if(layerEst){
    mapaestimativaOp.invalidateSize();
    mapaestimativaOp.fitBounds(layerEst.getBounds());
  }
}
