package com.sh.haoyue.utils;

import java.io.IOException;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.stereotype.Component;


/**
 * 系统级别属性的初始化(自动读取sysinit.properties中的配置)
 * @author Penggq
 */
@Component
public class SyspropUtils {
	private static Logger logger = LoggerFactory.getLogger(SyspropUtils.class);
	private static Properties props = new Properties();
	
	private SyspropUtils(){}
	private static class SyspropUtilsFactory{
		private static SyspropUtils instance = new SyspropUtils(); 
	}
	
	public static SyspropUtils getInstance() {
		return SyspropUtilsFactory.instance; 
	}
	
	/**
	 * 创建上传图片路径等全局相关的属性
	 */
	static{
		Resource resource = new ClassPathResource("/sysinit.properties"); 
		try {
			props=PropertiesLoaderUtils.loadProperties(resource);
			if(logger.isDebugEnabled()) {
				logger.debug("Load properties file {} success!",resource.getFilename() );
			}
		} catch (IOException e) {
			logger.error("Config file load error!", e);
		}
		
//		//创建日志文件夹和系统级别变量
//		String logfolder=props.getProperty("system.path.logger.folder");
//		File currFile = new File(logfolder);
//		if(currFile==null || !currFile.exists() || !currFile.isDirectory() ){
//			if(!currFile.mkdirs()){
//				System.out.println("创建日志存储目录过程中发生错误，请检查并重新启动服务器!");
//			}
//		}
//		System.setProperty("WORKDIR", logfolder);   //日志目录
//		
//		//创建上传文件夹
//		String uploadfolder=props.getProperty("system.path.upload.file.folder");
//		currFile = new File(uploadfolder);
//		if(currFile==null || !currFile.exists() || !currFile.isDirectory() ){
//			if(!currFile.mkdirs()){
//				System.out.println("创建上传文件目录过程中发生错误，请检查并重新启动服务器!");
//			}
//		}
//		
//		String imagefolder=props.getProperty("system.path.upload.image.folder");
//		currFile = new File(imagefolder);
//		if(currFile==null || !currFile.exists() || !currFile.isDirectory() ){
//			if(!currFile.mkdirs()){
//				System.out.println("创建上传图片目录过程中发生错误，请检查并重新启动服务器!");
//			}
//		}
//		
//		//创建amz促销文件下载目录
//		String amzFeedDownloadFolder=props.getProperty("system.path.download.amz.datafeeds.folder");
//		currFile = new File(amzFeedDownloadFolder);
//		if(currFile==null || !currFile.exists() || !currFile.isDirectory() ){
//			if(!currFile.mkdirs()){
//				System.out.println("创建亚马逊促销文件下载目录过程中发生错误，请检查并重新启动服务器!");
//			}
//		}
	}
	
	/**
	 * 获得上传文件物理路径
	 * @return
	 */
	public String getUploadFolder(){
		return props.getProperty("system.path.upload.file.folder");
	}
	
	/**
	 * 获得上传图片的物理根地址
	 * @return
	 */
	public String getImageFolder(){
		return props.getProperty("system.path.upload.image.folder"); 
	}
	
	/**
	 * 获得亚马逊促销文件的下载地址
	 * @return
	 */
	public String getAmzDatafeedsFolder(){
		return props.getProperty("system.path.download.amz.datafeeds.folder");
	}
	
	/**
	 * 获得Session存储模式
	 * @return
	 */
	public String getSessionStoreType(){
		return props.getProperty("system.session.storage.type");
	}
	
	public String getProperty(String key){
		return props.getProperty(key);
	}
}
