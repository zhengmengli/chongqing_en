var map;
var layersgroup_base;
function initmap() {

    var layers = [];

    var projection = ol.proj.get('EPSG:4326');

    map = new ol.Map({
        controls: ol.control.defaults().extend([
            new ol.control.ScaleLine({
                units: 'degrees'
            })
        ]),
        //layers: layers,
        target: 'MyMapDiv',
        view: new ol.View({
            projection: projection,
            center: [0, 0],
            zoom: 6
        })
    });

    zoomslider = new ol.control.ZoomSlider();
    map.addControl(zoomslider);

    var lon = 114.56931531514307;
    var lat = 34.57252452951756;
    var zoom = 10;

    var center = [lon, lat];

    map.getView().setCenter(center);
    map.getView().setZoom(zoom);

}

/**
 * 加载basegroup图层组，目前为 全球矢量地图服务 和 全球矢量中文注记服务
 * */
function loadlayersgroup_base() {
    //console.log("进入gis_index.js中loadlayersgroup_base()");

    layersgroup_base = new ol.layer.Group();
    layersgroup_base.set('layername','layersgroup_base');

    layersgroup_base.getLayers().push(getTdtLayer2('vec_c'));
    layersgroup_base.getLayers().push(getTdtLayer2('cva_c'));

    map.addLayer(layersgroup_base);
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

    var projection = ol.proj.get('EPSG:4326');
    var projectionExtent = projection.getExtent();
    var size = ol.extent.getWidth(projectionExtent) / 256;
    var resolutions = new Array(20);
    var matrixIds = new Array(20);

    for (var z = 0; z <=20; ++z) {
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = z;
    }

    var layername = t.substr(0,3);

    var layer = new ol.layer.Tile({
        name:'ssss',
        source: new ol.source.WMTS({
            url: 'http://t{0-6}.tianditu.com/' + t + '/wmts',
            layer: layername,
            format: 'tiles',
            tileGrid: new ol.tilegrid.WMTS({
                origin: ol.extent.getTopLeft(projectionExtent),
                resolutions: resolutions,
                matrixIds: matrixIds
            }),
            matrixSet:'c',
            style: 'default'
        })
    });

    return layer;
}


/**
 * 按feature类型获取定义的style数组中对应的style
 *
 * @param feature
 * @returns {*}
 */
function getstyle(feature) {

    var imgdom = document.createElement("img");
    imgdom.src = 'image/cam_4.png';
    imgdom.width = 20;
    imgdom.height = 20;
    imgdom.style.cursor = "pointer";

    var image = new ol.style.Icon({
        anchor: [0.5, 0.5],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        imgSize:[20,20],
        img: imgdom
    });
    var image_test = new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        scale:0.8,
        anchor: [25, 14],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src: 'image/video_1.png'
    }));


    var styles = {
        'Point': new ol.style.Style({
            image: image_test
            //image: image
        }),
        'LineString': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'green',
                width: 1
            })
        }),
        'MultiLineString': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'green',
                width: 1
            })
        }),
        'MultiPoint': new ol.style.Style({
            image: image
        }),
        'MultiPolygon': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'yellow',
                width: 1
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 0, 0.1)'
            })
        }),
        'Polygon': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'blue',
                lineDash: [4],
                width: 3
            }),
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 255, 0.1)'
            })
        }),
        'GeometryCollection': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'magenta',
                width: 2
            }),
            fill: new ol.style.Fill({
                color: 'magenta'
            }),
            image: new ol.style.Circle({
                radius: 10,
                fill: null,
                stroke: new ol.style.Stroke({
                    color: 'magenta'
                })
            })
        }),
        'Circle': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'red',
                width: 2
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255,0,0,0.2)'
            })
        })
    };


    return styles[feature.getGeometry().getType()];
}


function addVectorLayer(){
	var pointstring='{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[114.5693,34.5725]},"properties":{"id":1,"name":"lzp"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[114.7693,34.5725]},"properties":{"id":2,"name":"lzp2"}}]}';
    var pointArr=new ol.format.GeoJSON().readFeatures(pointstring);
    
    //添加点图层	
    var pointVectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        features: pointArr,
        strategy: ol.loadingstrategy.bbox
    });

	var pointLayer = new ol.layer.Vector({
        visible:true,
        source: pointVectorSource,
        style: getstyle
    });
	pointLayer.set('layername','pointLayer');
	map.addLayer(pointLayer);
	
	
	var polygonstring='{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[114.91803555296305,34.91851817260605],[114.9190528016867,34.87274180192609],[114.9592342834318,34.887491960805995],[114.91803555296305,34.91851817260605]]]},"properties":{"id":1,"name":"lzp1"}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[114.38869342523783,34.62206586752313],[114.31545126567751,34.51627158116776],[114.40090049374074,34.46337443799007],[114.38869342523783,34.62206586752313]]]},"properties":{"id":2,"name":"lzp2"}}]}';
    var polygonArr=new ol.format.GeoJSON().readFeatures(polygonstring);
    
    //添加面图层	
    var polygonVectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        features: polygonArr,
        strategy: ol.loadingstrategy.bbox
    });

	var polygonLayer = new ol.layer.Vector({
        visible:true,
        source: polygonVectorSource,
        style: getstyle
    });
	polygonLayer.set('layername','polygonLayer');
	map.addLayer(polygonLayer);
}


