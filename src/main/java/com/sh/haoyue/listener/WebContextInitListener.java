package com.sh.haoyue.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.ServletRequestEvent;
import javax.servlet.ServletRequestListener;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Web容器已经启动的情况下,启动一些和环境/路由相关的内容
 * @author penggq
 */
public class WebContextInitListener implements ServletContextListener,ServletRequestListener,HttpSessionListener{
	private static Logger logger = LoggerFactory.getLogger(WebContextInitListener.class);
	
	public ThreadLocal<Long> requestConsume = new ThreadLocal<Long>();  //每个Request消费时间(生产环境中注意空间消费)
	public ThreadLocal<Long> sessionConsume = new ThreadLocal<Long>();  //每个Session消费时间
		
	/**
	 * web应用启动
	 * @throws InterruptedException 
	 * @see ServletContextListener.contextInitialized
	 */
	public void contextInitialized(ServletContextEvent contextEvent) {
		logger.info( "Web Context Start ...." );
	}
	
	/**
	 * web应用销毁
	 * @see ServletContextListener.contextDestroyed
	 */
	public void contextDestroyed(ServletContextEvent contextEvent) {
		logger.info("Web Context Stop!");
		
		//非正常销毁(socket监听,循环执行任务等销毁)
		System.exit(1);
	}
	
	/**
	 * 请求到达 ,准备批量记录日志
	 * @see ServletRequestListener.requestInitialized
	 */
	public void requestInitialized(ServletRequestEvent reqEvent) {
		if( logger.isDebugEnabled() ) {
			long begTimes=System.currentTimeMillis();
			requestConsume.set( begTimes );
			logger.info("Request initialized,Time is [{}]",begTimes );
		}
	}
	
	/**
	 * 请求被销毁,批量写入用户本次请求日志(一般只有在写数据库等会改变系统、应用数据状态的动作才需要该日志)
	 * @see ServletRequestListener.requestDestroyed
	 */
	public void requestDestroyed(ServletRequestEvent reqEvent) {
		if( logger.isDebugEnabled() ) {
			long endTimes=System.currentTimeMillis();
			if(requestConsume!=null && null!=requestConsume.get() ) {
				long consumeTimes = endTimes-requestConsume.get();
				logger.debug("Request destoryed! Time is [{}],Consume Time is {} ms.",endTimes,consumeTimes);
			}
			else {
				logger.debug("Request destoryed! Time is [{}].",endTimes);
			}
		}
	}
	
	/**
	 * session创建
	 */
	@Override
	public void sessionCreated(HttpSessionEvent sessionEven) {
		if( logger.isDebugEnabled() ) {
			long begTimes=System.currentTimeMillis();
			sessionConsume.set( begTimes );
			logger.debug("Session {} created ,Time is [{}]",sessionEven.getSession().getId(),begTimes);
		}
	}

	/**
	 * session销毁
	 */
	@Override
	public void sessionDestroyed(HttpSessionEvent sessionEven) {
		if( logger.isDebugEnabled() ) {
			long endTimes=System.currentTimeMillis();
			if(sessionConsume!=null && null!=sessionConsume.get() ) {
				long consumeTimes = endTimes-sessionConsume.get();
				logger.debug("Session {} destoryed! Time is [{}],Consume Time is {} ms.",sessionEven.getSession().getId(),endTimes,consumeTimes);
			}
			else {
				logger.debug("Session {} destoryed! Time is [{}].",sessionEven.getSession().getId(),endTimes);
			}
		}
	}
}
