import java.util.HashMap;
import java.io.*;
import java.util.Map.Entry;
import java.util.Set;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonWriter;

public class JsonObjectCreator {

	JsonArrayBuilder buildArray = Json.createArrayBuilder();

	public JsonArray createJson(HashMap<String, Integer> countryFreqMap) {

		Set<Entry<String, Integer>> entrySet = countryFreqMap.entrySet();
		for (Entry<String, Integer> entry : entrySet) {
			buildArray.add(Json.createObjectBuilder().add("id", entry.getKey())
					.add("frequency", entry.getValue()));
		}

		return buildArray.build();

	}

	public void writingJsonFile(String path) throws IOException {

		StringWriter stWriter = new StringWriter();
		JsonWriter jsonWriter = Json.createWriter(stWriter);
		jsonWriter.writeArray(buildArray.build());
		jsonWriter.close();

		String jsonData = stWriter.toString();

		FileWriter writer = new FileWriter(path);
		writer.write(jsonData);
		writer.close();

	}
}
