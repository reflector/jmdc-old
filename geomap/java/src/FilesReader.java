import java.io.*;
import java.util.HashMap;
import java.util.Map.Entry;
import java.util.Set;
import com.csvreader.CsvReader;

public class FilesReader {

	HashMap<String, Integer> countryFreqMap = new HashMap<String, Integer>();
	HashMap<String, String> countryCodeMap = new HashMap<String, String>();

	public HashMap<String, String> loadCountryCodes(String path)
			throws FileNotFoundException {

		CsvReader countryCodeReader = new CsvReader(new FileReader(path));

		try {

			while (countryCodeReader.readRecord()) {

				String[] values = countryCodeReader.getValues();
				String countrynames = values[0];
				String countryCode = values[1];

				countryCodeMap.put(countrynames, countryCode);
			}

			Set<Entry<String, String>> entrySet = countryCodeMap.entrySet();
			for (Entry<String, String> entry : entrySet) {
				System.out.println(entry.getKey() + " => " + entry.getValue());
			}

		} catch (IOException e1) {

			e1.printStackTrace();

		} finally {

			countryCodeReader.close();
		}

		return countryCodeMap;
	}

	public HashMap<String, Integer> loadCountryValues(String path,
			HashMap<String, String> countryCodeMap)
			throws FileNotFoundException {

		CsvReader countryFreqReader = new CsvReader(new FileReader(path));

		try {

			String country = null;

			while (countryFreqReader.readRecord()) {

				String[] values = countryFreqReader.getValues();
				country = values[2];
				country = country.trim();
				country = country.toUpperCase();

				if (countryCodeMap.containsKey(country)) {

					String key = countryCodeMap.get(country);

					if (countryFreqMap.containsKey(key)) {
						int i = countryFreqMap.get(key);
						countryFreqMap.put(key, i + 1);

					} else {
						countryFreqMap.put(key, 1);
					}
				} else {

					System.out.println("unknown country " + country);

				}
			}

			Set<Entry<String, Integer>> entrySet = countryFreqMap.entrySet();
			for (Entry<String, Integer> entry : entrySet) {
				System.out.println(entry.getKey() + " => " + entry.getValue());
			}

		} catch (IOException e) {

			e.printStackTrace();

		} finally {

			countryFreqReader.close();

		}

		return countryFreqMap;

	}
}
