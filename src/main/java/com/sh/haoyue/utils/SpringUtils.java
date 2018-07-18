package com.sh.haoyue.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerAdapter;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

/**
 * web工程启动时,自动扫描该组件,以方操控各种组件
 */
@Component
public class SpringUtils implements ApplicationContextAware  {
	private static Logger logger = LoggerFactory.getLogger(SpringUtils.class);
	private static ApplicationContext context;
	
	@Override
	public void setApplicationContext(ApplicationContext context) throws BeansException {
		logger.info("Application Context Create ...");
		setContext(context);
	}
	
	public static void setContext(ApplicationContext context){
		SpringUtils.context=context;
	}
	
	public static Object getBeans(String beanId){
		return context.getBean(beanId);
	}
	
	/**
	 * HandlerExecutionChain chain = SpringUtils.getHandlerMapping().getHandler(request);  获得对应的handler
	 * @return
	 */
	public static HandlerMapping getHandlerMapping(){
		return (HandlerMapping)context.getBean(RequestMappingHandlerMapping.class);
	}
	
	/**
	 * final ModelAndView model = SpringUtils.getHandlerAdapter().handle(request, response,chain.getHandler());   执行相应的view
	 * @return
	 */
	public static HandlerAdapter getHandlerAdapter(){
		return (HandlerAdapter)context.getBean( context.getBeanNamesForType(RequestMappingHandlerAdapter.class)[0] );
	}
}