var overlay;
var closer;
/**
* Elements that make up the popup.
*/
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
closer = document.getElementById('popup-closer');

function initPopup() {
  /**
   * Create an overlay to anchor the popup to the map.
   */
  overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
      element: container,
      autoPan: true,
      autoPanAnimation: {
          duration: 250
      }
  }));

  map.addOverlay(overlay);
  /**
   * Add a click handler to hide the popup.
   * @return {boolean} Don't follow the href.
   */
  closer.onclick = function() {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
  };

  /**
   * Add a click handler to the map to render the popup.
   */
  map.on('singleclick', function(evt) {
  	overlay.setPosition(undefined);
      var feature = map.forEachFeatureAtPixel(evt.pixel,
          function(feature) {
              return feature;
          });
      content.innerHTML = '';
      
      if (feature) {
	      	var type=feature.getGeometry().getType();
	      	if(type!='Point'&&type!='Polygon') return;
	      	if(feature.get('id')==null) return;
	      	var geo=feature.getGeometry();
	  		content.innerHTML ='--' + feature.get('id') + '--'+
						  		'<br>' + feature.get('name');
	  		if(type=='Point'){
	  			content.innerHTML=content.innerHTML+'<br><br><br> <a class="layui-btn" href="javascript:deletePoint('+feature.get('id')+');">删除</a>';
	  		}else{
	  			content.innerHTML=content.innerHTML+'<br><br><br> <a class="layui-btn" href="javascript:deletePolygon('+feature.get('id')+');">删除</a>';
	  		}
						  		
	  	    map.addOverlay(overlay);
      	
          var coord = feature.getGeometry().getCoordinates();
          overlay.setPosition(evt.coordinate);
          overlay.setOffset([0,-5]);
      }
  });
  //右键
  $(map.getViewport()).on("contextmenu", function(event){
		event.preventDefault();
		
		overlay.setPosition(undefined);
		var pixel = map.getEventPixel(event);
		content.innerHTML = '';
		var feature = map.forEachFeatureAtPixel(pixel,
		          function(feature) {
		              return feature;
		          });
		
		if (feature) {
			if(feature.get('id')==null) return;
	      	var type=feature.getGeometry().getType();
	      	var geo=feature.getGeometry();
	  		content.innerHTML ='--' + feature.get('id') + '--'+
						  		'<br>' + feature.get('name');
	  		if(type=='Point'){
	  			content.innerHTML=content.innerHTML+'<br><br><br> <a class="layui-btn" href="javascript:deletePoint('+feature.get('id')+');">删除</a>';
	  		}else{
	  			content.innerHTML=content.innerHTML+'<br><br><br> <a class="layui-btn" href="javascript:deletePolygon('+feature.get('id')+');">删除</a>';
	  		}
						  		
	  	    map.addOverlay(overlay);
      	
          var coord = feature.getGeometry().getCoordinates();
          var coordinate = map.getEventCoordinate(event);
          overlay.setPosition(coordinate);
          overlay.setOffset([0,-5]);
      }
	    // 书写事件触发后的函数
	});
}

function deletePoint(id){
	
	layer.confirm('确定要删除选中的点记录？', {
		btn : [ '确定', '取消' ]
	}, function() {
		layer.msg("删除点成功  "+id);
	})
}
function deletePolygon(id){
	layer.confirm('确定要删除选中的面记录？', {
		btn : [ '确定', '取消' ]
	}, function() {
		layer.msg("删除面成功  "+id);
	})
}
function addPoint(){
	//alert('加点');
	drawActive();
}
//拉框查询
var geoResult="";//保存画图的数据
var draw;
var drawPolygon;
var drawSource = new ol.source.Vector();
var styles;
var stylesPolygon;
var drawVector;
/**
 *给map添加 画图 和 编辑事件
 *
 * @param 
 * @returns {}
 */
