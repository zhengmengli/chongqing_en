var map
var layersgroup_base

var jidipointstring
var dikuaipolygonstring

//初始化地图
function initmap() {
  var layers = []

  var projection = ol.proj.get('EPSG:4326')

  var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection: 'EPSG:4326',
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position'),
    undefinedHTML: '&nbsp;'
  })

  map = new ol.Map({
    controls: ol.control
      .defaults()
      .extend([
        new ol.control.ScaleLine({
          units: 'degrees'
        })
      ])
      .extend([mousePositionControl]),
    //layers: layers,
    target: 'MyMapDiv',
    view: new ol.View({
      projection: projection,
      center: [0, 0],
      zoom: 6
    })
  })

  zoomslider = new ol.control.ZoomSlider()
  map.addControl(zoomslider)

  //var lon = 114.56931531514307;
  //var lat = 34.57252452951756;

  //重庆坐标
  var lon = 106.5498
  var lat = 29.5689
  var zoom = 10
  var center = [lon, lat]

  map.getView().setCenter(center)
  map.getView().setZoom(zoom)
}

/**
 * 加载basegroup图层组，目前为 全球矢量地图服务 和 全球矢量中文注记服务
 * */
function loadlayersgroup_base() {
  //console.log("进入gis_index.js中loadlayersgroup_base()");

  layersgroup_base = new ol.layer.Group()
  layersgroup_base.set('layername', 'layersgroup_base')

  layersgroup_base.getLayers().push(getTdtLayer2('img_c'))
  layersgroup_base.getLayers().push(getTdtLayer2('cia_c'))

  map.addLayer(layersgroup_base)
}

/**
 * 获取天地图wmts服务图层---------正常方式
 *
 * @param {String} t
 * 1.'vec_c' 全球矢量地图服务
 * 2.'cva_c' 全球矢量中文注记服务
 * 3.'img_c' 全球影像底图服务
 * 4.'cia_c' 全球影像中文注记服务
 * 5.更多服务可查询http://www.tianditu.com/service/query.html#
 * @returns
 */
function getTdtLayer2(t) {
  var projection = ol.proj.get('EPSG:4326')
  var projectionExtent = projection.getExtent()
  var size = ol.extent.getWidth(projectionExtent) / 256
  var resolutions = new Array(20)
  var matrixIds = new Array(20)

  for (var z = 0; z <= 20; ++z) {
    resolutions[z] = size / Math.pow(2, z)
    matrixIds[z] = z
  }

  var layername = t.substr(0, 3)

  var layer = new ol.layer.Tile({
    name: 'ssss',
    source: new ol.source.WMTS({
      url: 'http://t{0-6}.tianditu.com/' + t + '/wmts',
      layer: layername,
      format: 'tiles',
      tileGrid: new ol.tilegrid.WMTS({
        origin: ol.extent.getTopLeft(projectionExtent),
        resolutions: resolutions,
        matrixIds: matrixIds
      }),
      matrixSet: 'c',
      style: 'default'
    })
  })

  return layer
}

function getstyle(feature) {
  var image_point = new ol.style.Icon(
    /** @type {olx.style.IconOptions} */ ({
      scale: 0.7,
      anchor: [25, 40],
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      src: 'image/dw_red.png'
    })
  )

  var styles = {
    Point: new ol.style.Style({
      image: image_point
      //image: image
    }),
    Polygon: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'red',
        width: 1
      }),
      fill: new ol.style.Fill({
        color: 'rgba(255,0,0, 0.3)'
      })
    })
  }

  return styles[feature.getGeometry().getType()]
}


function getaddstyle(feature_type) {
  var style;

  if(feature_type == 'Point'){
    var image_point = new ol.style.Icon(
      /** @type {olx.style.IconOptions} */ ({
        scale: 0.7,
        anchor: [25, 40],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src: 'image/dw_red.png'
      })
    )
    style = new ol.style.Style({
      image: image_point
      //image: image
    })
  }else if(feature_type == 'Polygon'){
    style = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        lineDash: [4],
        width: 3
      }),
      fill: new ol.style.Fill({
        color: 'rgba(0, 0, 255, 0.1)'
      })
    })
  }else{
    console.log("error")
  }



  return style
}
function getaddstyle1(feature) {
  var image_point = new ol.style.Icon(
    /** @type {olx.style.IconOptions} */ ({
      scale: 0.7,
      anchor: [25, 40],
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      src: 'image/dw_red.png'
    })
  )
  var styles = {
    Point: new ol.style.Style({
      image: image_point
      //image: image
    }),
    Polygon: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        lineDash: [4],
        width: 3
      }),
      fill: new ol.style.Fill({
        color: 'rgba(0, 0, 255, 0.1)'
      })
    })
  }

  return styles[feature.getGeometry().getType()]
}

