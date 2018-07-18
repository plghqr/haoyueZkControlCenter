/**
 * 2007-12-23 Simple JavaScript For (Ajax) Minute Code
 *    图片切换，展示下一个节点内容(通过Ajax，获取相应的数据)
 * 2010-11-15 所有取值的方法均修改为jquery
 */
/**
 * E function will expand tree node
 */
function E(obj)
{
	var url =nodeUrl;
	var pars ='';
	var myAjax;
	var desObjID="N" + jQuery(obj).attr("N");
	var desObj=jQuery("#" + desObjID);
	
	switch(jQuery(obj).attr("Ex"))
	{
		case "P":
			jQuery(obj).attr("Ex","M");
			jQuery(obj).attr("src","../im/m.gif");
			jQuery(desObj).css({display:""});
			break;
		case "Fp":
			jQuery(obj).attr("Ex","Fm");
			jQuery(obj).attr("src","../im/fm.gif");
			jQuery(desObj).css({display:""});
			break;
		case "Lp":
			jQuery(obj).attr("Ex","Lm");
			jQuery(obj).attr("src","../im/lm.gif");
			jQuery(desObj).css({display:""});
			break;
		case "Rp":
			jQuery(obj).attr("Ex","Rm");
			jQuery(obj).attr("src","../im/rm.gif");
			jQuery(desObj).css({display:""});
			break;
		case "Tp":
			jQuery(obj).attr("Ex","Tm");
			jQuery(obj).attr("src","../im/tm.gif");
			jQuery(desObj).css({display:""});
			break;
		case "M":
			jQuery(obj).attr("Ex","P");
			jQuery(obj).attr("src","../im/p.gif");
			jQuery(desObj).css({display:"none"});
			break;
		case "Fm":
			jQuery(obj).attr("Ex","Fp");
			jQuery(obj).attr("src","../im/fp.gif");
			jQuery(desObj).css({display:"none"});
			break;
		case "Lm":
			jQuery(obj).attr("Ex","Lp");
			jQuery(obj).attr("src","../im/lp.gif");
			jQuery(desObj).css({display:"none"});
			break;
		case "Rm":
			jQuery(obj).attr("Ex","Rp");
			jQuery(obj).attr("src","../im/rp.gif");
			jQuery(desObj).css({display:"none"});
			break;
		case "Tm":
			jQuery(obj).attr("Ex","Tp");
			jQuery(obj).attr("src","../im/tp.gif");
			jQuery(desObj).css({display:"none"});
			break;
		default:
			break
	}
	
	//Ajax调用(为了让选中和展开成立，Ajax必须是同步的)
	if( jQuery(desObj).attr("A")=="0"){
		var imgSrcUrl=jQuery(obj).attr("src");
		jQuery(obj).attr("src","../im/wait.gif"); //等待标志(也可以先调用等待标志，当加载完成后，再进行图标的切换)
		var pars={};
		pars["d"]=new Date();
		jQuery.ajax({
			type:"GET"
			,url:nodeUrl + jQuery(obj).attr("N")
			,data:pars
			,async: true 	//true取后台数据过程中有动画效果，但是选中缺省值无效;false可以选中缺省值 
			,success:function(m){
				jQuery("#" + desObjID ).html(m);  //从服务器端返回数据
			}
			,complete:function(){
				jQuery(obj).attr("src",imgSrcUrl);
			}
		});
		jQuery("#" + desObjID).attr("A","1"); //设置已经通过Ajax获取过数据，多次展开/折叠过程中不再重复取数据
	}
}

var oldSelectNode=null;
var oldSelectID="";
	
/**
 * 切换文本字体(把选中的文本变粗、变蓝颜色，而其它已经变粗的改变为原始状态)
 */
function C(obj,strNodeID){
	var tmpSrc;
	if(oldSelectID!="" ){
		tmpSrc=jQuery(oldSelectNode).attr("src");
		jQuery(oldSelectNode).attr("src",jQuery(oldSelectNode).attr("S"));
		jQuery(oldSelectNode).attr("S",tmpSrc);
		
		jQuery("#sT" + oldSelectID).css("color","");
		jQuery("#sT" + oldSelectID).css("fontWeight","normal");
	}
	jQuery("#sT" + strNodeID).css("color","blue");
	jQuery("#sT" + strNodeID).css("fontWeight","bold");
	tmpSrc=jQuery(obj).attr("src");
	jQuery(obj).attr("src",jQuery(obj).attr("S") );
	jQuery(obj).attr("s",tmpSrc );

	oldSelectNode=obj;
	oldSelectID=strNodeID;
}