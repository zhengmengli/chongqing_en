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

    
	var type=feature.get('type');
	
    var image_icon = new ol.style.Icon({
        scale:0.3,
		anchor: [0.5, 110],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
		src : 'image/dw'+type+'.png'
    });


	var txt=feature.get('id')+'';

    var styles = {
        'Point': new ol.style.Style({
            image: image_icon,
			text: new ol.style.Text({
				offsetX:4,
				offsetY:-22,
				textAlign: 'bottom', //位置
				textBaseline: 'middle', //基准线
				font: 'normal 18px 微软雅黑',  //文字样式
				text: txt,//文本内容
				fill: new ol.style.Fill({ color: '#aa3300' }), //文本填充样式（即文字颜色）
				stroke: new ol.style.Stroke({ color: '#ffcc33', width: 2 })
			})
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
            image: image_icon
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



	var pointstring='{"type":"FeatureCollection","features":['
	+'{"type":"Feature","geometry":{"type":"Point","coordinates":[114.5693,34.5725]},"properties":{"id":1,"name":"重庆爱生菜科技","addr":"重庆九龙坡","person":"张三","phone":"13213453245","status":"启用","useDevice":14,"unuseDevice":1,"type":"1"}},'
	+'{"type":"Feature","geometry":{"type":"Point","coordinates":[114.6693,34.5425]},"properties":{"id":2,"name":"重庆阿吉农业","addr":"重庆九龙坡","person":"李四","phone":"13213453245","status":"启用","useDevice":14,"unuseDevice":1,"type":"1"}},'
	+'{"type":"Feature","geometry":{"type":"Point","coordinates":[114.7693,34.5325]},"properties":{"id":3,"name":"华伟农业","addr":"创业大厦","person":"张三","phone":"13213453245","status":"启用","useDevice":14,"unuseDevice":1,"type":"2"}}'
	+']}';

function addVectorLayer(){

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
	      	if(type!='Point') return;
	      	if(feature.get('id')==null) return;
	      	var geo=feature.getGeometry();
	  		content.innerHTML ='--' + feature.get('name') + '--'+
						  		'<br>地址：' + feature.get('addr')+
								'<br>负责人：' + feature.get('person')+
								'<br>联系电话：' + feature.get('phone')+
								'<br>企业状态：' + feature.get('status')+
							    '<hr>'+
								'在线设备：' + feature.get('useDevice')+
	  							'<br>故障设备' + feature.get('unuseDevice');
						  		
	  	    map.addOverlay(overlay);
      	
          var coord = feature.getGeometry().getCoordinates();
          overlay.setPosition(evt.coordinate);
          overlay.setOffset([0,-5]);
      }
  });

}


function addcontrol() {

    layui.use(['form','element', 'layer'], function(){
        var layuielement = layui.element;
        var layuilayer = layui.layer;

        var layuiform = layui.form;

        var layerControlIndex=layuilayer.open({
            type: 1,
            title: '',
            offset: ['70px', '50px'],
            closeBtn:0,
            shade:0,
            shadeClose: false, //点击遮罩关闭层
            maxmin: false,
            scrollbar:true,
            area : ['300px','500px'],
            content: $('#layercontrol_div') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        });

		var pointArr=new ol.format.GeoJSON().readFeatures(pointstring);
		for(var i=0;i<pointArr.length;i++){
			var pro=pointArr[i].getProperties();
			var ll=pointArr[i].getGeometry().getCoordinates()+'';
			var pp=ll.split(",");
			var html=
				'<div  onclick="locationGis('+pp[0]+','+pp[1]+')" class="layui-form-item"><img src="image/dw'+pro.type+'.png" width="42" height="42"><label class="layui-form-text">'+pro.name+'</label><br>'+
				'<label class="layui-form-text">地址：'+pro.addr+'</label><br>'+
				'<label class="layui-form-text">负责人：'+pro.person+'</label><br>'+
				'<label class="layui-form-text">电话：'+pro.phone+'</label></div>';
				
			$("#layerContent").append(html);
		}
		

		layuiform.render();
	});

}

function locationGis(lon,lat){
	var center = [lon, lat];
    map.getView().setCenter(center);
    map.getView().setZoom(15);

    overlay.setPosition(undefined);
	setTimeout(function () {
              
		var pixel=map.getPixelFromCoordinate(center);
		var feature = map.forEachFeatureAtPixel(pixel,
          function(feature) {
              return feature;
          });
		content.innerHTML = '';
      
		if (feature) {
	      	var type=feature.getGeometry().getType();
	      	if(type!='Point') return;
	      	if(feature.get('id')==null) return;
	      	var geo=feature.getGeometry();
	  		content.innerHTML ='--' + feature.get('name') + '--'+
						  		'<br>地址：' + feature.get('addr')+
								'<br>负责人：' + feature.get('person')+
								'<br>联系电话：' + feature.get('phone')+
								'<br>企业状态：' + feature.get('status')+
							    '<hr>'+
								'在线设备：' + feature.get('useDevice')+
	  							'<br>故障设备' + feature.get('unuseDevice');
						  		
	  	    map.addOverlay(overlay);
      	
          var coord = feature.getGeometry().getCoordinates();
          overlay.setPosition(coord);
          overlay.setOffset([10,-30]);
      }
    });        
}
