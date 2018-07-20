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
			padding-bottom:15px;
		}
		.nodePanel .panel-body .table-bordered{
			border-left:0px solid red;
			border-right:0px solid red;
		}
		.nodeAttrTab .ctd{
			text-align:center;
			vertical-align:middle;
			font-weight:bold;
		}
		.nodeAttrTab .ltd{
			text-align:left;
			vertical-align:middle;
			padding-left:15px;
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
						$("#tdData").html( jsonObj.nodeData );
						
						$("#tdCzxid").html( jsonObj.nodeStat.czxid);
						$("#tdCtime").html( jsonObj.nodeStat.ctime);
						$("#tdMzxid").html( jsonObj.nodeStat.mzxid);
						$("#tdMtime").html( jsonObj.nodeStat.mtime);
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
					}
					else{
						currNodePath="";
						$(".ltd").each(function(){
							$(this).html("");
						});
						$("#btnCreateNode").attr({"disabled":true});
						$("#btnDelNode").attr({"disabled":true});
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
					console.log(jsonObj);
					if(jsonObj.success){
						var treeNode = zTreeObj.getNodeByParam("fullPath", jsonObj.parentPath, null);
						console.log(treeNode);
						zTreeObj.addNodes(treeNode,jsonObj.data);
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
					<table class="table table-bordered table-hover table-striped nodeAttrTab">
						<tr>
							<td width="150px" class="ctd">path</td>
							<td class="ltd" id="tdPath"></td>
						</tr>
						<tr>
							<td class="ctd">data</td>
							<td class="ltd" id="tdData"></td>
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
							<td id="tdChildPath">
								<div class="input-group col-xs-6">
									<span class="input-group-addon" id="childParentPath">&nbsp;</span>
									<input type="text" class="form-control" id="childPath" aria-describedby="childParentPath" ext="">
									<span class="input-group-btn">
										<button class="btn btn-primary" type="button" disabled="disabled" id="btnCreateNode">创建子节点</button>
									</span>
								</div>
							</td>
						</tr>
					</table>
					<div class="col-xs-12">
						<button class="btn btn-danger" type="button" disabled="disabled" id="btnDelNode">删除当前节点</button>
					</div>
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
