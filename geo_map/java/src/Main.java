public class Main {

	private static final String DATA_COUNTRY_CODES_CSV = "data/country_codes.csv";
	private static final String DATA_DUMMY_CONTACTS_CSV = "data/dummy_contacts.csv";
	private static final String DATA_COUNTRIES_FREQ_JSON = "../web/js/countries_freq.json";

	public static void main(String[] args) throws Exception {

		FilesReader read = new FilesReader();

		JsonObjectCreator jsonObject = new JsonObjectCreator();

		read.loadCountryCodes(DATA_COUNTRY_CODES_CSV);

		jsonObject.createJson(read.loadCountryValues(DATA_DUMMY_CONTACTS_CSV,
				read.loadCountryCodes(DATA_COUNTRY_CODES_CSV)));

		jsonObject.writingJsonFile(DATA_COUNTRIES_FREQ_JSON);

	}

}
