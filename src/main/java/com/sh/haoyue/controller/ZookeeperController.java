package com.sh.haoyue.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.retry.RetryForever;
import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.data.ACL;
import org.apache.zookeeper.data.Stat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;
import com.sh.haoyue.dc.ZookeeperNode;
import com.sh.haoyue.utils.SyspropUtils;

/**
 * 以目录格式展示zookeeper
 * @author E430
 */
@Controller
public class ZookeeperController {
	private static Logger logger = LoggerFactory.getLogger(ZookeeperController.class);
	private static String ZOOKEEPER_SERVER_LIST=SyspropUtils.getInstance().getProperty("com.sh.haoyue.zookeeper.server.list");
	
	/**
	 * 展开zk根节点/,显示其下的直接子节点
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value="zk/zkRoot.do")
	public ModelAndView zkRoot(
			HttpServletRequest request,
			HttpServletResponse response) {
		ModelAndView mav=new ModelAndView("zk/zkRoot");
		if(logger.isDebugEnabled()) {
			logger.debug("zk/zkRoot.do");
		}
		
		final RetryPolicy retryPolicy=new RetryForever(1000); 
		CuratorFramework curator = CuratorFrameworkFactory.newClient(ZOOKEEPER_SERVER_LIST, retryPolicy);
		curator.start();
		
		mav.addObject("zkServerInfo", ZOOKEEPER_SERVER_LIST);
		String rootPath="/";
		try {
			List<String> children = curator.getChildren().forPath(rootPath);
			
			//设置当前节点信息
			ZookeeperNode rootNode=new ZookeeperNode();
			rootNode.setName("/");
			rootNode.setFullPath(rootPath);
			if(!CollectionUtils.isEmpty(children)) {
				rootNode.setIsParent(true);
				rootNode.setOpen(true);
				
				//设置子节点
				rootNode.setChildren( new ArrayList<ZookeeperNode>() );
				for(String child : children) {
					ZookeeperNode childNode=new ZookeeperNode();
					childNode.setName(child);
					childNode.setFullPath( rootNode.getFullPath() + child );
					
					//判断该节点是否有子节点(是否展开等)
					List<String> grandson = curator.getChildren().forPath( childNode.getFullPath() );
					if(!CollectionUtils.isEmpty(grandson)) {
						childNode.setIsParent(true);
					}
					
					rootNode.getChildren().add(childNode);
				}
			}
			mav.addObject("nodeInfo", new Gson().toJson( rootNode ) );
		} catch (Exception ex) {
			logger.error(ex.getLocalizedMessage(), ex);
		}
		curator.close();
		
		return mav;
	}
	
	/**
	 * 获取当前节点的所有子节点,以适应zTree的格式返回
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value="zk/getChildNodes.do",produces="application/json;charset=UTF-8")
	public String getChildNodes(
			HttpServletRequest request,
			HttpServletResponse response) {
		if(logger.isDebugEnabled()) {
			logger.debug("zk/getChildNodes.do");
		}
		Map<String,Object> retMap=new HashMap<String,Object>();
		retMap.put("success", false);
		
		final RetryPolicy retryPolicy=new RetryForever(1000); 
		CuratorFramework curator = CuratorFrameworkFactory.newClient(ZOOKEEPER_SERVER_LIST, retryPolicy);
		curator.start();
		
		String nodePath=request.getParameter("nodePath");  //获取当前节点信息
		try {
			List<String> children = curator.getChildren().forPath(nodePath);
			if(!CollectionUtils.isEmpty(children)) {
				List<ZookeeperNode> childrenList = new ArrayList<ZookeeperNode>();
				for(String child : children) {
					ZookeeperNode node=new ZookeeperNode();
					node.setName(child);
					node.setFullPath( nodePath + "/" + child );
					
					//判断该节点是否有子节点(是否展开等)
					List<String> grandson = curator.getChildren().forPath( node.getFullPath() );
					if(!CollectionUtils.isEmpty(grandson)) {
						node.setIsParent(true);
					}
					childrenList.add( node );
				}
				if(!CollectionUtils.isEmpty(childrenList)) {
					retMap.put("success", true);
					retMap.put("data", childrenList );
				}
			}
			
		} catch (Exception ex) {
			logger.error(ex.getLocalizedMessage(), ex);
		}
		curator.close();
		
		return new Gson().toJson(retMap);
	}
	
	/**
	 * 获取当前节点信息
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value="zk/getNodeInfo.do",produces="application/json;charset=UTF-8")
	public String getNodeInfo(
			HttpServletRequest request,
			HttpServletResponse response) {
		if(logger.isDebugEnabled()) {
			logger.debug("zk/getNodeInfo.do");
		}
		Map<String,Object> retMap=new HashMap<String,Object>();
		retMap.put("success", false);
		
		final RetryPolicy retryPolicy=new RetryForever(1000); 
		CuratorFramework curator = CuratorFrameworkFactory.newClient(ZOOKEEPER_SERVER_LIST, retryPolicy);
		curator.start();
		
		String nodePath=request.getParameter("nodePath");  //获取当前节点信息
		try {
			Stat stat = curator.checkExists().forPath(nodePath);
			if(null!=stat) {
				retMap.put("success", true);
				retMap.put("nodePath", nodePath);
				retMap.put("nodeStat", stat);  //当前节点控制信息
				
				byte[] dataBytes = curator.getData().forPath(nodePath);
				if(null!=dataBytes && dataBytes.length!=0) {
					retMap.put("nodeData", new String(dataBytes,"UTF-8") );  //节点数据
				}
				else {
					retMap.put("nodeData", "");
				}
				
				List<ACL> aclList = curator.getACL().forPath(nodePath);
				retMap.put( "aclList", aclList );
			}
		} catch (Exception ex) {
			logger.error(ex.getLocalizedMessage(), ex);
		}
		curator.close();
		
		return new Gson().toJson(retMap);
	}
	
	/**
	 * 在当前节点批量创建子节点
	 * 返回到前端后,展开父节点,并选中当前创建的子节点(如果是批量创建多层级的子节点,则选中最后一个非叶子节点)
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value="zk/createChildNodes.do",produces="application/json;charset=UTF-8")
	public String createChildNodes(
			HttpServletRequest request,
			HttpServletResponse response) {
		if(logger.isDebugEnabled()) {
			logger.debug("zk/createChildNodes.do");
		}
		Map<String,Object> retMap=new HashMap<String,Object>();
		retMap.put("success", false);
		
		final RetryPolicy retryPolicy=new RetryForever(1000); 
		CuratorFramework curator = CuratorFrameworkFactory.newClient(ZOOKEEPER_SERVER_LIST, retryPolicy);
		curator.start();
		
		String parentPath=request.getParameter("parentPath");  //当前节点信息
		String childPath=request.getParameter("childPath");    //子节点信息
		if(StringUtils.isNotBlank(parentPath) && StringUtils.isNotBlank(childPath)) {
			parentPath=parentPath.trim();
			childPath=childPath.trim();
			
			if(!parentPath.startsWith("/")) {
				parentPath="/" + parentPath;
			}
			if(!parentPath.endsWith("/")) {
				parentPath+="/";
			}
			if(childPath.startsWith("/")) {
				childPath=childPath.substring(1);
			}
			if(childPath.endsWith("/")) {
				childPath=childPath.substring(0,childPath.length()-1);
			}
			if(StringUtils.isNotBlank(parentPath) && StringUtils.isNotBlank(childPath)) {
				String nodePath=parentPath + childPath;
				try {
					Stat stat = curator.checkExists().forPath(nodePath);
					if(stat==null) {
						curator.create().creatingParentsIfNeeded().withMode(CreateMode.PERSISTENT).forPath(nodePath, new byte[0]);
						retMap.put("success", true);
						
						retMap.put("nodePath", nodePath);
						retMap.put("parentPath", parentPath.substring(0,parentPath.length()-1));
						
						//添加新的子节点(第一级子节点)
						String[] childPathArr = childPath.split("/");
						
						ZookeeperNode node=new ZookeeperNode();
						node.setName( childPathArr[0] );
						node.setFullPath( parentPath + childPathArr[0] );
						
						//判断该节点是否有子节点(是否展开等)
						List<String> grandson = curator.getChildren().forPath( node.getFullPath() );
						if(!CollectionUtils.isEmpty(grandson)) {
							node.setIsParent(true);
						}
						retMap.put("data", node );
						
					}
				} catch (Exception ex) {
					logger.error(ex.getMessage(), ex);
				}
			}
		}
		
		curator.close();
		
		return new Gson().toJson(retMap);
	}
}
