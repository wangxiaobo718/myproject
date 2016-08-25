function regularPhone(phone){
    var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
    if (reg.test(phone)) {
        return true;
    }else{
        return false;
    }
}
//得到收货地址的地址类型
function getAddress_AddressType(type){
    var str="";
    type=parseInt(type);
    switch (type){
        case 1:
            str="家";
            break;
        case 2:
            str="公司";
            break;
        case 3:
            str="朋友";
            break;
    }
    if(str=="")
        str="未分类";
    return str;
}
//得到收货地址的class
function getAddress_AddressClass(type){
    var str="";
    switch (type){

        case 1:
            str="address-home";
            break;
        case 2:
            str="address-company";
            break;
        case 3:
            str="address-friend";
            break;
    }
    if(str=="")
        str="address-home";
    return str;
}
//得到收货地址的class
function getAddress_AddressClassByName(typeName){
    var str="";
    switch (type){

        case "家":
            str="address-home";
            break;
        case "公司":
            str="address-company";
            break;
        case "朋友":
            str="address-friend";
            break;
    }
    if(str=="")
        str="address-home";
    return str;
}