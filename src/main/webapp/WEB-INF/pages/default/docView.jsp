<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/includetld.jsp"%>
<!DOCTYPE HTML>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta http-equiv="x-ua-compatible" content="IE=edge, chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1,user-scalable=no" />
	<%@ include file="/common/includejscss.jsp"%>
	<title>查看文档</title>
	<style type="text/css">
		.msgContent{
			max-height:300px;
			min-height:300px;
			overflow:auto;
			line-height:24px;
			border:1px solid #cecece;
		}
	</style>
	<script type="text/javascript">
		$(function(){
			loadDataByAjax();
			window.setInterval(loadDataByAjax,1000*2);
		})
		
		function loadDataByAjax(){
			var postData={};
			postData["time"]=new Date();
			$.ajax({
				url: "<c:url value='/default/getDocInfo.do'/>?d=" + Math.random(),
				type: 'post',
				data: postData,
				success: function (jsonObj) {
					if(jsonObj.success){
						$(".msgContent").append( jsonObj.message + "&nbsp;&nbsp;<span class='label label-primary'>" + jsonObj.timeStamp + "</span><br/>");
						
						$(".msgContent").scrollTop( $(".msgContent")[0].scrollHeight);
					}
				}
			});
		}
	</script>
</head>
<body>
<div class="container-fluid">
	<div class="row">
		<div class="col-sm-6 col-sm-offset-3 col-xs-12">
			<p class="text-center">${title}</p>
			<ul class="list-group">
				<li class="list-group-item"><span class="label label-default">原始对象：</span> ${srcObject}</li>
				<li class="list-group-item"><span class="label label-default">获取对象：</span> ${beanObject}</li>
				<li class="list-group-item"><span class="label label-default">属性值：</span> ${propertyValue}</li>
				<li class="list-group-item"><span class="label label-default">Server Time：</span> <fmt:formatDate value="${serverTime}" pattern="yyyy-MM-dd HH:mm:ss.sss"/></li>
			</ul>
		</div>
		<div class="clearfix"></div>
		<div class="col-sm-6 col-sm-offset-3">
			<p class="text-left">${content}</p>
		</div>
		<div class="clearfix"></div>
		<div class="col-sm-6 col-sm-offset-3 col-xs-12 msgContent">
		
		</div>
	</div>
</div>
</body>
</html>
