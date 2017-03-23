var tm;

function loadTimeline(trange) {
    // make some fake data
    var items = [], x;
    for (x=0; x<focos_requeima.features.length; x++) {
      items.push({
          title: focos_requeima.features[x].properties.satelite,
          start: new Date(focos_requeima.features[x].properties.data_hora_gmt),
          point: {lon:focos_requeima.features[x].geometry.coordinates[0],lat:focos_requeima.features[x].geometry.coordinates[1]},
          options: {
              satelite:focos_requeima.features[x].properties.satelite,
              data: new Date(focos_requeima.features[x].properties.data_hora_gmt),
              id:focos_requeima.features[x].id,
              municipio:focos_requeima.features[x].properties.municipio,
              awesomeness: parseInt(Math.random()*10),
              size:1,
              color: corbysat(focos_requeima.features[x].properties.satelite)
          }
        })
    }
    // make some themes
    // var colors = ["090066", "6b0051", "ce003c", "ff0020", "ff0000"]
    // for (var size=0; size<5; size++) {
    //   for (var awe=0; awe<colors.length;awe++) {
    //       // Create a new theme and add it to the TimeMap.themes namespace
    //       // (allowing your data to refer to it by string key). You could make
    //       // other kinds of themes with a new TimeMapTheme() instead
    //       // if you wanted - the concept is the same.
    //       TimeMap.themes['theme' + size + '-' + awe] = TimeMapTheme.createCircleTheme({
    //           size: 5 + (size * 8),
    //           color: colors[awe]
    //       });
    //   }
    // }
    tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        datasets: [
          {
              type: "basic",
              options: {
                  items: items,
                  infoTemplate: '<b>#{{id}}</b><br/><br/><div>Data: {{data}}</div><br/><div>Satélite: {{satelite}}</div><br/><div>Município: {{municipio}}</div>',

                  // use the transformFunction to add the theme before loading
                  transformFunction: function(item) {
                      item.options.theme =  TimeMapTheme.createCircleTheme({
                                size: 25,
                                color: corbysat(item.options.satelite)
                            }); // range 0-9, colors 0-5
                            // console.log(item);

                        // TimeMap.themes['theme' + '-' + item.options.satelite] = TimeMapTheme.createCircleTheme({
                        //     size: 20,
                        //     color: corbysat(item.options.satelite)
                        // });

                      return item;


                  }
              }
          }
      ],
      bandIntervals: trange
    });
    // manipulate the timemap further here if you like
}

function corbysat(satelite){
  if (satelite == 'NPP_375')
    return '090066';
  else if (satelite == 'METEOSAT-02'){
    return '0000CD';
  }
  else if (satelite == 'NOAA-15')
  {
    return '6b0051';
  }
  else if (satelite == 'NOAA-15D')
  {
    return 'ce003c';
  }
  else if (satelite == 'NOAA-12')
  {
    return 'ff0020';
  }
  else if (satelite == 'NOAA-12D')
  {
    return 'ff0000';
  }
  else if (satelite == 'NOAA-14')
  {
    return '7B68EE';
  }
  else if (satelite == 'NOAA-16')
  {
    return '000080';
  }
  else if (satelite == 'NOAA-16N')
  {
    return 'FF8C00';
  }
  else if (satelite == 'NOAA-17')
  {
    return '66CDAA';
  }
  else if (satelite == 'NOAA-18D')
  {
    return '3CB371';
  }
  else if (satelite == 'NOAA-18')
  {
    return 'F0E68C';
  }
  else if (satelite == 'NOAA-19D')
  {
    return '9ACD32';
  }
  else if (satelite == 'NOAA-19')
  {
    return 'FFFF00';
  }
  else if (satelite == 'GOES-08')
  {
    return '87CEEB';
  }
  else if (satelite == 'GOES-10')
  {
    return 'C0C0C0';
  }
  else if (satelite == 'GOES-12')
  {
    return '000000';
  }
  else if (satelite == 'GOES-13')
  {
    return '7B68EE';
  }
  else if (satelite == 'AQUA-T')
  {
    return 'F08080';
  }
  else if (satelite == 'AQUA-M')
  {
    return 'F0E68C';
  }
  else if (satelite == 'TERRA-T')
  {
    return '8FBC8F';
  }
  else if (satelite == 'TERRA-M')
  {
    return 'DAA520';
  }
  else if (satelite == 'METEOSAT-02')
  {
    return 'B8860B';
  }
  else if (satelite == 'AQUA_M-M')
  {
    return '8B4513';
  }
  else if (satelite == 'AQUA_M-T')
  {
    return 'A0522D';
  }
  else if (satelite == 'TERRA_M-M')
  {
    return 'BC8F8F';
  }
  else if (satelite == 'TERRA_M-T')
  {
    return 'CD853F';
  }
  else if (satelite == 'AQUA-MEX')
  {
    return 'D2691E';
  }
  else if (satelite == 'TERRA-MEX')
  {
    return 'DEB887';
  }
  else if (satelite == 'ATSR')
  {
    return 'ADFF2F';
  }
  else if (satelite == 'TRMM')
  {
    return '00FF00';
  }
  else if (satelite == 'NPP')
  {
    return '008B8B';
  }
  else if (satelite == 'NPP_375')
  {
    return '778899';
  }

}
