<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/includetld.jsp"%>
<!DOCTYPE HTML>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta http-equiv="x-ua-compatible" content="IE=edge, chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1,user-scalable=no" />
	
	<link type="text/css" rel="stylesheet" href="<c:url value='/css/bootstrap.min.css'/>?v=20180712001" >
	<link type="text/css" rel="stylesheet" href="<c:url value='/css/bootstrap-theme.min.css'/>?v=20180712001" >
	<link type="text/css" rel="stylesheet" href="<c:url value='/css/font-awesome.min.css'/>?v=20180712001" >
	
	<script type="text/javascript" src="<c:url value='/js/jquery-1.10.2.min.js'/>?v=20180712001"></script>
	<script type="text/javascript" src="<c:url value='/js/bootstrap.min.js'/>?v=20180712001"></script>
	<style type="text/css">
		body{
			padding:2px;
		}
		.blockContent{
			border:1px solid #c0c0c0;
		}
	</style>
	<title>Service Configure Center</title>
</head>
<body>
<div class="container-fluid">
	<div class="row">
		<div class="col-xs-3 blockContent">
			<div><a href="<c:url value='/default/docList.do'/>" target="_blank"><i class="fa fa-list fa-fw" aria-hidden="true"></i>&nbsp;列表</a></div>
			<div><a href="<c:url value='/default/viewDoc.do'/>" target="_blank"><i class="fa fa-folder-o fa-fw" aria-hidden="true"></i>&nbsp;文档</a></div>
		</div>
	</div>
</div>
</body>
</html>
