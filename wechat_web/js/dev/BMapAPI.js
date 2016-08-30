// 关键字提示输入
function initKeyWordSearch(lng,lat,text,callback){
	// 百度地图API功能
	var map = new BMap.Map("l-map");
	map.centerAndZoom(new BMap.Point(lng, lat),11);
	var options = {
		onSearchComplete: function(results){
			// 判断状态是否正确
			console.log(results);
			if (local.getStatus() == BMAP_STATUS_SUCCESS){
				callback(results);
			}
		}
	};
	var local = new BMap.LocalSearch(map, options);
	local.search(text);
}

// 逆地理编码
function getLocationByLatLng(lng,lat,addr,func){
	var geoc = new BMap.Geocoder(); 
	var pt = new BMap.Point(lng,lat);
	var addComp;
	geoc.getLocation(pt, function(rs){
		addComp = rs.addressComponents;
		func(addComp,addr);
	});
}
//地理编码
function getLngLat(str,func){
	// 百度地图API功能
	var map = new BMap.Map("l-map");
	var point = new BMap.Point(116.331398,39.897445);
	map.centerAndZoom(point,11);
	// 创建地址解析器实例
	var myGeo = new BMap.Geocoder();
	// 将地址解析结果显示在地图上,并调整地图视野
	myGeo.getPoint(str, function(point){
		if (point) {
			console.log(point);
			func(point);
		}else{
			alert("您选择地址没有解析到结果!");
		}
	}, str);
}
//浏览器定位
function locBrowser(func){
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			console.log(r);
			func(r.point);
		}
		else {
			alert('定位失败');
		}        
	},{enableHighAccuracy: true})
	//关于状态码
	//BMAP_STATUS_SUCCESS	检索成功。对应数值“0”。
	//BMAP_STATUS_CITY_LIST	城市列表。对应数值“1”。
	//BMAP_STATUS_UNKNOWN_LOCATION	位置结果未知。对应数值“2”。
	//BMAP_STATUS_UNKNOWN_ROUTE	导航结果未知。对应数值“3”。
	//BMAP_STATUS_INVALID_KEY	非法密钥。对应数值“4”。
	//BMAP_STATUS_INVALID_REQUEST	非法请求。对应数值“5”。
	//BMAP_STATUS_PERMISSION_DENIED	没有权限。对应数值“6”。(自 1.1 新增)
	//BMAP_STATUS_SERVICE_UNAVAILABLE	服务不可用。对应数值“7”。(自 1.1 新增)
	//BMAP_STATUS_TIMEOUT	超时。对应数值“8”。(自 1.1 新增)
}