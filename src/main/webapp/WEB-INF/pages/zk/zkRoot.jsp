<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/includetld.jsp"%>
<!DOCTYPE HTML>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta http-equiv="x-ua-compatible" content="IE=edge, chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1,user-scalable=no" />
	<%@ include file="/common/includejscss.jsp"%>
	<link type="text/css" rel="stylesheet" href="<c:url value='/css/ztree/zTreeStyle.css?v=20180719001'/>">
	<script type="text/javascript" src="<c:url value='/js/ztree/jquery.ztree.core-3.2.js?v=20180719001'/>" ></script>
	<script type="text/javascript" src="<c:url value='/js/ztree/jquery.ztree.excheck-3.2.js?v=20180719001'/>" ></script>
	<title>Zookeeper树</title>
	<style type="text/css">
		.content{
			padding-top:2px;
		}
		.treeNagive{
			padding-left:2px;
		}
		.treeNagive .panel .panel-body{
			padding-top:2px;
			padding-left:5px;
			padding-right:5px;
			padding-bottom:5px;
			overflow:auto;
		}
		.treeNagive .ztree{
			overflow:auto;
			font-size:16px;
		}
		.nodePanel{
			padding:0px;
			padding-right:0px;
		}
		.nodePanel .panel-body{
			padding:0px;
		}
		.nodePanel .panel-body .nodeInfoPenel{
			padding:0px;
			border-right:1px solid #c0c0c0;
		}
		.nodePanel .panel-body .nodeInfoFooter{
			margin-top:-10px;
			margin-bottom:10px;
		}
		.nodePanel .panel-body .table-bordered{
			border-left:0px solid red;
			border-right:0px solid red;
		}
		.nodeAttrTab .ctd{
			text-align:center;
			vertical-align:middle;
			font-weight:bold;
			border-left:0px solid red;
		}
		.nodeAttrTab .ltd,.nodeAttrTab .ltdc{
			text-align:left;
			vertical-align:middle;
			padding-left:15px;
			border-right:0px solid red;
		}
		.nodeAttrTab .ltdc{
			padding-left:4px;
		}
		.navbar-fixed-top{
			position:absolute; 
		}
	</style>
	<script type="text/javascript">
		var zTreeObj,
		setting = {
			view: {
				selectedMulti: false,
				showIcon: true,
				nameIsHTML:true
			},
			callback:{
				onExpand: zTreeOnExpand,
				onClick: zTreeOnClick
			}
		},
		zTreeNodes = ${nodeInfo};
		
		$(function(){
			$("#imgWait").css({height:$(document).height()});
			$("#imgWait").css({width:$(document).width()});
			
			$("#ztreeBody").css({height:$(document).height()-30});
			
			zTreeObj = $.fn.zTree.init($("#tree"), setting, zTreeNodes);
			
			$("#btnCreateNode").on("click",function(){
				return createChildNode();
			});
			
			$("#btnDelNode").on("click",function(){
				return deleteNodes();
			});
			
			$("#btnSetNodeData").on("click",function(){
				return setNodeData();
			});
		});
		
		/**
		* 展开时加载子节点
		*/
		function zTreeOnExpand(event, treeId, treeNode){
			if (!treeNode.isParent) return;
			var s = treeNode.children;
			if (s != undefined)
				return;
			
			var postData={};
			postData["nodePath"]=treeNode.fullPath;
			$.ajax({
				url: "<c:url value='/zk/getChildNodes.do'/>?d=" + Math.random(),
				type: 'post',
				data: postData,
				success: function (jsonObj) {
					if(jsonObj.success){
						zTreeObj.addNodes(treeNode,jsonObj.data);
					}
				}
			});
		}
		
		/**
		*  转换日期为yyyy-MM-dd HH:mm:ss格式
		*/
		function converDate(time){
			var currDate=new Date(time);
			
			var y=currDate.getFullYear();
			var mo=currDate.getMonth();
			var d=currDate.getDate();
			var h=currDate.getHours();
			var mm=currDate.getMinutes();
			var s=currDate.getSeconds();
			
			mo+=1;
			if(mo<10) mo="0" + mo;
			if(d<10) d="0" + d;
			if(h<10) h="0" + h;
			if(mm<10) mm="0" + mm;
			if(s<10) s="0"+s;
			return y + "-" + mo + "-" + d + " " + h + ":" + mm + ":" + s;
			
			//return currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate() 
			//	+ " " + currDate.getHours() + ":" + currDate.getMinutes() + ":" + currDate.getSeconds();
			//return new Date(time).toLocaleString()
		}
		
		var currNodePath="";  //当前选中节点全路径
		/**
		* 点击节点后获取节点属性
		*/
		function zTreeOnClick(event, treeId, treeNode){
			var postData={};
			postData["nodePath"]=treeNode.fullPath;
			$.ajax({
				url: "<c:url value='/zk/getNodeInfo.do'/>?d=" + Math.random(),
				type: 'post',
				data: postData,
				success: function (jsonObj) {
					if(jsonObj.success){
						$("#tdPath").html( jsonObj.nodePath );
						$("#nodeData").val( jsonObj.nodeData );
						
						$("#tdCzxid").html( jsonObj.nodeStat.czxid);
						if(jsonObj.nodeStat.ctime!="" && jsonObj.nodeStat.ctime!=0){
							$("#tdCtime").html( converDate(jsonObj.nodeStat.ctime) );
						}
						else{
							$("#tdCtime").html( jsonObj.nodeStat.ctime);
						}
						$("#tdMzxid").html( jsonObj.nodeStat.mzxid);
						if(jsonObj.nodeStat.mtime!="" && jsonObj.nodeStat.mtime!=0){
							$("#tdMtime").html( converDate(jsonObj.nodeStat.mtime) );
						}
						else{
							$("#tdMtime").html( jsonObj.nodeStat.mtime);
						}
						$("#tdPzxid").html( jsonObj.nodeStat.pzxid);
						$("#tdCversion").html( jsonObj.nodeStat.cversion);
						$("#tdDataVersion").html( jsonObj.nodeStat.version);
						$("#tdAclVersion").html( jsonObj.nodeStat.aversion);
						$("#tdEphemer").html( jsonObj.nodeStat.ephemeralOwner);
						$("#tdDataLen").html( jsonObj.nodeStat.dataLength);
						$("#tdNumChild").html( jsonObj.nodeStat.numChildren);
						
						//创建子节点信息
						if(jsonObj.nodePath!="/"){
							$("#childParentPath").html( jsonObj.nodePath + "/" );
							currNodePath=jsonObj.nodePath + "/";
						}
						else{
							$("#childParentPath").html("/"); 
							currNodePath="/";
						}
						
						$("#btnCreateNode").attr({"disabled":false});
						$("#btnDelNode").attr({"disabled":false});
						$("#btnSetNodeData").attr({"disabled":false});
					}
					else{
						currNodePath="";
						$(".ltd").each(function(){
							$(this).html("");
						});
						$("#nodeData").val( "" );
						$("#btnCreateNode").attr({"disabled":true});
						$("#btnDelNode").attr({"disabled":true});
						$("#btnSetNodeData").attr({"disabled":true});
					}
				}
			});
		}
		
		/**
		* 在当前节点下创建子节点
		*/
		function createChildNode(){
			var postData={};
			postData["parentPath"]=currNodePath;
			postData["childPath"]=$("#childPath").val();
			if(postData["parentPath"]=="" || postData["childPath"]==""){
				return;
			}
			$.ajax({
				url: "<c:url value='/zk/createChildNodes.do'/>?d=" + Math.random(),
				type: 'post',
				data: postData,
				success: function (jsonObj) {
					if(jsonObj.success){
						$("#successMsg").css("display","");
						$("#successMsg").slideUp(1000,function(){
							var treeNode = zTreeObj.getNodeByParam("fullPath", jsonObj.parentPath, null);
							//zTreeObj.addNodes(treeNode,jsonObj.data);
							zTreeOnExpand(null,null,treeNode);
							//zTreeOnClick(null, null, treeNode);
						});
					}
					else{
						$("#failMsg").css("display","");
						$("#failMsg").slideUp(1000);
					}
				}
			});
		}
		
		/**
		* 删除当前选中节点
		*/
		function deleteNodes(){
			var postData={};
			postData["nodePath"]=currNodePath;
			if(postData["nodePath"]==""){
				alert("请选中节点后删除！");
				return;
			}
			if(!window.confirm("您确定需要删除[" + currNodePath + "]节点吗?")){
				return;
			}
			$.ajax({
				url: "<c:url value='/zk/deletNodes.do'/>?d=" + Math.random(),
				type: 'post',
				data: postData,
				success: function (jsonObj) {
					if(jsonObj.success){
						$("#successMsg").css("display","");
						$("#successMsg").slideUp(1000,function(){
							//删除当前节点
							var treeNode = zTreeObj.getNodeByParam("fullPath", jsonObj.nodePath, null);
							zTreeObj.removeNode(treeNode);
							
							//选中父节点并触发其click事件,让左右数据均
							var parentNode=zTreeObj.getNodeByParam("fullPath", jsonObj.parentPath, null);
							zTreeObj.selectNode(parentNode);
							zTreeOnClick(null, null, parentNode);
							
							//清空部分信息
							$("#childPath").val("");
						});
					}
					else{
						$("#failMsg").css("display","");
						$("#failMsg").slideUp(1000);
					}
				}
			});
		}
		
		/**
		* 设置/修改当前节点的值
		*/
		function setNodeData(){
			var postData={};
			postData["nodePath"]=currNodePath;
			postData["nodeData"]=$("#nodeData").val();
			if(postData["nodePath"]==""){
				alert("请选中节点后再设置值！");
				return;
			}
			$.ajax({
				url: "<c:url value='/zk/setNodeData.do'/>?d=" + Math.random(),
				type: 'post',
				data: postData,
				success: function (jsonObj) {
					console.log(jsonObj);
					if(jsonObj.success){
						$("#successMsg").css("display","");
						$("#successMsg").slideUp(1000,function(){
							//选中当前节点并触发其click事件
							var treeNode = zTreeObj.getNodeByParam("fullPath", jsonObj.nodePath, null);
							zTreeObj.selectNode(treeNode);
							zTreeOnClick(null, null, treeNode);
						});
					}
					else{
						$("#failMsg").css("display","");
						$("#failMsg").slideUp(1000);
					}
				}
			});
		}
	</script>
