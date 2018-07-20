package com.sh.haoyue.controller;

import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.recipes.cache.TreeCache;
import org.apache.curator.framework.recipes.cache.TreeCacheEvent;
import org.apache.curator.framework.recipes.cache.TreeCacheListener;
import org.apache.curator.retry.RetryForever;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;

import com.sh.haoyue.utils.SyspropUtils;

/**
 * 监控zk整体节点变化等
 * @author plghqr@21cn.com
 */
@Controller
public class ZkMonitorController {
	private static Logger logger = LoggerFactory.getLogger(ZkMonitorController.class);
	private static String ZOOKEEPER_SERVER_LIST=SyspropUtils.getInstance().getProperty("com.sh.haoyue.zookeeper.server.list");
	
	static {
		final RetryPolicy retryPolicy=new RetryForever(1000*5); 
		final String rootPath="/";
		
		CuratorFramework curator = CuratorFrameworkFactory.newClient(ZOOKEEPER_SERVER_LIST, retryPolicy);
		curator.start();
		
		TreeCache treeCache = new TreeCache(curator, rootPath); 
		try {
			treeCache.start();
			treeCache.getListenable().addListener(new TreeCacheListener(){
				public void childEvent(CuratorFramework curator, TreeCacheEvent event) throws Exception {
					switch(event.getType()){
						case NODE_ADDED:
							if(logger.isDebugEnabled()) {
								logger.debug("Event type is : {}", "NODE_ADDED");
							}
							break;
						case NODE_UPDATED:
							if(logger.isDebugEnabled()) {
								logger.debug("Event type is : {}", "NODE_UPDATED");
							}
							break;
						case NODE_REMOVED:
							if(logger.isDebugEnabled()) {
								logger.debug("Event type is : {}", "NODE_REMOVED");
							}
							break;
						case CONNECTION_SUSPENDED:
							if(logger.isDebugEnabled()) {
								logger.debug("Event type is : {}", "CONNECTION_SUSPENDED");
							}
							break;
						case CONNECTION_RECONNECTED:
							if(logger.isDebugEnabled()) {
								logger.debug("Event type is : {}", "CONNECTION_RECONNECTED");
							}
							break;
						case CONNECTION_LOST:
							if(logger.isDebugEnabled()) {
								logger.debug("Event type is : {}", "CONNECTION_LOST");
							}
							break;
						case INITIALIZED:
							if(logger.isDebugEnabled()) {
								logger.debug("Event type is : {}", "INITIALIZED");
							}
							break;
						default:
							break;
					}
				}
			});
		}catch(Exception ex) {
			logger.error(ex.getMessage(), ex);
		}
	}
}