function geteditstyle(feature) {
  var image_point = new ol.style.Icon(
    /** @type {olx.style.IconOptions} */ ({
      scale: 0.7,
      anchor: [25, 40],
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      src: 'image/dw_red.png'
    })
  )
  var styles = {
    Point: new ol.style.Style({
      image: image_point
      //image: image
    }),
    Polygon: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        lineDash: [4],
        width: 3
      }),
      fill: new ol.style.Fill({
        color: 'rgba(0, 0, 255, 0.1)'
      })
    })
  }

  return styles[feature.getGeometry().getType()]
}


function addVectorLayer(){
  var pointArr = new ol.format.GeoJSON().readFeatures(jidipointstring)

//添加点图层
  var pointVectorSource = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    features: pointArr,
    strategy: ol.loadingstrategy.bbox
  })

  var polygonArr = new ol.format.GeoJSON().readFeatures(dikuaipolygonstring)

  var pointLayer = new ol.layer.Vector({
    visible:true,
    source: pointVectorSource,
    style: getstyle
  });
  pointLayer.set('layername','pointLayer');
  map.addLayer(pointLayer);
  var pointVectorSourceExtent = pointVectorSource.getExtent();
  //设置显示范围
  if(!ol.extent.isEmpty(pointVectorSourceExtent)){
    map.getView().fit(pointVectorSourceExtent);
  }
  console.log("基地数："+pointLayer.getSource().getFeatures().length)

//添加面图层
  var polygonVectorSource = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    features: polygonArr,
    strategy: ol.loadingstrategy.bbox
  })

  var polygonLayer = new ol.layer.Vector({
    visible:true,
    source: polygonVectorSource,
    style: getstyle
  });

  polygonLayer.set('layername','polygonLayer');
  map.addLayer(polygonLayer);

  var polygonVectorSourceExtent = polygonVectorSource.getExtent();
  //设置显示范围
  if(!ol.extent.isEmpty(polygonVectorSourceExtent)){
    map.getView().fit(polygonVectorSourceExtent);
  }
  var mapzoom = map.getView().getZoom();
  if (mapzoom>17){
    mapzoom = 17;
  }
  map.getView().setZoom(mapzoom - 1);

  console.log("地块数："+polygonLayer.getSource().getFeatures().length)
}

var overlay
var closer
/**
 * Elements that make up the popup.
 */
var container = document.getElementById('popup')
var content = document.getElementById('popup-content')
closer = document.getElementById('popup-closer')

function initPopup() {
  /**
   * Create an overlay to anchor the popup to the map.
   */
  overlay = new ol.Overlay(
    /** @type {olx.OverlayOptions} */ ({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    })
  )

  map.addOverlay(overlay)
  /**
   * Add a click handler to hide the popup.
   * @return {boolean} Don't follow the href.
   */
  closer.onclick = function() {
    overlay.setPosition(undefined)
    closer.blur()
    return false
  }

  /**
   * Add a click handler to the map to render the popup.
   */
  map.on('singleclick', function(evt) {
    overlay.setPosition(undefined)
    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
      return feature
    })
    content.innerHTML = ''

    if (feature) {
      //引掉的为地图点击弹出窗
      /*var type = feature.getGeometry().getType()
      if (type != 'Point' && type != 'Polygon') return
      if (feature.get('id') == null) return
      var geo = feature.getGeometry()
      content.innerHTML = '--' + feature.get('id') + '--' + '<br>' + feature.get('name')/!*
      if (type == 'Point') {
        content.innerHTML =
          content.innerHTML +
          '<br><br><br> <a class="layui-btn" href="javascript:deletePoint(' +
          feature.get('id') +
          ');">删除</a>'
      } else {
        content.innerHTML =
          content.innerHTML +
          '<br><br><br> <a class="layui-btn" href="javascript:deletePolygon(' +
          feature.get('id') +
          ');">删除</a>'
      }*!/

      map.addOverlay(overlay)

      //var coord = feature.getGeometry().getCoordinates()
      overlay.setPosition(evt.coordinate)
      overlay.setOffset([0, -5])*/
      var type = feature.getGeometry().getType()
      if (type != 'Point' && type != 'Polygon') return
      if (feature.get('id') == null) return
      // var geo = feature.getGeometry()
      window.parent.vmObj().openCard(feature.get('name'))
    }
  })
  //右键
  /*$(map.getViewport()).on('contextmenu', function(event) {
    event.preventDefault()

    overlay.setPosition(undefined)
    var pixel = map.getEventPixel(event)
    content.innerHTML = ''
    var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
      return feature
    })

    if (feature) {
      if (feature.get('id') == null) return
      var type = feature.getGeometry().getType()
      var geo = feature.getGeometry()
      content.innerHTML = '--' + feature.get('id') + '--' + '<br>' + feature.get('name')
      if (type == 'Point') {
        content.innerHTML =
          content.innerHTML +
          '<br><br><br> <a class="layui-btn" href="javascript:deletePoint(' +
          feature.get('id') +
          ');">删除</a>'
      } else {
        content.innerHTML =
          content.innerHTML +
          '<br><br><br> <a class="layui-btn" href="javascript:deletePolygon(' +
          feature.get('id') +
          ');">删除</a>'
      }

      map.addOverlay(overlay)

      var coord = feature.getGeometry().getCoordinates()
      var coordinate = map.getEventCoordinate(event)
      overlay.setPosition(coordinate)
      overlay.setOffset([0, -5])
    }
    // 书写事件触发后的函数
  })*/
}


