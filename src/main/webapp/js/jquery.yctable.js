/**
 * 2010.11.10，扩展为Jquery插件写法,在引用该js之前，必须引用Jquery库
 */
jQuery.extend({
	/**
	 * 设置指定id的table行颜色交替，点击、鼠标移动过程中的颜色变换\
	 * @argument tableId,需要设置行列选择样式的table的Id
	 * 如果有动态参数，那么，第2个参数为数字，设定开始进行颜色变换的行，一般为第一行
	 * 如果和固定表的行、列一起使用，则第2个参数为固定表头的数值+1
	 */
	tableRowSelect:function(tableId){
		var sBgC="#FFEEDD";  //选中(单击)色调
		var tBgCs="#F9F9F9"; //"#F0EEEE"; //间隔色调(奇数行,从0开始)--适应bootstrap,缺省均空白
		var tBgCd="#FFFFFF"; //间隔色调(偶数行,从0开始)
		var mBgC="#d0e9c6";  //"#DDEEFF";  //移动色调
		var startRow=0;  //开始着色的行数，从1开始，缺省可以从0开始arguments[1]
		
		var tabObj=jQuery("#" + tableId); //get tabele object
		
		//设置着色开始位置(行选)
		if(arguments.length>=2){
			startRow=arguments[1]*1-1; 
		}
		
		//1:给tr赋予初始颜色
		function initRowBackgroundColor(){
			jQuery(tabObj).find("tr").each(function(iRows){
				if( iRows>=startRow ){
					if( ( (iRows-startRow) % 2)==0 ){
						jQuery(this).css({background:tBgCd}); //偶数行初始颜色
						jQuery(this).attr("srcBg",tBgCd); //存储原始颜色(附加缺省属性)
						jQuery(this).attr("clickBg",""); //存储点击后颜色(附加缺省属性)
					}
					else{
						jQuery(this).css({background:tBgCs}); //奇数数行初始颜色
						jQuery(this).attr("srcBg",tBgCs); //存储原始颜色(附加缺省属性)
						jQuery(this).attr("clickBg",""); //存储点击后颜色(附加缺省属性)
					}
				}
			});
		};
		
		initRowBackgroundColor();
		
		//2:给每行均绑定事件
		//2.1:鼠标移入时，统一变成移动颜色
		jQuery(tabObj).find("tr").each(function(iRows){
			if( iRows>=startRow ){
				jQuery(this).bind("mouseover",function(){
					jQuery(this).css({background:mBgC});
				});
			}
		});
		
		//2.2:鼠标移出时，根据当前行是否选中，决定恢复后的背景色
		jQuery(tabObj).find("tr").each(function(iRows){
			if( iRows>=startRow ){
				jQuery(this).bind("mouseout",function(){
					var clickBg=jQuery(this).attr("clickBg");
					if(clickBg!=""){
						jQuery(this).css({background:clickBg});
					}
					else{
						var srcBg=jQuery(this).attr("srcBg"); //get src background
						jQuery(this).css({background:srcBg}); //恢复点击之前的颜色
					}
				});
			}
		});
		
		//2.3:鼠标点击后的颜色变换
		// a:初始化行列颜色
		// b:设置当前行颜色为点击后颜色
		// c:设置当前行点击颜色标志，以便鼠标移出后恢复选中颜色
		jQuery(tabObj).find("tr").each(function(iRows){
			if( iRows>=startRow ){
				jQuery(this).bind("click",function(){
					initRowBackgroundColor();
					jQuery(this).css({background:sBgC});
					jQuery(this).attr("clickBg",sBgC); //set src background
				});
			}
		});
	},/*end tableRowSelect*/
	
	/**
	 * 设置相应的表格行、列固定
	 * tableId:需要固定行、列的table Id
	 * rowNum:固定的行数
	 * colNum:固定的列数
	 * scrollHeight:表格的整体高度，即超过这个高度时，出现滚动条
	 * scrollWidth:表格的整体宽度，即，超出这个宽度时，出现滚动条，一般为100%
	 */
	tableFixedHead:function(tableId,rowNum,colNum,scrollHeight,scrollWidth){
		var tabObj=jQuery("#" + tableId); //get tabele object
		
		jQuery(tabObj).wrap("<div id='div" + tableId + "' class='scrollDiv'></div>"); //给table添加div容器，以便进行滚动
		jQuery("#div" + tableId).css({
			height:scrollHeight
			,clear: "both"
			,border: "1px solid #EEEEEE"
			,OVERFLOW:"scroll"
			,width:scrollWidth 
		});
		
		//测试滚动条相关的原始值
		//var nScrollHight = 0; //滚动距离总长(不是滚动条的长度)
        var nScrollTop = 0;   //滚动到的当前Top位置
        var nScrollLeft=0;    //滚动到的当前Left位置
		//var nDivHight = $("#div" + tableId).height(); 
		
		jQuery(tabObj).find("tr").each( function(rowIndex){
			if(rowIndex<rowNum){ 
				jQuery(this).attr("className","scrollColThead"); //固定行头
				
				jQuery(this).find("td").each( function(colIndex){
					if(colIndex<colNum){
						jQuery(this).attr("className","scrollRowThead scrollCR");  //固定行、列交界部位
					}
				});
			}
			else{
				jQuery(this).find("td").each( function(colIndex){
					if(colIndex<colNum){
						jQuery(this).attr("className","scrollRowThead");  //固定列头
					}
				});
			}
		});
		
		/**
		 * 当包含table的div进行滚动时，动态设定表格行、列的定位信息
		 */
		jQuery("#div" + tableId).bind("scroll",function(e){
			//var nTempScrollHight = $(this)[0].scrollHeight;
			var nTempScrollTop = $(this)[0].scrollTop;
			var nTempScrollLeft= $(this)[0].scrollLeft;
			var pixSens=0; //像素敏感度
			
			//垂直滚动超过10个像素才定位
			if(nTempScrollTop>(nScrollTop+pixSens) || nTempScrollTop<(nScrollTop-pixSens) ){
				jQuery(".scrollColThead").each( function(rowIndex) {
					jQuery(this).css( {top:jQuery(this)[0].parentElement.parentElement.parentElement.scrollTop}); //给对应的行设定为固定头(动态定位)
				});
				nScrollTop=nTempScrollTop;
			}
			
			//水平滚动超过10个像素才定位
			if(nTempScrollLeft>(nScrollLeft+pixSens) || nTempScrollLeft<(nScrollLeft-pixSens)){
				jQuery(".scrollRowThead").each( function(rowIndex) {
					jQuery(this).css( {left:jQuery(this)[0].parentElement.parentElement.parentElement.parentElement.scrollLeft}); //固定列
				});
				nScrollLeft=nTempScrollLeft;
			}
		});
	}, /*end tableFixedHead*/
	
	/**
	  * 设置页面的列表table的翻页、查询、排序等功能；
	  * 和前台页面结合比较紧密，需要有各式如foottoolbar.jsp(翻页按钮/页码输入框/刷新等)、需要有main.css来设置页面的样式
	  * @param formId,通过刷新按钮等整体刷新需要的表单FORM的id
	  * @param iCurrPageNumber,table列表表格的当前页码
	  * @param iPageCount,总页码
	  */
	 tableRefersh:function(formId,iCurrPageNumber,iPageCount){
	 	//1:根据当前页码/总页数之间的关系，设置翻页按钮是否可用以及相应的样式
	 	if(jQuery("#currPage").val()==""){
	 		jQuery("#currPage").val("1");
	 	}
		if(jQuery("#currPage").val() =="1" || jQuery("#currPage").val()=="0"){
			jQuery("#ButFirst").attr("disabled",true);
			jQuery("#ButFirst").addClass("pageNav firstPageD");
			jQuery("#ButPreview").attr("disabled",true);
			jQuery("#ButPreview").addClass("pageNav prevPageD");
		}
		if(jQuery("#pageCount").val()=="1" || jQuery("#pageCount").val()==""){
			jQuery("#currPage").attr("disabled",true);
			jQuery("#ButGoPage").attr("disabled",true);
			jQuery("#ButGoPage").addClass("pageNav jumpPageD");
		
			jQuery("#ButFirst").attr("disabled",true);
			jQuery("#ButFirst").addClass("pageNav firstPageD");
			jQuery("#ButPreview").attr("disabled",true);
			jQuery("#ButPreview").addClass("pageNav prevPageD");
			jQuery("#ButNext").attr("disabled",true);
			jQuery("#ButNext").addClass("pageNav nextPageD");
			jQuery("#ButLast").attr("disabled",true);
			jQuery("#ButLast").addClass("pageNav lastPageD");
		}
		if(jQuery("#pageCount").val()== jQuery("#currPage").val() ){
			jQuery("#ButNext").attr("disabled",true);
			jQuery("#ButNext").addClass("pageNav nextPageD");
			jQuery("#ButLast").attr("disabled",true);
			jQuery("#ButLast").addClass("pageNav lastPageD");	 
		}
		
		//2:设置表头的排序字段(如果表头字段不带s_标识，则需要修改4.1以及本地标识)
		try{
			var sortTitle=jQuery("#sortTitle").val(); //20140925多列排序
			var sortTitleArray=sortTitle.split(",");
			
			if(jQuery("#sortFlag").val().toUpperCase()=="DESC" ){
				//jQuery("#s_" + jQuery("#sortTitle").val() ).html( jQuery("#s_" + jQuery("#sortTitle").val() ).html() + "▼" );
				for(var i=0;i<sortTitleArray.length;i++){
					jQuery("#s_" + sortTitleArray[i] ).html( jQuery("#s_" + sortTitleArray[i] ).html() + "▼" );
				}
			}
			else if(jQuery("#sortFlag").val().toUpperCase()=="ASC"){
				//jQuery("#s_" + jQuery("#sortTitle").val() ).html( jQuery("#s_" + jQuery("#sortTitle").val() ).html() + "▲" );
				for(var i=0;i<sortTitleArray.length;i++){
					jQuery("#s_" + sortTitleArray[i] ).html( jQuery("#s_" + sortTitleArray[i] ).html() + "▲" );
				}
			}
		}catch(ex){}
		
		//3:设置等待div的大小，以便刷新/翻页等动作时遮盖住主窗口
		jQuery("#imgWait").height( $(window).height()-1 );
		jQuery("#imgWait").width( $(window).width()-1 );
		
		//4:给foottoolbar.jsp中的特定按钮绑定事件
		jQuery("#ButFirst").removeAttr("onclick"); //删除foottoolbar.jsp中的缺省onclick属性(通过改造foottoolbar.jsp，从源头上屏蔽onclick函数)
		jQuery("#ButFirst").bind("click",function(){
			turnPage("First");
			return false; //取消默认的行为并阻止事件起泡
		});
		jQuery("#ButPreview").removeAttr("onclick"); 
		jQuery("#ButPreview").bind("click",function(){
			turnPage("Preview");
			return false;
		});
		jQuery("#ButNext").removeAttr("onclick"); 
		jQuery("#ButNext").bind("click",function(){
			turnPage("Next");
			return false;
		});
		jQuery("#ButLast").removeAttr("onclick"); 
		jQuery("#ButLast").bind("click",function(){
			turnPage("Last");
			return false;
		});
		jQuery("#ButGoPage").removeAttr("onclick"); 
		jQuery("#ButGoPage").bind("click",function(){
			navigatePage();
			return false;
		});
		jQuery("#pageSize").removeAttr("onchange");  //页码下拉框
		jQuery("#pageSize").bind("change",function(){
			navigatePage();
			return false;
		});
		jQuery("#butRefersh").removeAttr("onclick"); 
		jQuery("#butRefersh").bind("click",function(){
			navigatePage();
			return false;
		});
		
		//20140930增加，在IE下，表单提交过程中显示动画
		jQuery("#" + formId).bind("submit",function(){
			jQuery("#imgWait").css({display:""});
			var imgWaitSrc=jQuery("#imgWait img").attr("src");
			setTimeout( function(){ jQuery("#imgWait img").attr("src",imgWaitSrc);},10); 
			return true;
		});
		
		//4.1:给所有表头的排序列做一定的处理(removeAttr、通过id获得排序字段名等，均可以通过修改jsp代码避免)
		jQuery(".sortTitle").each(function(){
			jQuery(this).removeAttr("onclick"); 
			jQuery(this).bind("click",function(){
				var strColId=jQuery(this).attr("id") ; //id值，从中分离出需要的排序字段名称
				var sortFieldName=strColId.replace( new RegExp("^s_","gi"),""); //分离出排序字段的名字(只匹配以s_开始的id字符串)
				sortTitleCmd( sortFieldName );
				return false;
			});
		});
		
		//5:通用处理事件
		//5.1:翻页。tmpCmd标志翻页方向
		function turnPage(tmpCmd){
			if( isNaN(jQuery("#currPage").val() )){
				alert("页码字段请输入数字！");
				jQuery("#currPage").focus();
				return false;
			}
			switch(tmpCmd){
				case "First":	//第一页
					jQuery("#currPage").val("1");
					break;
				case "Preview":  //上一页
					jQuery("#currPage").val( iCurrPageNumber*1-1 );
					break;
				case "Next":   //下一页
					jQuery("#currPage").val( iCurrPageNumber*1+1 );
					break;
				case "Last":	//最后一页
					jQuery("#currPage").val( iPageCount );
					break;
				default:
					break;
			}
			
			//显示动画，且向服务器提交
			//$("#imgWait").css({display:""});
			//$("#" + formId).submit();
			navigatePage();
		}; /*end function turnPage*/
		
		//5.2:导航到指定页码(需要刷新时，统一调用该函数，避免页码输入不合适的数值)
		function navigatePage(){
			if(isNaN(jQuery("#currPage").val())){
				alert("页码字段请输入数字！");
				jQuery("#currPage").val("1");
				jQuery("#currPage").focus();
				return false;
			}
			if( (jQuery("#currPage").val() * 1 ) >(jQuery("#pageCount").val() * 1) ){
				alert("不能大于最大页数" + jQuery("#pageCount").val() + "!");
				jQuery("#currPage").val( jQuery("#pageCount").val() );
				jQuery("#currPage").focus();
				return false;
			}
			if ( (jQuery("#currPage").val() * 1 ) <0 ){
				alert("页码必须大于1!");
				jQuery("#currPage").val("1");
				jQuery("#currPage").focus();
				return false;
			}
			
			//显示动画，且向服务器提交
			jQuery("#imgWait").css({display:""});
			
			jQuery("#" + formId).submit();
		};/*end function navigatePage*/
		
		//5.3:排序
		function sortTitleCmd(sortField){
			if(jQuery("#sortFlag").val()==""){
				jQuery("#sortFlag").val("DESC");
			}
			else if(jQuery("#sortFlag").val().toUpperCase()=="DESC"){
				jQuery("#sortFlag").val("ASC");
			}
			else if(jQuery("#sortFlag").val().toUpperCase()=="ASC"){
				jQuery("#sortFlag").val("DESC");
			}
			
			//当前需要排序列作为新排序列
			jQuery("#sortTitle").val(sortField);  
			navigatePage();
		};/*end function sortTitleCmd*/
		
	}, /*end tableRefersh*/
	
	/**
	 * 扩展表单刷新功能，方便外部需要刷新form的按钮/事件调用该函数
	 */
	navigatePage:function(formId){
		if(isNaN(jQuery("#currPage").val())){
			alert("页码字段请输入数字！");
			jQuery("#currPage").val("1");
			jQuery("#currPage").focus();
			return false;
		}
		if( (jQuery("#currPage").val() * 1 ) >(jQuery("#pageCount").val() * 1) ){
			alert("不能大于最大页数" + jQuery("#pageCount").val() + "!");
			jQuery("#currPage").val( jQuery("#pageCount").val() );
			jQuery("#currPage").focus();
			return false;
		}
		if ( (jQuery("#currPage").val() * 1 ) <0 ){
			alert("页码必须大于1!");
			jQuery("#currPage").val("1");
			jQuery("#currPage").focus();
			return false;
		}
		
		//显示动画，且向服务器提交
		jQuery("#imgWait").css({display:""});
		jQuery("#" + formId).submit();
	}/*end navigatePage*/
	
});