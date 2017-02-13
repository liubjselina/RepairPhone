
jQuery(function(){
	var doorRange = eval("(" + $.trim($("#City_Door_Range_div").text())+")");
    //手机型号及故障选择效果
    $.fn.clickElement = function () {
        return this.each(function (i){
            $(this).click(function(){
                var len = $(this).siblings("ul").eq(i).find("li").length;
                var $this = $(this);
                if(len>0){
                    $(this).toggleClass("on").siblings("ul").eq(i).slideToggle(500,function(){
                        var top = $this.offset().top;
                        $('body').stop().animate({scrollTop:top},800);
                    }).siblings("ul").hide();
                    $(this).siblings("h4").removeClass("on");
                }else{
                    $(this).toggleClass("non").siblings("ul").hide().siblings("h4").removeClass("on");
                }
                checkedElement();
                $this.siblings("ul").find("li").click(function(){
                    checkedElement();
                });

            });
        });
    };

    /**
     * 选择框效果，故障选择效果
     * callback:处理完成后的回调
     */
    $.fn.selectedElement =function(callback){
        return this.each(function(i) {
            if(!$(this).hasClass('other-service')){
                $(this).click(function(){
                    var $this = $(this);
                    var checked = $this.find("input[type='checkbox']").attr("checked");
                    if(checked!=undefined){
                        $this.find("input[type='checkbox']").attr("checked",false);
                        $this.removeClass("on");
                    }else{
                        $this.find("input[type='checkbox']").attr("checked",true);
                        $this.addClass("on");
                    }
                    var $ul_on = $(this).parent("ul").find(".on"),
                        li_len = $ul_on.length;
                    if(li_len > 0){
                        $this.parent("ul").prev("h4").addClass("non");
                    }else{
                        $this.parent("ul").prev("h4").removeClass("non");
                    }
                    //执行回调
                    if($.isFunction(callback || "")) {
                        callback($this);
                    }
                });
            }
        });
    },
        /*$(".selectArea").click(function(){
         bodybg();
         $(".selectArea_lay,.bodybg").show();
         scroll_fuc(); //滚动条效果
         });*/
        $(".bodybg").click(function(){
            $(".selectArea_lay,.confirm-goods,.selectDate_lay,.bodybg,.jkx-center-lay").hide();
            $(".brandlay_lay,.faultlay_lay").hide();
        });

    if($(".selectArea").length != 0 ) {
        $(".selectArea").click(function(){
            var loadImg = "<img class='load_img_' src='"+window.resourcePath+"/resources/images/loading.gif'/>";
            $(".selectArea_lay .select_tit").text("请选择");
            bodybg();
            $(".selectArea_lay,.bodybg").show();
            $(".selectArea_lay .wra").hide();
            $(".selectArea_lay .wra").eq(0).show();

            var $provinceUl = $(".province ul");
            if($provinceUl.children().length == 0) {
                $(".province").append(loadImg);
                $.ajax({
                    url:window.ctx+"/getPrivinceList.json",
                    type:"POST",
                    dataType : "json",
                    success:function(data){
                        $(".province .load_img_").remove();
                        if(data && data.privinceList) {
                            for(var i=0; i<data.privinceList.length;++i) {
                                var privince = data.privinceList[i];
                                $provinceUl.append("<li privinceId='"+privince.id+"'>"+privince.name+"</li>");
                            }
                            scroll_fuc(); //滚动条效果
                            bindPrivinceEvent();
                        }
                    }
                });
            } else {
                bindPrivinceEvent();
            }


            function bindPrivinceEvent() {
                $provinceUl.children().unbind("click").bind("click",function(){
                    $(".selectArea_lay .select_tit").html("<s></s>"+$(this).text());
                    $(".select_tit s").unbind("click").bind("click", function () {
                        $(".selectArea_lay").find(".wra").hide();
                        $(".selectArea_lay").find(".wra").eq(0).show();
                        $(".selectArea_lay .select_tit").text("请选择");
                    });
                    
                    
                    $provinceUl.children().removeClass("selProvince");
                    $(this).addClass("selProvince");
                    var privinceId = $(this).attr("privinceId");
                    $(this).closest(".wra").hide().attr("id","").next(".wra").show().attr("id","wrapper");

                    //$(".city .load_img_").remove();

                    var $cityUl  = $(".city ul");
                    $cityUl.empty();

                        $("#wrapper .load_img_").remove();
                        $("#wrapper").append(loadImg);

                    $.ajax({
                        url:window.ctx+"/getCity.json",
                        type:"POST",
                        data : {
                            privinceId : privinceId
                        },
                        dataType : "JSON",
                        success:function(data){
                            if(data && data.cityList) {
                                for(var i =0; i<data.cityList.length;++i) {
                                    var city = data.cityList[i];
                                    $cityUl.append("<li cityId='"+city.id+"'>"+city.name+"</li>");
                                }
                            }
                            $("#wrapper .load_img_").hide();
                            scroll_fuc(); //滚动条效果
                            $cityUl.children().unbind("click").bind("click",function(){
                                $(".selectArea_lay .select_tit").html("<s></s>"+$(".selProvince").text()+"&nbsp;>&nbsp;"+$(this).text());
                                $(".select_tit s").unbind("click").bind("click", function(){
                                    $(".selectArea_lay").find(".wra").hide();
                                    $(".selectArea_lay").find(".wra").eq(1).show();
                                    $(".select_tit").html("<s></s>"+$(".selProvince").text());
                                    $(".select_tit s").unbind("click").bind("click", function(){
                                        $(".selectArea_lay").find(".wra").hide();
                                        $(".selectArea_lay").find(".wra").eq(0).show();
                                        $(".selectArea_lay .select_tit").html("请选择");
                                    });
                                });
                                $cityUl.children().removeClass("selCity");
                                $(this).addClass("selCity");
                                var cityId = $(this).attr("cityId");
                                $("[name='cityId']").val(cityId);
                                $(this).closest(".wra").hide().attr("id","").next(".wra").show().attr("id","wrapper");



                                var $areaUl = $(".area ul");
                                $areaUl.empty();
                                $("#wrapper").append(loadImg);
                                $.ajax({
                                    url:window.ctx+"/getDist.json",
                                    type:"post",
                                    dataType : "json",
                                    data:{
                                        cityId  : cityId
                                    },
                                    success:function(data){
                                        $("#wrapper .load_img_").remove();
                                        if(data && data.distList ) {

                                            for(var i=0;i<data.distList.length;++i) {
                                                var dist = data.distList[i];
                                                $areaUl.append("<li distId='"+dist.id+"'>" + dist.name+"</li>");
                                            }
                                            scroll_fuc(); //滚动条效果
                                            $areaUl.children().click(function(){
                                                //var homeRepairCityId = $.trim($("#support_home_repair_city_id").val());
                                                //var re = new RegExp("^("+cityId+")|(.*,"+cityId+",.*)|("+cityId+",.*)|(.*,"+cityId+")$");
                                                if(isSupportDoor(cityId)) { // 北京地区支持上门维修
                                                    $(".repairMethod_cls").show();
                                                    var repairMethod = $("[name='repairMethod']:checked").val();
                                                    if(repairMethod == 0) {
                                                        $(".repairMethod_cls:last").hide();
                                                        $(".jkx-center").show();
                                                        $("#quick_remark").html("提示：</br>1、该地区不支持上门服务，需要您把设备邮寄到维修中心处理，请按需选择！</br>2、工作时间（8:00-22:00）内将有来自重庆区号023的电话与您联系确认详情！");
                                                    } else {
                                                        $(".jkx-center").hide();
                                                        var range = eval("doorRange["+cityId+"]");
                                                        $("#quick_remark").html("提示：</br>1、"+range+"</br>2、工作时间（8:00-22:00）内将有来自重庆区号023的电话与您联系确认详情！");
                                                    }
                                                } else {
                                                    $(".repairMethod_cls").hide();
                                                    $(".jkx-center").show();
                                                    $("#quick_remark").html("提示：</br>1、该地区不支持上门服务，需要您把设备邮寄到维修中心处理，请按需选择！</br>2、工作时间（8:00-22:00）内将有来自重庆区号023的电话与您联系确认详情！");
                                                }

                                                var $this = $(this);
                                                $this.closest(".selectArea_lay").hide().find(".wra").eq(0).show().siblings(".wra").hide();
                                                $(".bodybg").hide();

                                                var distId = $this.attr("distId");
                                                $("[name='distId']").val(distId);
                                                var provinceName = $(".selProvince").text();
                                                var cityName = $(".selCity").text();
                                                var distName =  $this.text();

                                                $(".selectArea").html(provinceName+"&nbsp;&gt;&nbsp;"+cityName+"&nbsp;&gt;&nbsp;"+distName+"<u></u>");
                                            });
                                        }
                                    }
                                });

                            });
                        }
                    });
                });
            }
        });

        window.baiduPositionCallback = function(data){
            if(data && data.status == 0) {
                var result = data.result;
                if(result) {
                    var address = result.addressComponent;
                    if(address) {
                        var province =  address.province;
                        var city = address.city;
                        var district = address.district;

                        $.ajax({
                            url:window.ctx+"/order/getDistByName",
                            data:{
                                cityName:city,
                                distName:district
                            },
                            type:"POST",
                            dataType:"JSON",
                            success:function(data) {
                                if(data && data.dist) {
                                    var dist = data.dist;
                                    var distId = dist.id;
                                    var cityId = dist.city.id;

                                    $(".selectArea").html(dist.privince.name+"&nbsp;&gt;&nbsp;"+dist.city.name+"&nbsp;&gt;&nbsp;"+dist.name+"<u></u>");
                                    $("#distId").val(distId);
                                    $("#cityId").val(cityId);
                                     
                                    //var homeRepairCityId = $.trim($("#support_home_repair_city_id").val());
                                    //var re = new RegExp("^("+cityId+")|(.*,"+cityId+",.*)|("+cityId+",.*)|(.*,"+cityId+")$");
                                    if(isSupportDoor(cityId)) { // 判断该地区是否支持上门维修
                                        $(".repairMethod_cls").show();
                                        var repairMethod = $("[name='repairMethod']:checked").val();
                                        if(repairMethod == 0) {
                                            $(".repairMethod_cls:last").hide();
                                            $(".jkx-center").show();
                                            $("#quick_remark").html("提示：</br>1、该地区不支持上门服务，需要您把设备邮寄到维修中心处理，请按需选择！</br>2、工作时间（8:00-22:00）内将有来自重庆区号023的电话与您联系确认详情！");
                                        } else {
                                            $(".jkx-center").hide();
                                            var range = eval("doorRange["+cityId+"]");
                                            $("#quick_remark").html("提示：</br>1、"+range+"</br>2、工作时间（8:00-22:00）内将有来自重庆区号023的电话与您联系确认详情！");
                                        }
                                    } else {
                                        $(".repairMethod_cls").hide();
                                        $(".jkx-center").show();
                                        $("#quick_remark").html("提示：</br>1、该地区不支持上门服务，需要您把设备邮寄到维修中心处理，请按需选择！</br>2、工作时间（8:00-22:00）内将有来自重庆区号023的电话与您联系确认详情！");
                                    }
                                }
                            }
                        });
                    }
                }
            }
        };

        //获取地理位置
        if(window.navigator && window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(function(position){
                //获取定位成功的回调
                $.getScript("http://api.map.baidu.com/geocoder/v2/?ak=G1qcYAT3eYiTBK9PeenB1SL9&callback=baiduPositionCallback&location="+position.coords.latitude+","+position.coords.longitude+"&output=json&pois=1");
            });
        }

    }

    $.fn.selectArea = function(){
        return this.each(function(){
            $(this).click(function(){
                var def_txt = $(".select_tit").text();
                var li_txt = $(this).text();
                $(this).closest(".wra").hide().attr("id","").next(".wra").show().attr("id","wrapper");
                scroll_fuc();
                var Cname = $(this).closest("div").attr("class");
                if(Cname.indexOf("province") >= 0 ){
                    $(".select_tit").text(li_txt);
                }else{
                    $(".select_tit").text(def_txt+" > "+li_txt);
                }
                if(Cname.indexOf("area") >= 0 ){
                    var def_txt = $(".select_tit").text();
                    $(this).closest(".selectArea_lay").hide().find(".wra").eq(0).show().siblings(".wra").hide();
                    $(".bodybg").hide();
                    $(".selectArea").html(def_txt+"<u></u>");
                }
            });
        });
    },

        $.fn.tap =function(){
            return this.each(function(){
                $(this).on("tap",function(){
                    $(this).addClass("bggray");
                });
            });
        }

    function bodybg(){
        var dw = $(document).height();
        $(".bodybg").css("height",dw);
    };

    $(".button_b,.sureFan del").click(function(){
        $(".confirm-goods,.bodybg").show();
        bodybg();
    });
    $(".confirm-goods .close,.confirm-goods .que").click(function(){
        $(".confirm-goods,.bodybg").hide();
    });

    function VerifyElement(callback){
        var username = $.trim($("#userName").val()),
            mobilephone = $.trim($("#mobilePhone").val()),
        //verify = $("#verify").val(),
            address = $.trim($("#Address").val()),
            distId = $.trim($("[name='distId']").val()),
            cityId = $.trim($("[name='cityId']").val());
        if(username =='' || username == null){
            $("#userName").focus().addClass("tips");
            return false;
        }
        if(mobilephone =='' || mobilephone == null || !/^[1]{1}\d{10}$/.test(mobilephone)){
            $("#mobilePhone").val('');
            $("#mobilePhone").attr("placeholder", "请输入正确的手机号码");
            $("#mobilePhone").one("blur", function(){
                $("#mobilePhone").attr("placeholder", "请输入能联系到您的手机号");
            });
            $("#mobilePhone").focus().addClass("tips");
            return false;
        }
        if($("#verify").length == 1) {
            var verify = $("#verify").val();
            if(verify =='' || verify == null){
                $("#verify").focus().addClass("tips");
                return false;
            }
        } else {
            if(!/^1[3-8]{1}\d{9}$/.test(mobilephone)) {
                $("#mobilePhone").focus().addClass("tips");
                return false;
            }
        }

        if(address =='' || address == null){
            $("#Address").focus().addClass("tips");
            return false;
        }
        if(cityId == '') {
            $(".selectArea").click();
            return false;
        }


        //var re =new RegExp("^("+cityId+")|(.*,"+cityId+",.*)|("+cityId+",.*)|(.*,"+cityId+")$");
        if(isSupportDoor(cityId)) {
            var repairMethod = $("[name='repairMethod']:checked").val();
            if(repairMethod == 1) {
                var repairDate = $.trim($(".repairMethod_cls:last").text());
                if(repairDate == '请选择上门时间') {
                    $(".repairMethod_cls:last").click();
                    return false;
                }
            } else {
                var serviceCenterId = $.trim($("[name='serviceCenterId']").val());
                if(serviceCenterId == '') {
                    $(".jkx-center").click();
                    return false;
                }
            }
        } else {
            var serviceCenterId = $.trim($("[name='serviceCenterId']").val());
            if(serviceCenterId == '') {
                $(".jkx-center").click();
                return false;
            }
        }


        var vouCode=$.trim($("#vouCodeVal").val());

        /*   if(vouCode == '优惠码输入错误,请重新输入!'||vouCode=='优惠劵无效,请重新输入!'||vouCode=='您的设备型号不支持该优惠劵!'){
            $("#vouCodeVal").focus().addClass("border-text tips");
            return false;
        }
        if(vouCode!='') {
            isNum = /^[0-9]*$/;
            if(!isNum.test(vouCode)) {
                $("#vouCodeVal").attr("placeholder", "优惠劵输入错误,请重新输入!").val("");
                $("#vouCodeVal").focus().addClass("border-text tips");
                return false;
            }
        }*/



        //if($("#verify").length == 1) {
         //手机取消验证码
         //   var verify = $("#verify").val();
        var verify = 0;
            $.ajax({
                url:"idenCheck",
                data : {
                    skey : $("[name='skey']").val(),
                    mobile : mobilephone,
                    idenCode : verify,
                    vouCode:vouCode,
                    orderId:$("[name='orderId']").val()
                },
                dataType:"JSON",
                type:"POST",
                success:function(data){

                    if(data.status == 0) {
                        callback = callback || function(){};
                        callback(data);
                    }
                    else if(data.status==-202) {
                        $("#vouCodeVal").attr("placeholder", "此优惠券不满足使用条件或无效!").val("");
                        $("#vouCodeVal").focus().addClass("border-text tips");
                    }
                    else if(data.status==-203) {
                        $("#vouCodeVal").attr("placeholder", "您的设备型号不支持该优惠劵!").val("");
                        $("#vouCodeVal").focus().addClass("border-text tips");
                    }
                    else {
                        $("#verify").val('');
                        $("#verify").addClass("tips");
                        $("#verify").attr('placeholder', "验证码错误");
                    }
                }
            });
      //  } else {
        //    callback = callback || function(){};
         //   callback();
       // }
        //$(".submitForm .next-button").find("a").attr("href","确认订单信息.html")
    }

    //评价
    $.fn.radioElement = function(){
        return this.each(function(){
            $(this).click(function(){
                /*$(this).find("input[type='radio']").attr("checked","true");
                 if($(this).find("input[type='radio']").attr('checked')!=undefined){
                 $(this).addClass("on").siblings("span").removeClass("on");
                 }*/
                var type = $(this).find("input").attr("type");
                if(type == "radio"){
                    $(this).find("input[type='radio']").attr("checked","true");
                    if($(this).find("input[type='radio']").attr('checked')!=undefined){
                        $(this).addClass("on").siblings("span").removeClass("on");
                    }
                }
                if(type == "checkbox"){
                    var checked = $(this).find("input[type='checkbox']").attr("checked");
                    if(checked!=undefined){
                        $(this).find("input[type='checkbox']").attr("checked",false);
                        $(this).removeClass("check_on");
                    }else{
                        $(this).find("input[type='checkbox']").attr("checked",true);
                        $(this).addClass("check_on");
                    }
                }
                if($(this).parent().hasClass("repairMethod_cls")) {
                    if($(this).attr("shanmen")) {
                        $(".repairMethod_cls:last").show();
                        $(".jkx-center").hide();
                        var range = eval("doorRange["+cityId+"]");
                        $("#quick_remark").html("提示：</br>1、"+range+"</br>2、工作时间（8:00-22:00）内将有来自重庆区号023的电话与您联系确认详情！");
                    } else {
                        $(".repairMethod_cls:last").hide();
                        $(".jkx-center").show();
                        $("#quick_remark").html("提示：</br>1、该地区不支持上门服务，需要您把设备邮寄到维修中心处理，请按需选择！</br>2、工作时间（8:00-22:00）内将有来自重庆区号023的电话与您联系确认详情！");
                    }
                }
            });
        });
    }

    //文章菜单
    $(".menu_right").click(function(){
        bodybg();
        $(".nav,.bodybg").slideToggle();
    });

    function isSupportDoor(city) {
        var homeRepairCityId = $.trim($("#support_home_repair_city_id").val());
        var citys = homeRepairCityId.split(",");
        for(var i=0;i<citys.length; ++i) {
            if(citys[i] == city) {
                return true;
            }
        }
        return false;
    }

    //判断是否已选故障
    function checkedElement(){
        var num = $(".hitch").find(".non").length;
        //var num = $(".hitch input:checked").length;
        var otherServiceTextarea = $("#other_service_textarea");
        if(otherServiceTextarea.length == 0) {
            if(num==0){
                $("#confirmOrderSolution").addClass("but-gray");
                $("#confirmOrderSolution").attr("disabled",true)
            }else{
                $("#confirmOrderSolution").removeClass("but-gray");
                $("#confirmOrderSolution").attr("disabled",false)
            }
        } else {
            var tip = $.trim(otherServiceTextarea.val());
            var price = $.trim($("#other_service_price").val());
            if(num==0 && tip == '' && price == ''){
                $("#confirmOrderSolution").addClass("but-gray");
                $("#confirmOrderSolution").attr("disabled",true)
            }else{
                $("#confirmOrderSolution").removeClass("but-gray");
                $("#confirmOrderSolution").attr("disabled",false)
            }
        }

    }
    $("#confirmOrderSolution").click(function(){
        checkedElement();
    });

    $(".lxfs_lay").prepend("<i></i>");
	$(".lxfs_lay").find("i").live("click",function(){		
		$(".bodybg,.lxfs_lay").fadeOut();		
	});

	
    //选择上门时间
    $(".selectDate").click(function(){
        $(".selectDate_lay").remove();
        $(window.document.body).append('<div class="lxfs_lay selectDate_lay"><i></i><h3 class="Dselect_tit">选择时间</h3><div class="scroller"><ul id="datelay"></ul></div><div class="wra" id="wra_time" style="display:none"><div class="scroller"><ul id="Stimelay"><li class="t9">9:00</li><li class="t10">10:00</li><li class="t11">11:00</li><li class="t12">12:00</li><li class="t13">13:00</li><li class="t14">14:00</li><li class="t15">15:00</li><li class="t16">16:00</li><li class="t17">17:00</li><li class="t18">18:00</li><li class="t19">19:00</li></ul><ul id="Etimelay"><li class="t10">10:00</li><li class="t11">11:00</li><li class="t12">12:00</li><li class="t13">13:00</li><li class="t14">14:00</li><li class="t15">15:00</li><li class="t16">16:00</li><li class="t17">17:00</li><li class="t18">18:00</li><li class="t19">19:00</li><li class="t9">20:00</li></ul></div></div></div>');
        $("#datelay").show().html("");
        $("#wra_time").hide();
        $(".Dselect_tit").text("选择时间");
        var date=new Date();
        var Week = date.getDay();
        var Hours = date.getHours();
        var m = date.getMinutes();
        var day = date.getFullYear()+"-"+ (date.getMonth()+1)+"-"+ date.getDate();
        if(m<10){
            m="0" + m;
        }
        var current_time = Hours+"."+m;
        var a=0,b=7,w=1;
        if(current_time > 19){
            a=1,b=8,Week=Week+1;
        }
        for(i=a;i<b;i++){
            var dat=new Date((+date)+i*24*3600*1000);
            Week = Week+1;
            if(Week%7==0){var week = "六";}
            if(Week%7==1){var week = "日";}
            if(Week%7==2){var week = "一";}
            if(Week%7==3){var week = "二";}
            if(Week%7==4){var week = "三";}
            if(Week%7==5){var week = "四";}
            if(Week%7==6){var week = "五";}
            var dateStr = dat.getFullYear()+"-";
            if(dat.getMonth() < 9) {
                dateStr += "0";
            }
            dateStr = dateStr+(dat.getMonth()+1)+"-";
            if(dat.getDate() < 10) {
                dateStr += "0";
            }
            dateStr += dat.getDate();
            if(i==0){
                $("#datelay").append("<li date='"+dateStr+"'>"+dat.getFullYear()+"-"+ (dat.getMonth()+1)+"-"+ dat.getDate()+" 周"+week+"  (今天)</li>");
            }else if(i==1){
                $("#datelay").append("<li date='"+dateStr+"'>"+dat.getFullYear()+"-"+ (dat.getMonth()+1)+"-"+ dat.getDate()+" 周"+week+"  (明天)</li>");
            }else{
                $("#datelay").append("<li date='"+dateStr+"'>"+dat.getFullYear()+"-"+ (dat.getMonth()+1)+"-"+ dat.getDate()+" 周"+week+"</li>");
            }
        }
        bodybg();
        $(".selectDate_lay,.bodybg").show();
        $("#datelay").find("li").click(function(){
            var $this = $(this);
            var _theDate = $this.text();
            var _date = $this.attr("date");
            $(".Dselect_tit").html(_theDate);
            $(".Dselect_tit").attr("date", _date);
            if(_theDate.indexOf(day) >= 0 ){
                var T = Hours+1;
                if(current_time < 19){
                    $("#Stimelay").find(".t"+T).prevAll("li").hide();
                }else if(current_time=19){
                    T = Hours;
                    $("#Stimelay").find(".t"+T).prevAll("li").hide();
                }
            }else{
                $("#Stimelay").find("li").show();
            }
            $("#datelay").hide();
            $("#wra_time").show(0,function(){
                timelay();
                $(this).find("#Stimelay li").click(function(){
                    var _beginDate = $(this).text();
                    $(".Dselect_tit").html(_theDate+"("+_beginDate + "&nbsp;至&nbsp;");
                    var stime= _date+" "+$(this).text()+":00";
                    var sdate=_theDate +"("+$(this).text();
                    $("#door_start_date_hid").val(stime);
                    var time = $(this).text();
                    var s=time.split(":");
                    $("#Etimelay").find("li").show();
                    $("#Stimelay").hide().siblings("#Etimelay").show(0,function(){
                        $("#Etimelay").find("li").eq(s[0]-9).prevAll("li").hide();
                        $("#Etimelay").find("li").live("click",function(){
                            var etime= _date+" "+$(this).text()+":00";
                            var retime=sdate+"-"+$(this).text()+")"+"<u></u>";
                            $("#door_end_date_hid").val(etime);
                            $("#repairDate_hid").val(retime);
                            var _endDate = $(this).text();
                            $(".selectDate_lay").hide();
                            $(".bodybg").hide();
                            $(".submitForm .selectDate").html(_theDate+"("+_beginDate + "&nbsp;至&nbsp;"+_endDate+")<u></u>");
                            if(window.selDoorDateCallback){
                                window.selDoorDateCallback(stime, etime);
                            }
                        });
                    });
                });
            });
        });
    });
    //选择上门时间END

    //选择维修中心
    $(".jkx-center").click(function(e){
    	$(".Dselect_tit").text("选择维修中心");
        bodybg();
        $(".jkx-center-lay,.bodybg").show(0,function(){
            $(this).find("li").unbind("click").bind("click",function(){
                var Ncenter = $(this).text();
                $(".jkx-center").html(Ncenter+"<u></u>");
                $(".jkx-center-lay,.bodybg").hide();
                $("[name='serviceCenterId']").val($(this).attr("serviceCenterId"));
            })
        });
        scroll_fuc2();
        e.stopPropagation();
    });

    /*维修工程师*/
    $(".show_more a").live("click",function(){
        $.ajax({
            url:"",
            type:"get",
            dataType : "html",
            success:function(){
                $(".item").append('<ol class="sizing"><li class="first-li">待付款<small>J1422592241906428<time>01-26　14:35</time></small></li><li><span>上门：</span><p><time>2015-01-24  周三（13:00~14:00）</time></p></li><li><span>地址：</span><p>重庆 重庆市人民中路二段1号棕榈泉国际花园7#11-3</p></li><li><span>设备：</span><p>iPhone 4S（金）</p></li><li><span>故障：</span><p>进水、内屏碎、自动调节亮度失灵、屏幕出现报警信息</p></li><li class="last-li">李先生<a href="tel:15090909480">15090909480</a><small>总额:<b>￥505</b> </small></li></ol>');
            }
        });
    });

    $(".bottom-detail").find(".one-fixed").click(function(e){
        $(this).children("dl").toggle();
        $(this).siblings(".one-fixed").children("dl").hide()
        e.stopPropagation();
    });
    $(document).click(function(){
        $(".one-fixed").find("dl").hide();
    });

    service_li();
    function service_li(){
        var $textarea = $(".other-service").find(".textarea");
        var $text =  $(".other-service").find(".text");

        if($textarea.length == 0 || $text.length == 0) {
            return;
        }

        $text.bind("blur", bindOtherServiceEvent);
        $textarea.bind("blur", bindOtherServiceEvent);

        function bindOtherServiceEvent() {
            if($.trim($textarea.val()) != '' || $.trim($text.val()) != '' || $("[name='malfunction_check']:checked").length>0) {
                $("#confirmOrderSolution").removeClass("but-gray");
            }
        }

    }

    function LoginElement(){
        var username = $("#userName").val();
        password = $("#passWord").val();
        if(username =='' || username == null){
            $("#userName").focus().addClass("tips");
            return false;
        }
        if(password =='' || password == null){
            $("#passWord").focus().addClass("tips");
            return false;
        }
    }
    $(".login_box .text").focus(function(){
        $(this).addClass("border-text");
    }).blur(function(){
        $(this).removeClass("border-text");
    });
    /********页面效果调用***************/

    $(".model h4").clickElement();
    $(".hitch h4").clickElement();
    $(".hitch ul li").selectedElement();
    $(".peijian p").selectedElement(function($this){
        var totalPrice = parseInt($("#orderTotalPrice").attr('totalPrice'));
        if(totalPrice != -1) {
            $(".peijian").find(":checked").each(function(){
                var price = parseInt($(this).attr("price"));
                totalPrice += price;
            });
            $("#orderTotalPrice").html("￥"+totalPrice);
        }
    });
    $(".pjdiv span,.wxfs span").radioElement();
    $(".agreement span").radioElement();
    //$(".youhuquan .use_b").radioElement();
    $(".complaint_suggestion .radiobox span").radioElement();
    $(".Fombox .selectArea,.selectArea_lay li").tap();
    //$(".scroller li").selectArea();
    $("#getverify").click(function(){
        var $verify = $(this);

        if(this.value == '获取验证码' || this.value == '发送失败' || this.value == '获取短信验证码') {
            var mobile = $.trim($("#mobilePhone").val());
            var skey = $verify.attr("skey");
            if(/^[1]{1}\d{10}$/.test(mobile)) {
                $verify.attr("value", "正在发送");
                $.ajax({
                    url : "sendSmsIdenCode",
                    data:{
                        skey : skey,
                        mobile : mobile
                    },
                    dataType:"JSON",
                    type:"POST",
                    success : function(data){
                        if(status == 0) {
                            timedesc();
                        } else {
                            $verify.attr("value", "发送失败");
                        }
                    },
                    error : function(){
                        $verify.attr("value", "发送失败");
                    }
                });
            } else {
                $("#mobilePhone").focus();
                $("#mobilePhone").val('');
                $("#mobilePhone").addClass("tips");
            }
        }

    });
    $(".submitForm .next-button1").click(function(){
        VerifyElement(function(data){
            //加载维修中心
            var $selectArea = $(".selectArea");
            var cityId = $("[name='cityId']").val();
            $("#mailTipContent").remove();
            $("#serviceType").parent().hide();
            $("#doorDate").parent().hide();
            var vouCode=$.trim($("#vouCodeVal").val());

            /*var homeRepairCityId = $.trim($("#support_home_repair_city_id").val());
             var re = new RegExp("^("+cityId+")|(.*,"+cityId+",.*)|("+cityId+",.*)|(.*,"+cityId+")$");*/
            if(!isSupportDoor(cityId)) {
                $("#solutionMalFunction2").children(":first").before("<p id='mailTipContent' class='youji-tips sizing'>您所在的地区目前只提供邮寄维修服务，下单成功后您需要将手机快递到"+$(".jkx-center").text()+"进行维修</p>");
            } else {
                $("#serviceType").parent().show();
                var repairMethod = $.trim($("[name='repairMethod']:checked").val());
                if(repairMethod == 1) {
                    $("#serviceType").text("上门维修");
                    $("#doorDate").parent().show();
                    $("#doorDate").html($("#repairDate_hid").val());
                } else {
                    $("#serviceType").text("邮寄维修");
                }
            }
 
      
            var orderVouPrice = +($("#setting_order_vou_price_hid").val());
            var orderVouName=$("#setting_order_vou_name_hid").val();
            $("#solutionMalFunction2").find('.jikejuanOl').remove();
            var $orderTotal =  $("#solutionMalFunction2").find(".orderTotalP:last") ;
            $("#vou_code_hid").val('');
            var priceTotal = window.parseInt($orderTotal.attr("priceTotal"));

            if(vouCode != '') {
                $("#vou_code_hid").val(vouCode);
                $("#solutionMalFunction2").find('.malfunctionSol').after('<ol class="sizing jikejuanOl"><li><span>优惠：</span><p>'+data.orderVoucher.vouName+'(￥-'+data.orderVoucher.price+')</p></li></ol>');
                if(priceTotal == -1) {
                    $orderTotal.html("合计：<font>待检测后报价</font>");
                } else {
                	 var tol=priceTotal-data.orderVoucher.price;
                     if(tol<0)
                     {
                       var tol=0;
                     }
                    $orderTotal.html("合计：<font>￥"+(tol)+"</font>");
                }
            }  else {
                if(priceTotal == -1) {
                    $orderTotal.html("合计：<font>待检测后报价</font>");
                } else {
                    $orderTotal.html("合计：<font>￥"+priceTotal+"</font>");
                }
            }


            $("#contactName").text($.trim($("#userName").val()));
            $("#contactMobile").text($.trim($("#mobilePhone").val()));
            $("#contactSelArea").html($(".selectArea").html());
            $("#contactArea").html($.trim($("#Address").val()));


            $(".steps_one").hide();
            $(".steps_two").show();
        });
        $('body').animate({scrollTop:0},0);
    });

    $(".btn_arr1").click(function(){
        $(".steps_one").show();
        $(".steps_two").hide();
        $('body').animate({scrollTop:0},0);
    });

    $("#next_button_2").bind("click",next_button_2click);

    function next_button_2click(){
        if(!$(this).hasClass("but-gray")) {
        	$(this).attr("class","but-gray");
            $("#contactWay_form").submit();
            $(this).unbind("click"); 
        }
    }
    
    $(".login_box .but").click(function(){
        LoginElement();
    });
    //优惠券
    $(".youhuquan h6").click(function(){
        $(this).toggleClass("on");
        $(this).siblings(".use_yhq").slideToggle(300);
        $(".use_yhq").find(".txt").focus(function(){
            var top = $(".youhuquan").offset().top;
            $('body').animate({scrollTop:top},300);
        });
    });
});

var t = 60;
function timedesc(){
    btobj_pwd = document.getElementById("getverify");
    btobj_pwd.value = t+"秒后重新获取";
    btobj_pwd.className = "but_gray";
    if(t<=0)
    {
        btobj_pwd.value = "获取验证码";
        btobj_pwd.className = "sub";
        btobj_pwd.disabled=false;
        t=60;
        return;
    }
    else
    {
        btobj_pwd.disabled=true;
        setTimeout("timedesc()", 1000);
    }
    t = t - 1;
}

function scroll_fuc(){

    $(".load_img_").remove();
    var t=new TouchScroll({
        id:'wrapper',
        'width':5,
        'opacity':0.7,
        color:'#555',
        minLength:20
    });
    return t;
}

function scroll_fuc2(){
    var t=new TouchScroll({id:'wrapper2','width':5,'opacity':0.7,color:'#555',minLength:20});
    //var t2=new TouchScroll({id:'wrapper2','width':5,'opacity':0.7,color:'#555',minLength:20});
}

function timelay(){
    var t=new TouchScroll({id:'wra_time','width':5,'opacity':0.7,color:'#555',minLength:20});
}