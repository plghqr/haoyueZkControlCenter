package com.sh.haoyue.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.management.MBeanServerConnection;
import javax.management.MalformedObjectNameException;
import javax.management.ObjectName;
import javax.management.remote.JMXConnector;
import javax.management.remote.JMXConnectorFactory;
import javax.management.remote.JMXServiceURL;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.sh.haoyue.dc.ZookeeperNode;
import com.sh.haoyue.utils.SyspropUtils;

/**
 * 监控zk整体节点变化等
 * @author plghqr@21cn.com
 */
@Controller
public class ZkMonitorController {
	private static Logger logger = LoggerFactory.getLogger(ZkMonitorController.class);
	//private static String ZOOKEEPER_SERVER_LIST=SyspropUtils.getInstance().getProperty("com.sh.haoyue.zookeeper.server.list");
	
	private static String RMI_JMX_IP=SyspropUtils.getInstance().getProperty("com.sh.haoyue.zookeeper.jmx.ip");
	private static String RMI_JMX_PORT=SyspropUtils.getInstance().getProperty("com.sh.haoyue.zookeeper.jmx.port");
	private static String RMI_JMX_USER=SyspropUtils.getInstance().getProperty("com.sh.haoyue.zookeeper.jmx.user");
	private static String RMI_JMX_PASSWORD=SyspropUtils.getInstance().getProperty("com.sh.haoyue.zookeeper.jmx.password");
	
	/*
	static {
		final RetryPolicy retryPolicy=new RetryForever(1000*5); 
		final String rootPath="/";
		
		CuratorFramework curator = CuratorFrameworkFactory.newClient(ZOOKEEPER_SERVER_LIST, retryPolicy);
		curator.start();
		
		TreeCache treeCache = new TreeCache(curator, rootPath); 
		try {
			logger.debug( "Nodes:{}",curator.getChildren().forPath(rootPath).size() );
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
	*/
	
	/**
	 *  通过JMX监控zk节点信息
	 * @param request
	 * @param response
	 * @return
	 * @throws MalformedObjectNameException 
	 */
	@ResponseBody
	@RequestMapping(value="zk/monitor/jmx/zkStat.do",produces="application/json;charset=UTF-8")
	public String monitorJmxZkStat(
			HttpServletRequest request,
			HttpServletResponse response) {
		if(logger.isDebugEnabled()) {
			logger.debug("zk/monitor/jmx/zkStat.do");
		}
		Map<String,Object> retMap=new HashMap<String,Object>();
		retMap.put("success", false);
		
		JMXConnector connector=null;
		MBeanServerConnection mbsc = createMBeanServer( RMI_JMX_IP , RMI_JMX_PORT, RMI_JMX_USER, RMI_JMX_PASSWORD,connector);
		try {
			ObjectName dataTreePattern = new ObjectName("org.apache.ZooKeeperService:name0=ReplicatedServer_id?,name1=replica.?,name2=*,name3=InMemoryDataTree");
			
		}catch(MalformedObjectNameException ex) {
			//单机版本
		}finally {
			if(connector!=null) {
				try {
					connector.close();
				} catch (IOException ex) {
					logger.error(ex.getLocalizedMessage(), ex);
				}
			}
		}
		
		return new Gson().toJson(retMap);
	}
	
	/**
	 * 建立连接
	 * @param ip
	 * @param jmxport
	 * @return
	 */
	public static MBeanServerConnection createMBeanServer(String ip, String jmxport, String userName, String password,JMXConnector connector) {
		try {
			String jmxURL = "service:jmx:rmi:///jndi/rmi://" + ip + ":" + jmxport + "/jmxrmi";
			JMXServiceURL serviceURL = new JMXServiceURL(jmxURL);

			Map<String, String[]> map = new HashMap<String, String[]>();
			String[] credentials = new String[] { userName, password };
			map.put("jmx.remote.credentials", credentials);
			connector = JMXConnectorFactory.connect(serviceURL, map);
			MBeanServerConnection mbsc = connector.getMBeanServerConnection();
			return mbsc;
		} catch (IOException ioe) {
			ioe.printStackTrace();
			System.err.println(ip + ":" + jmxport + " 连接建立失败");
		}
		return null;
	}

	/**
	 * 使用MBeanServer获取对象名为[objName]的MBean的[objAttr]属性值
	 * <p>
	 * 静态代码: return MBeanServer.getAttribute(ObjectName name, String attribute)
	 *
	 * @param mbeanServer - MBeanServer实例
	 * @param objName     - MBean的对象名
	 * @param objAttr     - MBean的某个属性名
	 * @return 属性值
	 */
	private static String getAttribute(MBeanServerConnection mbeanServer, ObjectName objName, String objAttr) {
		if (mbeanServer == null || objName == null || objAttr == null)
			throw new IllegalArgumentException();
		try {
			return String.valueOf(mbeanServer.getAttribute(objName, objAttr));
		} catch (Exception e) {
			return null;
		}
	}
}
