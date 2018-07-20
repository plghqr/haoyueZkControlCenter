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
		System.out.println(childPath);
	}
}
