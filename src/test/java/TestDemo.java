import java.util.UUID;

public class TestDemo {
	public static void main(String[] args) {
		System.out.println( UUID.randomUUID().toString() );
		
		String childPath="/test/user/aaa/";
		if(childPath.startsWith("/")) {
			childPath=childPath.substring(1);
		}
		if(childPath.endsWith("/")) {
			childPath=childPath.substring(0,childPath.length()-1);
		}
		
		int lastIndex = childPath.lastIndexOf("/");
		String parentPath=childPath.substring(0,lastIndex);
		
		System.out.println( childPath );
		System.out.println( parentPath );
	}
}
