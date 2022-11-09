
var urls3 = 'https://d3cywq4ybqu7io.cloudfront.net/cogs/sst/clipped-eez-nztm-20200101090000-JPL-L4_GHRSST-SSTfnd-MUR-GLOB-v02_fill_cut_warp_cog.tif'

// Pop up set
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var overlay = new ol.Overlay({
    element: container,
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });

closer.onclick = function () {
overlay.setPosition(undefined);
closer.blur();
return false;
};

// Map Stuff
var cogSource = new ol.source.GeoTIFF({
    normalize: false,
    sources: [
        {
        url: urls3,
        min: 277,
        max: 300,
        nodata: -32768,
        },
    ],
    });

var cogBand = ['band', 1]

var defaultColor = {
color: [
    'interpolate',
    ['linear'],
    cogBand,
    276.9, [255, 255, 255, 0],
    277, [19, 22, 180, 1],
    284, [70, 111, 207, 1],
    289, [196, 229, 183, 1],
    294, [217, 164, 73, 1],
    300, [199, 69, 40, 1]
],
};

var cog = new ol.layer.WebGLTile({
    visible: false,
    crossOrigin: 'anonymous',
    source: cogSource,
    style: defaultColor,
    })


var linz_aerial = new ol.layer.Tile({
    source: new ol.source.XYZ ({
        url: "https://basemaps.linz.govt.nz/v1/tiles/aerial/WebMercatorQuad/{z}/{x}/{y}.webp?api=c01gdm0wx2eeqrq4ssvys9rb1dn"
    }),
    })

var map = new ol.Map({
    target: 'map',
    layers: [linz_aerial, cog],
    overlays: [overlay],
    pixelRatio: 1,
    enableRotation: false,
    view: new ol.View({
        center: ol.proj.fromLonLat([174.8860, -40.9006]),
        zoom: 5,
        multiWorld: false,
    })
    })


// Write button name
function basename(path) {
    var base = path.split('/').reverse()[0]
    var date = base.split('-')[3].slice(0,8)
    var year = date.slice(0,4)
    var month = date.slice(4,6)
    var day = date.slice(6,8)
    var date_str = [day, month, year].join('-')
    return date_str;
    }

date_name = basename(urls3)

var cog_button = document.getElementById("cog")

cog_button.innerHTML = `<a href="#" class="toggle-layer" >${date_name}</a>`;

document.getElementById("cog").onclick = function() {
    cog.setVisible(!cog.getVisible());
    var resetDiv = document.getElementById("cog");
}

// Set onclick to return values from COG
map.on('singleclick', function(evt) {
    var coordinate = evt.coordinate;
    var data = cog.getData(evt.pixel);
    console.log(data[0])
    var celcius = data[0] - 273.15
    var codeText = "Temp in Celcius"
    content.innerHTML = "<div class='popupText'>Sea Surface Temperature: <strong>" + celcius.toFixed(2) + "</strong><div class=returnVal>" + codeText + "</div></div>";
    overlay.setPosition(coordinate);
  })