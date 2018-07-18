/**
 * 2010-11-22，利用Jquery，实现跨浏览器、模拟下拉框
 * 1、在指定id容器位置，附加下拉框，譬如，一个有id的td或一个有id的div的html中，附加该模拟下拉控件；
 * 2、附加的模拟下拉控件应该在原有的控件不破坏容器原有的内容，仅仅在原有基础上附加；
 * 3、容器一般提供两个控件，显示id的控件、显示名称的控件，另外可能附加一个显示typeIdCode的控件；
 * 4、模拟下拉主要改变容器原始控件之间的数据显示，以及各个原始控件之间的相互影响；
 */
jQuery.extend({
	/**
	 * 模拟下拉函数
	 */
	simulateSelect:function(options){
		
		/**
		 * 给参数options赋值
		 */
		options = jQuery.extend({
			/**
			 * 模拟下拉框的定位对象，必须输入
			 */
			positObjId:"",
			/**
			 * 等待时提示图片
			 */
			waitImg:"../images/waiting.gif",
			/**
			 * 返回时对应的ID框
			 */
			srcInputId:"textId",
			/**
			 * 返回时对应的Name框
			 */
			srcInputName:"textName",
			/**
			 * 返回时对应的typeIdCode
			 */
			srcTypeIdCode:"textTypeIdCode",
			/**
			 * 当前下拉框的ID，如果存在多个，需要给予不同的ID编号
			 * 必须输入参数，如果没有的情况下，赋予缺省值simulate
			 */
			id:"simulate", 
			/**
			 * frame的ID
			 */
			frameId:"simulate_frame",
			/**
			 * 目标下拉框,缺省为图片路径
			 */
			desSelectUrl:"../images/waiting.gif",
			/**
			 * 下拉框的缺省宽度
			 */
			iWidth:"450px",
			/**
			 * 下拉框的缺省高度
			 */
			iHeight:"300px",
			/**
			 * 模拟下拉框的缺省值
			 */
			selectDefaultValue:"请选择",
			/**
			 * 模拟下拉框初始化石显示的已有的值
			 */
			initDefaultValue:"",
			/**
			 * 重置按钮的缺省值
			 */
			buttonDefaultValue:"重置",
			/**
			 * 扩展URL，让模拟下拉框能根据上一页面选中特定值显示特定附加URL
			 * 即，如果该参数有值的情况下，模拟下拉框的url会动态增加
			 */
			extendUrlSrcId:"",
			/**
			 * 缺省左边位置
			 */
			iLeft:"",
			/**
			 * 高度是否自适应
			 */
			isAdaptHeight:false,
			/**
			 * 是否可编辑(可编辑时，高度一定是自适应的)
			 */
			isEdit:false,
			/**
			 * 编辑框的缺省宽度
			 */
			editWidth:"100px",
			/**
			 * 前置插入还是后面追加(缺省为后置插入)
			 */
			perAppend:false
		}, options || {} );
		//end set options values
		
		/**
		 * 检测输入参数
		 */
		function checkInputParam(){
			//参数检测(options.id必须输入)
			if(options.id==""){
				alert("请输入id");
				return false;
			}
			if(options.positObjId==""){
				alert("请输入positObjId参数，以便下拉框定位");
				return false;
			}
			
			return true;
		};//end checkInputParam
		
		/**
		 * 构造模拟下拉框
		 */
		function createSimulateSelect(){
			options.frameId=options.id + "_frame";
		    if(options.initDefaultValue==""){
				options.initDefaultValue=options.selectDefaultValue;
		    }
			var htmlSrc=""; 
			htmlSrc +="<table class='simutab' id='table" + options.id.toString() + "' cellSpacing='0' cellPadding='0' border='0'>";
			htmlSrc +="	<tr>";
			htmlSrc +="		<td nowrap class='link_box'>";
			htmlSrc +="			<div class='link_head'>";
			htmlSrc +="				<table cellSpacing='0' cellPadding='0' border='0' style='height:20px;border-collapse: collapse;'>";
			htmlSrc +="					<tr>";
			htmlSrc +="						<td class='link_text' nowrap id='tdDropdrow" + options.id.toString() + "'>";
			if(options.isAdaptHeight){ //自适应高度
				if(options.isEdit){  //可编辑(用途不大)
					htmlSrc +="					<nobr><textarea id='lab" + options.id.toString() + "' style='border:0px;width:" + options.editWidth.toString() + ";overflow-y:hidden;height:25px;' onpropertychange='this.style.posHeight=this.scrollHeight' onchange='this.style.posHeight=this.scrollHeight' onfocus='this.style.posHeight=this.scrollHeight'></textarea></nobr>";
				}
				else{ //缺省不可编辑
					htmlSrc +="					<nobr><textarea id='lab" + options.id.toString() + "' readonly style='border:0px;width:" + options.editWidth.toString() + ";overflow-y:hidden;height:25px;' onpropertychange='this.style.posHeight=this.scrollHeight' onchange='this.style.posHeight=this.scrollHeight' onkeydown='this.style.posHeight=this.scrollHeight'></textarea></nobr>";
				}
			}
			else{
				htmlSrc +="						<nobr><label class='link_lab' id='lab" + options.id.toString() + "'></label></nobr>";
			}
			htmlSrc +="						</td>";
			htmlSrc +="						<td id='tdReset" + options.id.toString() + "' width='16px'";
			htmlSrc +="							class='link_arrow2' ";
			htmlSrc +="							onmouseup='this.className=\"link_arrow2\"'";
			htmlSrc +="							onmousedown='this.className=\"link_arrow3\"'";
			htmlSrc +="							onmouseout='this.className=\"link_arrow2\"'></td>";
			htmlSrc +="						<td id='tdDropdrow" + options.id.toString() + "' width='16px'";
			htmlSrc +="							class='link_arrow0'"; 
			htmlSrc +="							onmouseup='this.className=\"link_arrow0\"'";
			htmlSrc +="							onmousedown='this.className=\"link_arrow1\"'";
			htmlSrc +="							onmouseout='this.className=\"link_arrow0\"'></td>";
			htmlSrc +="					</tr>";
			htmlSrc +="				</table>";
			htmlSrc +="			</div>";
			htmlSrc +="			<div class='link_value' hiddenFlag='h' name='linkvalue' id='desUrl" + options.id.toString() + "' style='cursor:wait;display:;width:" + options.iWidth.toString() + ";height: " + options.iHeight.toString() + "'>";
			htmlSrc +="				<div id='mx' style='height:100%;overflow-x:hidden;overflow-y:hidden;'>";
			htmlSrc +="					<div class='link_record0' style='height:100%;overflow-x:hidden;overflow-y:hidden;'>";
			htmlSrc +="						<iframe name='simulateFrame' id='" + options.frameId.toString() + "'";
			htmlSrc +=" 						width='100%' height='100%' frameBorder='0' scrolling='no' style='margin:0 0;border:0px solid red;padding:0px;z-index:10000;'"; 
			htmlSrc +="							src='" + options.waitImg.toString() + "'></iframe>";
			htmlSrc +="					</div>";
			htmlSrc +="				</div>";
			htmlSrc +="			</div>";
			htmlSrc +="		</td>";
			htmlSrc +="	</tr>";
			htmlSrc +="</table>";
			
			//附加相应的下拉框
			jQuery("#" + options.positObjId.toString()).append(htmlSrc);
			
			//前置插入
			if(options.perAppend){
				$("#table" + options.id.toString() ).prependTo("#" + options.positObjId.toString() );
			}
			
			//定位(20110605没有完成)
			if( options.iLeft!=""){
				$("#table" + options.id.toString() )[0].style.left=options.iLeft;
			}
		
		}; //end createSimulateSelect
		
		/**
		 * 给HTML控件，即，模拟下拉框中的控件赋予初始值
		 */
		function initHtmlControlValues(){
			//从srcInputName中取值显示在模拟下拉框的文本框中
			//如果没有值，则用“请选择”
			var srcNameText=jQuery("#" + options.srcInputName.toString()).val(); 
			if(srcNameText==""){
				jQuery("#lab" + options.id.toString()).html( options.selectDefaultValue.toString() ); 
			}
			else{
				jQuery("#lab" + options.id.toString()).html( srcNameText );
			}
		}; //end initHtmlControlValues
		
		/**
		 * 给模拟下拉框中自身的按钮附加事件
		 */
		function setEventForSimaluteObject(){
			//1:给删除按钮附加事件，完成如下功能
			//  1.1：原始输入框中的id、name或typeIdCode等控件中的值均为空
			//	1.2：模拟下拉框中的值恢复成原始状态
			jQuery("#tdReset" + options.id.toString()).bind("click",function(){
				if(options.srcInputId.toString()!=""){
					jQuery("#" + options.srcInputId.toString()).val("");
				}
				if(options.srcInputName.toString()!=""){
					jQuery("#" + options.srcInputName.toString()).val("");
				}
				if(options.srcTypeIdCode.toString()!=""){
					jQuery("#" + options.srcTypeIdCode.toString()).val("");
				}
				//给模拟下拉框中的现实文本恢复原始值(即，“请选择”)
				jQuery("#lab" + options.id.toString()).html( options.selectDefaultValue.toString() ); 
			});
			
			//2:给id='tdDropdrow" + options.id.toString() + "' 模式的控件附加展示模拟下拉框的功能
			//单击时展示/折叠模拟下拉框
			jQuery("td[id='tdDropdrow" + options.id.toString() + "']" ).each(function(){
				jQuery(this).bind("click",function(){
					var hiddenFlag=jQuery("#desUrl" + options.id.toString()).attr("hiddenFlag"); //是否隐藏标志
					if(hiddenFlag=="v"){
						jQuery("#desUrl" + options.id.toString()).css({visibility: "hidden"}); //隐藏
						jQuery("#desUrl" + options.id.toString()).attr("hiddenFlag","h"); //设置隐藏/显示开关
						jQuery("#desUrl" + options.id.toString()).hide();
						return false;
					}
					else{
						$(document).click();  //当多个模拟下拉框时，隐藏其它模拟下拉框
						jQuery("#desUrl" + options.id.toString()).css({visibility: "visible"});
						jQuery("#desUrl" + options.id.toString()).attr("hiddenFlag","v"); //设置隐藏/显示开关
						jQuery("#desUrl" + options.id.toString()).show();
					}
					
					//desInputName为附加的额外的值，以便除IE浏览器外的赋值给模拟下拉框
					if(options.extendUrlSrcId.toString()!=""){
						jQuery("#" + options.frameId.toString() ).attr('src'
							,options.desSelectUrl.toString() + jQuery("#" + options.extendUrlSrcId.toString() ).val()
							 + "&desInputName=" + options.id.toString() + "&d=" + Math.random() ); //附加动态参数
					}
					else{
						jQuery("#" + options.frameId.toString() ).attr('src'
							,options.desSelectUrl.toString()
							 + "&desInputName=" + options.id.toString() + "&d=" + Math.random()  );
					}
					return false;
				});
			});
			
			//3:给document附加click事件，即，任何时候点击其它部位，均隐藏该下拉模拟显示
			jQuery(document).bind("click",function(){
				jQuery("#desUrl" + options.id.toString()).css({visibility: "hidden"});
				jQuery("#desUrl" + options.id.toString()).attr("hiddenFlag","h"); //设置隐藏
				jQuery("#desUrl" + options.id.toString()).hide();
			});
		}; //end setEventForSimaluteObject
		
		if( !checkInputParam() ){ 
			return;
		};
		
		createSimulateSelect();
		initHtmlControlValues();
		setEventForSimaluteObject();
		
		return options;
	}
});