//拉框查询
var geoResult = '' //保存画图的数据
var drawpoint
var drawPolygon
var drawVector
var drawSource = new ol.source.Vector();

var modify
var coll = new ol.Collection();



/**
 *给map添加 画图 和 编辑事件
 *
 * @param
 * @returns {}
 */
function addInteraction() {
  drawVector = new ol.layer.Vector({
    source: drawSource,
    style: getaddstyle1
  });
  map.addLayer(drawVector);

  drawpoint = new ol.interaction.Draw({
    source: drawSource,
    type: 'Point',
    style: getaddstyle('Point')
  })
  drawpoint.on('drawend', function(evt) {
    geoResult = evt.feature
    //alert(geoResult);
    drawpoint.setActive(false)
    //addGeosaveControl('drawpoint')

    var geoString = new ol.format.GeoJSON().writeFeature(evt.feature)

    window.parent.vmObj().callbackBase(geoString)

    setTimeout(function() {
      map.addInteraction(new ol.interaction.DoubleClickZoom({ delta: 0 }))
    })
  })
  map.addInteraction(drawpoint)
  drawpoint.setActive(false)

  drawPolygon = new ol.interaction.Draw({
    source: drawSource,
    type: 'Polygon',
    style: getaddstyle('Polygon')
  })
  drawPolygon.on('drawend', function(evt) {
    geoResult = evt.feature
    //alert(geoResult);
    drawPolygon.setActive(false)
    //addGeosaveControl('drawPolygon')

    var geoString = new ol.format.GeoJSON().writeFeature(evt.feature)
    window.parent.vmObj().callbackArea(geoString)

    setTimeout(function() {
      map.addInteraction(new ol.interaction.DoubleClickZoom({ delta: 0 }))
    })
  })
  map.addInteraction(drawPolygon)
  drawPolygon.setActive(false)

  modify = new ol.interaction.Modify({
    features: coll
  });
  modify.on('modifyend', function(evt) {
    var temp_features = evt.features

    geoResult = temp_features.item(0)
    //alert(geoResult);

    var geoString = new ol.format.GeoJSON().writeFeature(temp_features.item(0))

    ////////////////////此处将修改后的坐标写入右侧页form/////////////////////////
    //window.parent.vmObj().openAddLand(geoString)
    // debugger
    if(geoResult.getGeometry().getType()==='Polygon'){
      window.parent.vmObj().callbackArea(geoString,'edit')
    }else{
      window.parent.vmObj().callbackBase(geoString,'edit')
    }

    //console.log(geoString);

    setTimeout(function() {
      map.addInteraction(new ol.interaction.DoubleClickZoom({ delta: 0 }))
    })
  })
  map.addInteraction(modify);
  modify.setActive(false)
}

//去除map双击zoom事件
function removedbClick () {
  var dblClickInteraction
  map
    .getInteractions()
    .getArray()
    .forEach(function(interaction) {
      if (interaction instanceof ol.interaction.DoubleClickZoom) {
        dblClickInteraction = interaction
      }
    })
  // remove from map
  map.removeInteraction(dblClickInteraction)
}



/**
 *激活画图
 *
 * @param
 * @returns {}
 */
function drawPointActive() {
  drawSource.clear()
  drawpoint.setActive(true)
  drawPolygon.setActive(false)
  modify.setActive(false)
  //去除map双击zoom事件
  removedbClick()
}

