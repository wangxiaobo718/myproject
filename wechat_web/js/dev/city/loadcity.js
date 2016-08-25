$(function () {
    fillProvince($("#ProvinceIdValue").val());
    fillCity($("#CityIdValue").val());
    fillArea($("#AreaIdValue").val());
    $("#ProvinceId").change(function () {
        fillCity(0);
        fillArea(0);
        $("#ProvinceIdValue").val($("#ProvinceId").val());
        var province = $("#ProvinceId>option:selected").text();
        $("#ProvinceIdText").val(province);
    });

    $("#CityId").change(function () {
        fillArea(0);
        $("#CityIdValue").val($("#CityId").val());
        var city = $("#CityId>option:selected").text();
        $("#CityIdText").val(city);
    });

    $("#AreaId").change(function () {
        $("#AreaIdValue").val($("#AreaId").val());
        var area = $("#AreaId>option:selected").text();
        $("#AreaIdText").val(area);
        
    });
});
function fillProvince(id) {
    $("#ProvinceId").contents().remove();
    $("#ProvinceId").append("<option value='-1'>省</option>");
    $(provinces).each(function (idx, d) {
        if (id == 0) {
            $("#ProvinceId").append("<option value='" + d[1] + "'>" + d[2] + "</option>");
        }else {
            if (d[1] == id) {
                $("#ProvinceIdValue").val(d[1]);
                $("#ProvinceId").append("<option selected='selected' value='" + d[1] + "'>" + d[2] + "</option>");
            }else {
                $("#ProvinceId").append("<option value='" + d[1] + "'>" + d[2] + "</option>");
            }
        }
    });

    $(provinces).each(function (idx, d) {
        if (id == 0) {
            $("#fpProvinceId").append("<option value='" + d[1] + "'>" + d[2] + "</option>");
        }else {
            if (d[1] == id) {
                $("#ProvinceIdValue").val(d[1]);
                $("#fpProvinceId").append("<option selected='selected' value='" + d[1] + "'>" + d[2] + "</option>");
            }else {
                $("#fpProvinceId").append("<option value='" + d[1] + "'>" + d[2] + "</option>");
            }
        }
    });
}
function fillCity(id) {
    var pid = $("#ProvinceId").val();
    $("#CityId").contents().remove();
    $("#CityId").append("<option value='-1'>市</option>");
    $(citys).each(function (idx, d) {
        if (d[0] == pid) {
            if (d[1] == id) {
                $("#CityIdValue").val(d[1]);
                $("#CityId").append("<option selected='selected' value='" + d[1] + "'>" + d[2] + "</option>");
            }else {
                $("#CityId").append("<option value='" + d[1] + "'>" + d[2] + "</option>");
            }
        }
    });

    var pid2 = $("#fpProvinceId").val();
    $("#fpCityId").contents().remove();
    $(citys).each(function (idx, d){
        if (d[0] == pid2) {
            if (d[1] == id) {
                $("#CityIdValue").val(d[1]);
                $("#fpCityId").append("<option selected='selected' value='" + d[1] + "'>" + d[2] + "</option>");
            }else {
                $("#fpCityId").append("<option value='" + d[1] + "'>" + d[2] + "</option>");
            }
        }
    });
}
function fillArea(id) {
    var cid = $("#CityId").val();
    $("#AreaId").contents().remove();
    $("#AreaId").append("<option value='-1'>区</option>");
    $(areas).each(function (idx, d) {
        if (d[0] == cid) {
            if (d[1] == id) {
                $("#AreaIdValue").val(d[1]);
                $("#AreaId").append("<option selected='selected' value='" + d[1] + "'>" + d[2] + "</option>");
            }else {
                $("#AreaId").append("<option value='" + d[1] + "'>" + d[2] + "</option>");
            }
        }
    });
    var cid2 = $("#fpCityId").val();
    $("#fpAreaId").contents().remove();
    $(areas).each(function (idx, d) {
        if (d[0] == cid2) {
            if (d[1] == id) {
                $("#AreaIdValue").val(d[1]);
                $("#fpAreaId").append("<option selected='selected' value='" + d[1] + "'>" + d[2] + "</option>");
            }else {
                $("#fpAreaId").append("<option value='" + d[1] + "'>" + d[2] + "</option>");
            }

        }
    });
}