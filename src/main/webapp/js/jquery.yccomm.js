/**
 * 常用的jQuery函数扩展
 */
 jQuery.extend({
	/**
	 * 获取网页客户端高度
	 */
	getDocHeight:function(){
		var D = document;
		return Math.max(
			Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
			Math.max(D.body.offsetHeight, D.documentElement.offsetHeight), 
			Math.max(D.body.clientHeight, D.documentElement.clientHeight)
		);
	},//end getDocHeight
	
	/**
	 * 获取网页客户端宽度
	 */
	getDocWidth:function(){
		var D = document;
		return Math.max(
			Math.max(D.body.scrollWidth, D.documentElement.scrollWidth),
			Math.max(D.body.offsetWidth, D.documentElement.offsetWidth), 
			Math.max(D.body.clientWidth, D.documentElement.clientWidth)
		);
	},//end getDocWidth
	
	/**
	 * 给Block布局对象添加3D阴影
	 * srcObjId:需要添加阴影对象的ID
	 * leftOffset:横向阴影宽度，单位px
	 * topOffset:纵向阴影宽度，单位px
	 * shadowBgColor:阴影颜色
	 */
	appendShadow:function(srcObjId,leftOffset,topOffset,shadowBgColor){
		var srcObj=$("#" + srcObjId);
		var offset = srcObj.offset();
		
		var desObjId=srcObj.attr("id") + "_shadow";
		var shadowHtml="<div id='" + desObjId + "' style='z-index:-1;position : absolute;'></div>" ;
			
		$("BODY").append( shadowHtml );
		
		shadowObj=$("#" + desObjId);
		shadowObj.css({"background-color":shadowBgColor});
		shadowObj.css({"border-bottom":"1px solid " + shadowBgColor});
		shadowObj.css({"border-right":"1px solid " + shadowBgColor});
		shadowObj.width( srcObj.width() );
		shadowObj.height( srcObj.height() );
		shadowObj.offset({ top: (offset.top+topOffset), left: (offset.left+leftOffset) });
	}
});

function document_onkeydown(e){
	var pressedKey;
  	var e= e ? e : window.event;
  	if (document.all){
  		pressedKey = e.keyCode;
  	}
  	else{
		pressedKey = e.which;
	}
	
	try{
		//IE
		if( (pressedKey==13) && 
			e.srcElement.type!='button' && 
			e.srcElement.type!='submit' && 
			e.srcElement.type!='reset' && 
			e.srcElement.type!='' &&
			e.srcElement.type!='textarea' &&
			e.srcElement.type!='file'
		){
			e.keyCode=9;
		}
	}
	catch(ex){
		//FF
		if(pressedKey==13 && 
			e.target.type!='button' && 
			e.target.type!='submit' && 
			e.target.type!='reset' && 
			e.target.type!='' &&
			e.target.type!='textarea' &&
			e.target.type!='file'
		){
			document.keyCode=9;
		}
	}
}

//整数 乘以 小数
function divide(intParam,decimalParam){
	var desParam=decimalParam+"";
	var pos=desParam.indexOf(".");
	if(pos==-1){
		return intParam*decimalParam * 1;
	}
	else{
		var matRet=intParam * desParam.substr(0,pos);  //整数部分相乘
		var residue=desParam.substr(pos+1);
		if(residue!="") { 
		    //余数部分额外处理
			var resLen=residue.length;
			matRet=matRet+ intParam* residue/Math.pow(10,resLen);
		}
		return matRet;
	}
}

//小数相加
//1、整数部分相加
//2、判断小数位的长度，并把长度短的补0
//3、小数部分相加，同时把整数部分乘以10（小数位数的幂）
//4、还原
function addDecimal(srcDecParam,desDecParam){
	var srcParam=srcDecParam+"";
	var desParam=desDecParam+"";
	var srcPos=srcParam.indexOf(".");
	var desPos=desParam.indexOf(".");
	if(srcPos==-1 || desPos==-1){
		return srcDecParam*1 + desDecParam*1; //有一个为整数，直接相加
	}
	else{
		var retValue=srcParam.substr(0,srcPos)*1+desParam.substr(0,desPos)*1; //整数部分相加
		var residueSrc=srcParam.substr(srcPos+1);
		var residueDes=desParam.substr(desPos+1);
		if(residueSrc=="" || residueDes==""){
			return srcDecParam + desDecParam; //有小数点，但没有小数值
		}
		else{
			//均有小数点，且均有小数位(判断谁的小数位长，以小数位长的作为整数乘的比较标准)
			var resLen=0;
			var srcLen=residueSrc.length;
			var desLen=residueDes.length;
			if(srcLen>=desLen){
				resLen=srcLen;
				residueDes=residueDes*1*Math.pow(10,srcLen-desLen); //把较短的小数位放长
			}
			else{
				resLen=desLen;
				residueSrc=residueSrc*1*Math.pow(10,desLen-srcLen); //把较短的小数位放长
			}
			
			retValue=(retValue*Math.pow(10,resLen)+residueSrc*1+residueDes*1)/Math.pow(10,resLen);
			return retValue;
		}
	}
}

//数字金额转换为中文
var DX = function (num) {
	var strOutput = "";
	var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
	num += "00";
	var intPos = num.indexOf('.');
	if (intPos >= 0){
		num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
	}
	strUnit = strUnit.substr(strUnit.length - num.length);
	for (var i=0; i < num.length; i++){
		strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i,1),1) + strUnit.substr(i,1);
	}
    return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
};

$().ready(function(){
    //点击任意地方，均隐藏顶级菜单
	$(document).bind("click",function(){
		try
		{
			top.menuMainBar.hideSubMenus();
			top.menuMainBar.menuBarState=false;
		}
		catch(ex){}
	});
	
	//键盘操作时支持回车跳转控件(不通用)
	$(document).bind("keydown",function(e){
		return document_onkeydown();
	});
});