</head>
<body>
<div class="container-fluid">
	<div class="row content">
		<div class="col-xs-3 treeNagive">
			<div class="panel panel-default">
				<div class="panel-body" id="ztreeBody">
					<ul id="tree" class="ztree"></ul>
				</div>
			</div>
		</div>
		<div class="col-xs-9 nodePanel">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3 class="panel-title">
						<span class="label label-default">Server:</span> ${zkServerInfo}
					</h3>
				</div>
				<div class="panel-body">
					<div class="col-xs-8 nodeInfoPenel"><!-- 节点内容展示开始 -->
						<div id="successMsg" class="alert alert-success alert-dismissible navbar-fixed-top" role="alert" style="display:none">操作成功</div>
						<div id="failMsg" class="alert alert-danger alert-dismissible navbar-fixed-top" role="alert" style="display:none">操作失败</div>
						<table class="table table-bordered table-hover table-condensed table-striped nodeAttrTab">
							<tr>
								<td width="150px" class="ctd">path</td>
								<td class="ltd" id="tdPath"></td>
							</tr>
							<tr>
								<td class="ctd">data</td>
								<td class="ltdc" id="tdData">
									<div class="input-group">
										<input type="text" class="form-control" id="nodeData" ext="">
										<span class="input-group-btn">
											<button class="btn btn-primary" type="button" disabled="disabled" id="btnSetNodeData">设置节点值</button>
										</span>
									</div>
								</td>
							</tr>
							<tr>
								<td class="ctd">cZxid</td>
								<td class="ltd" id="tdCzxid"></td>
							</tr>
							<tr>
								<td class="ctd">ctime</td>
								<td class="ltd" id="tdCtime"></td>
							</tr>
							<tr>
								<td class="ctd">mZxid</td>
								<td class="ltd" id="tdMzxid"></td>
							</tr>
							<tr>
								<td class="ctd">mtime</td>
								<td class="ltd" id="tdMtime"></td>
							</tr>
							<tr>
								<td class="ctd">pZxid</td>
								<td class="ltd" id="tdPzxid"></td>
							</tr>
							<tr>
								<td class="ctd">cversion</td>
								<td class="ltd" id="tdCversion"></td>
							</tr>
							<tr>
								<td class="ctd">dataVersion</td>
								<td class="ltd" id="tdDataVersion"></td>
							</tr>
							<tr>
								<td class="ctd">aclVersion</td>
								<td class="ltd" id="tdAclVersion"></td>
							</tr>
							<tr>
								<td class="ctd">ephemeraalOwner</td>
								<td class="ltd" id="tdEphemer"></td>
							</tr>
							<tr>
								<td class="ctd">dataLength</td>
								<td class="ltd" id="tdDataLen"></td>
							</tr>
							<tr>
								<td class="ctd">numChildren</td>
								<td class="ltd" id="tdNumChild"></td>
							</tr>
							<tr>
								<td class="ctd">子节点名称</td>
								<td class="ltdc" id="tdChildPath">
									<div class="input-group">
										<span class="input-group-addon" id="childParentPath">&nbsp;</span>
										<input type="text" class="form-control" id="childPath" aria-describedby="childParentPath" ext="">
										<span class="input-group-btn">
											<button class="btn btn-primary" type="button" disabled="disabled" id="btnCreateNode">创建子节点</button>
										</span>
									</div>
								</td>
							</tr>
						</table>
						<div class="col-xs-12 nodeInfoFooter">
							<button class="btn btn-danger" type="button" disabled="disabled" id="btnDelNode">删除当前节点</button>
						</div>
					</div><!-- 节点内容展示结束 -->
					
					<div class="col-xs-4 nodeMonitorPenel"><!-- 监控面板开始 -->
						
					</div><!-- 监控面板结束 -->
				</div>
			</div>
		</div>
	</div>
</div>

<%-- 交互过程中等待标识 --%>
<div id="imgWait" style="display:none;position:absolute;left:0;top:0;background:transparent;z-index: 9999;">
	<table style="width:100%;height:100%;">
		<tr valign="middle">
			<td align="center">
				<img src="<c:url value='/images/wait124X124.gif'/>" style="padding:10px;" />
			</td>
		</tr>
	</table>
</div>

</body>
</html>
