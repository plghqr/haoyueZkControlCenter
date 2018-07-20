package com.sh.haoyue.dc;

import java.io.Serializable;
import java.util.List;

/**
 * 适用于ztree格式描述的zookeeper节点基本属性
 * @author E430
 *
 */
public class ZookeeperNode implements Serializable{
	private static final long serialVersionUID = 1425438090668677099L;

	/**
	 * 节点名称 
	 */
	private String name;
	
	/**
	 * 节点全路径
	 */
	private String fullPath;
	
	/**
	 * 是否父节点(有子节点则为父节点,否则叶子节点)
	 */
	private Boolean isParent=false;
	
	/**
	 * 当前节点是否打开(缺省不打开)
	 */
	private Boolean open=false;
	
	/**
	 * 子节点
	 */
	private List<ZookeeperNode> children;
	
	/**
	 * 子节点个数
	 */
	private Integer childCount;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getFullPath() {
		return fullPath;
	}

	public void setFullPath(String fullPath) {
		this.fullPath = fullPath;
	}

	public Boolean getIsParent() {
		return isParent;
	}

	public void setIsParent(Boolean isParent) {
		this.isParent = isParent;
	}

	public Boolean getOpen() {
		return open;
	}

	public void setOpen(Boolean open) {
		this.open = open;
	}

	public List<ZookeeperNode> getChildren() {
		return children;
	}

	public void setChildren(List<ZookeeperNode> children) {
		this.children = children;
	}

	public Integer getChildCount() {
		return childCount;
	}

	public void setChildCount(Integer childCount) {
		this.childCount = childCount;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
}