function drawPolygonActive() {
  drawSource.clear()
  drawpoint.setActive(false)
  drawPolygon.setActive(true)
  modify.setActive(false)
  //去除map双击zoom事件
  removedbClick()

}

function modifyActive() {
  drawSource.clear()
  drawpoint.setActive(false)
  drawPolygon.setActive(false)
  modify.setActive(true)
  //去除map双击zoom事件
  removedbClick()
}

//alert('加点');
function addPoint(){
  drawPointActive()
}

function addPolygon() {
  drawPolygonActive()
}

var geoSaveIndex = null

function closeGeosaveLayer() {
  layer.close(geoSaveIndex)
  geoSaveIndex = null
  $('#geo_save').css('display', 'none')
}

/**
 *重置
 *
 * @param result
 * @returns {}
 */
function reset() {
  geoResult = ''
  drawSource.clear()
  closeGeosaveLayer()
}

function save() {
  if (document.getElementById('id').value == '') {
    layer.msg('请输入ID')
    return
  }

  //var feature=this.parent.geoResult;
  var feature = this.geoResult

  var pro = new Object()
  pro.id = document.getElementById('id').value
  pro.name = document.getElementById('name').value
  pro.field1 = document.getElementById('field1').value
  pro.field2 = document.getElementById('field2').value
  feature.setProperties(pro)

  var geoString = new ol.format.GeoJSON().writeFeature(feature)
  //alert(geoString);
  console.log(geoString)
}

function refreshVectorLayer () {
  coll.clear();
  modify.setActive(false)

  var alllayers = map.getLayers();

  //console.log("alllayers.getLength():"+alllayers.getLength());

  var alllayerscount = alllayers.getLength();

  for(i=alllayerscount-1;i>=0;i--){

    var templayer = alllayers.item(i);
    if(templayer.get('layername')=='pointLayer' || templayer.get('layername')=='polygonLayer'){
      //console.log("删除一个图层");
      map.removeLayer(templayer);
    }
  }


  addVectorLayer();
}

function locationByid (layername,item_id) {
  var searchlayer;

  var alllayers = map.getLayers();
  var alllayerscount = alllayers.getLength();
  for(i=alllayerscount-1;i>=0;i--){
    var templayer = alllayers.item(i);
    if(templayer.get('layername')==layername){
      //console.log("找到图层");
      searchlayer = templayer;
      break;
    }
  }

  var currentfeature=null;
  var features = searchlayer.getSource().getFeatures();

  for(i=0;i<features.length;i++){
    //console.log("features[i].get('id'):"+features[i].get('id'));
    if(features[i].get('id') == item_id){
      //console.log("找到feature");
      currentfeature = features[i];
      break;
    }
  }

  if(currentfeature){
    var geo = currentfeature.getGeometry();
    var geotype = geo.getType();

    if(geotype == 'Point'){
      map.getView().setCenter(geo.getCoordinates())
      map.getView().setZoom(15)
    }else if(geotype == 'Polygon'){
      map.getView().fit(geo.getExtent())
      map.getView().setZoom(map.getView().getZoom() - 1)
    }else{
      console.log('error');
    }

  }
}

function modifyByid (layername,item_id) {
  var searchlayer;

  var alllayers = map.getLayers();
  var alllayerscount = alllayers.getLength();
  for(i=alllayerscount-1;i>=0;i--){
    var templayer = alllayers.item(i);
    //console.log(templayer.get('layername'));
    if(templayer.get('layername')==layername){
      //console.log("找到图层");
      searchlayer = templayer;
      break;
    }
  }

  var currentfeature=null;
  var features = searchlayer.getSource().getFeatures();

  for(i=0;i<features.length;i++){
    //console.log("features[i].get('id'):"+features[i].get('id'));
    if(features[i].get('id') == item_id){
      //console.log("找到feature");
      currentfeature = features[i];
      break;
    }
  }

  if(currentfeature){
    var geo = currentfeature.getGeometry();
    var geotype = geo.getType();

    if(geotype == 'Point'){
      map.getView().setCenter(geo.getCoordinates())
      map.getView().setZoom(15)
    }else if(geotype == 'Polygon'){
      map.getView().fit(geo.getExtent())
      map.getView().setZoom(map.getView().getZoom() - 1)
    }else{
      console.log('error');
    }

    currentfeature.setStyle(geteditstyle(currentfeature));

    var coll_count = coll.getLength();
    if(coll_count>0){
      for(kk=0;kk<coll_count;kk++){
        var old_feature = coll.item(kk);
        old_feature.setStyle(getstyle(old_feature));

      }
      coll.clear();
    }
    coll.push(currentfeature);
    modifyActive();

  }
}


