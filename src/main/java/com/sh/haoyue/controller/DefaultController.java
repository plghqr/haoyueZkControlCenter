package com.sh.haoyue.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;
import com.sh.haoyue.utils.SpringUtils;
import com.sh.haoyue.utils.SyspropUtils;

/**
 * 搭配环境测试用
 */
@Controller
public class DefaultController {
	private static Logger logger = LoggerFactory.getLogger(DefaultController.class);
	
	
	@RequestMapping(value="default/docList.do")
	public ModelAndView docList(
			HttpServletRequest request,
			HttpServletResponse response) {
		ModelAndView mav=new ModelAndView("default/docList");
		if(logger.isDebugEnabled()) {
			logger.debug("{}", "docList");
		}
		return mav;
	}
	
	@RequestMapping(value="default/viewDoc.do")
	public ModelAndView viewDoc(
			HttpServletRequest request,
			HttpServletResponse response) {
		ModelAndView mav=new ModelAndView("default/docView");
		
		mav.addObject("title", "中美贸易战开始,改变未来20年之世界格局<br/><span style='color:red'>(2018-07-06 12:01)</span>");
		mav.addObject("content", "今天(2018-07-06)中午12点01分，中美贸易正式开打，中国迫于美国压力，在美国开第一枪的第一时间，自动开始反击。<br/>今天将被历史铭记！");
		
		//简单测试Spring bean单例
		DefaultController defaultController=(DefaultController) SpringUtils.getBeans("defaultController");
		mav.addObject("srcObject",this.toString());
		mav.addObject("beanObject",defaultController.toString());
		
		//测试获取配置属性
		String zkServerList = SyspropUtils.getInstance().getProperty("com.sh.haoyue.zookeeper.server.list");
		mav.addObject("propertyValue", zkServerList );
		
		mav.addObject("serverTime", new Date() );
		
		return mav;
	}
	
	@ResponseBody
	@RequestMapping(value="default/getDocInfo.do",produces="application/json;charset=UTF-8")
	public String applaudDocItem(
			HttpServletRequest request,
			HttpServletResponse response){
		Gson gson=new Gson();
		Map<String,Object> retMap=new HashMap<String,Object>();
		
		retMap.put("success", true);
		retMap.put("message", "中美贸易战开始,改变未来20年之世界格局(2018-07-06 12:01) " );
		retMap.put("timeStamp", "Time: " + DateFormatUtils.format(new Date(), "yyyy-MM-dd HH:mm:ss") );
		
		retMap.put("serverTime",  new Date() );
		
		return gson.toJson(retMap);
	}
}
