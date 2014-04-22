import java.util.HashMap;
import java.io.*;
import java.util.Map.Entry;
import java.util.Set;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonWriter;

public class CreateJsonObject {

	JsonObjectBuilder buildObject = Json.createObjectBuilder();

	public JsonObject createJson(HashMap<String, Integer> countryFreqMap) {

		Set<Entry<String, Integer>> entrySet = countryFreqMap.entrySet();
		for (Entry<String, Integer> entry : entrySet) {
			buildObject.add(entry.getKey(), entry.getValue());
		}

		return buildObject.build();
	}

	public void writingJsonFile(String path) throws IOException {

		StringWriter stWriter = new StringWriter();
		JsonWriter jsonWriter = Json.createWriter(stWriter);
		jsonWriter.writeObject(buildObject.build());
		jsonWriter.close();

		String jsonData = stWriter.toString();

		FileWriter writer = new FileWriter(path);
		writer.write(jsonData);
		writer.close();

	}
}