function addInteraction() {
	styles = [ new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'blue',
            width: 3
          }),
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.1)'
          }),
    	image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
    	   scale:0.8,
           anchor: [25, 14],
           anchorXUnits: 'pixels',
           anchorYUnits: 'pixels',
           src: 'image/video_1.png'
       }))
    })];
	
	 drawVector = new ol.layer.Vector({
         source: drawSource,
         style: getstyle
     });
	map.addLayer(drawVector);
	
    
    stylesPolygon=new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'blue',
            lineDash: [4],
            width: 3
        }),
        fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.1)'
        })
    });
    draw = new ol.interaction.Draw({
        source: drawSource,
        type: "Point",
        style: styles
    });
    draw.on("drawend",function(evt) {
        //var geo=evt.feature.getGeometry();
//        var featureStr=new ol.format.GeoJSON().writeFeature(evt.feature);
//        var feature=JSON.parse(featureStr);
//        var geo=feature.geometry.coordinates;
//        geoResult=JSON.stringify(geo);
    	geoResult=evt.feature;
        //alert(geoResult);
        draw.setActive(false);
        addGeosaveControl();
        setTimeout(function () {
            map.addInteraction(new ol.interaction.DoubleClickZoom({delta:0}));
        });
    });
    map.addInteraction(draw);
    draw.setActive(false);
    
    
    drawPolygon = new ol.interaction.Draw({
        source: drawSource,
        type: "Polygon",
        style: stylesPolygon
    });
    drawPolygon.on("drawend",function(evt) {
        //var geo=evt.feature.getGeometry();
//        var featureStr=new ol.format.GeoJSON().writeFeature(evt.feature);
//        var feature=JSON.parse(featureStr);
//        var geo=feature.geometry.coordinates;
//        geoResult=JSON.stringify(geo);
        geoResult=evt.feature;
        //alert(geoResult);
        drawPolygon.setActive(false);
        addGeosaveControl();
        setTimeout(function () {
            map.addInteraction(new ol.interaction.DoubleClickZoom({delta:0}));
        });
    });
    map.addInteraction(drawPolygon);
    drawPolygon.setActive(false);
}
/**
 *激活画图
 *
 * @param 
 * @returns {}
 */
function  drawActive() {
    drawSource.clear();
    draw.setActive(true);
    drawPolygon.setActive(false);
    //去除map双击zoom事件
    var dblClickInteraction;
    map.getInteractions().getArray().forEach(function(interaction) {
        if (interaction instanceof ol.interaction.DoubleClickZoom) {
            dblClickInteraction = interaction;
        }
    });
    // remove from map
    map.removeInteraction(dblClickInteraction);
}

function  drawPolygonActive() {
    drawSource.clear();
    drawPolygon.setActive(true);
    draw.setActive(false);
    //去除map双击zoom事件
    var dblClickInteraction;
    map.getInteractions().getArray().forEach(function(interaction) {
        if (interaction instanceof ol.interaction.DoubleClickZoom) {
            dblClickInteraction = interaction;
        }
    });
    // remove from map
    map.removeInteraction(dblClickInteraction);
}
function addPolygon(){
	drawPolygonActive();
}


var screenwidth = document.body.clientWidth;
var geoSaveIndex=null;
/**
 *打开wfs查询窗口
 *
 * @param 
 * @returns {}
 */
function addGeosaveControl() {
	 if(geoSaveIndex!=null) return;
    layui.use([ 'layer'], function() {
        var layuilayer = layui.layer;
        geoSaveIndex= layuilayer.open({
            //type: 2,
            title: '保存',
            offset: ['100px', screenwidth-340+'px'],
            closeBtn: 0,
            cancel: function(){ 
                //右上角关闭回调
            	geoSaveIndex=null;
            },
            shade: 0,
            shadeClose: false, //点击遮罩关闭层
            maxmin: true,
            scrollbar: true,
            area : ['330px','330px'],
            //content: 'geo_save.html' //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			type: 1,
			content: $('#geo_save') 
        });
    });
}

function closeGeosaveLayer(){
    layer.close(geoSaveIndex);
    geoSaveIndex=null;
	$("#geo_save").css('display','none'); 
}


 /**
        *重置
        *
        * @param result
        * @returns {}
        */
function reset(){
	document.getElementById("id").value="";
	document.getElementById("name").value="";
	document.getElementById("field1").value="";
	document.getElementById("field2").value="";
	geoResult="";
	drawSource.clear();
	closeGeosaveLayer();
}


function save(){
	
	if(document.getElementById("id").value=='')
	{
		layer.msg("请输入ID");
		return;
	}
	
	
	var feature=this.parent.geoResult;
	var pro=new Object();
	pro.id=document.getElementById("id").value;
	pro.name=document.getElementById("name").value;
	feature.setProperties(pro);
	
	var geoString=new ol.format.GeoJSON().writeFeature(feature);
	alert(geoString);
}