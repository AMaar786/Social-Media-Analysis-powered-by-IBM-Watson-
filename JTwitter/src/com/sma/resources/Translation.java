package com.sma.resources;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.xml.sax.InputSource;




public class Translation {


	
	public Translation() {

	}


	public static String translate(String description, String sourceLanguageID, String targetLanguageID)
			throws IOException {

		String translated = "";
		String postString = "";
		URL obj = new URL(postString);

		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		con.setRequestMethod("GET");
		con.setRequestProperty("Accept-Charset", "UTF-8");

		BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));
		String inputLine;
		StringBuffer response = new StringBuffer();
		while ((inputLine = br.readLine()) != null) {
			response.append(inputLine);
		}
		br.close();
		DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = null;

		try {
			// client.execute(arg0)
			builder = builderFactory.newDocumentBuilder();
			Document document = builder.parse(new InputSource(new StringReader(response.toString())));
			XPath xPath = XPathFactory.newInstance().newXPath();
			String status = xPath.compile("/rep/@sts").evaluate(document);
			if (status.equalsIgnoreCase("ok")) {
				translated = (xPath.compile("/rep/docs/d[@lang='" + targetLanguageID + "']/p/s[1]/t")
						.evaluate(document)).toString();
				// System.out.println(translation[i]);
			} else {
				translated = description;
			}
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return translated;
	}

	public static String identify(String text) {
	/*	LanguageTranslator service = new LanguageTranslator();
		// service.setUsernameAndPassword(properties.getValue(ConstantLangTrans.USER_NAME),properties.getValue(ConstantLangTrans.PASSWORD));
		service.setUsernameAndPassword("c61a8668-6968-4832-8e3a-24110ddc2c82", "16N0HJlOUTmY");

		ServiceCall<List<IdentifiedLanguage>> langs = service.identify(text);
		List<IdentifiedLanguage> langIds = langs.execute();
		System.out.println(langIds);
		JSONArray jArray = new JSONArray(langIds.toString());
		JSONObject jObj = (JSONObject) jArray.get(0);
		String lang = jObj.get("language").toString();
		return lang; */
		return null;
	}

	public static String translateRomanWord(String word) throws IOException {
		String postString = "http://ec2-54-244-107-215.us-west-2.compute.amazonaws.com/Transliterate/TransliterateWord";
		URL obj = new URL(postString);
		byte[] postData = ("=" + word).getBytes(StandardCharsets.UTF_8);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		con.setRequestMethod("POST");
		con.setRequestProperty("Accept-Charset", "UTF-8");
		con.setRequestProperty("content-type", "application/x-www-form-urlencoded");
		con.setRequestProperty("Content-Length", Integer.toString(word.length()));
		con.setUseCaches(false);
		con.setDoOutput(true);
		try (DataOutputStream wr = new DataOutputStream(con.getOutputStream())) {
			wr.write(postData);
		}

		BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));
		String inputLine;
		StringBuffer response = new StringBuffer();
		String s = "";
		String[] ls;
		while ((inputLine = br.readLine()) != null) {
			System.out.println(response.append(inputLine));
			s = inputLine.replace("\"", "").replace("]", "").replace("[", "");
		}
		br.close();
		ls = s.split(",");
		return ls[0].toString();
	}

	public static String translateRoman(String query) throws IOException {

		String[] sArr = query.split(" ");
		String translated = "";

		for (int i = 0; i < sArr.length; i++) {

			translated += translateRomanWord(sArr[i].toString()) + " ";

		}

		return translated;
	}

	public static void main(String[] args) throws IOException {
		String text = "kya ap pagal hain?";
		String urdu = Translation.translateRoman(text);
		Translation.translateGoogle(urdu, "ur", "en");
	}

	public static String translateRomanGoogle(String query) throws IOException {
		String postString = "https://inputtools.google.com/request?text=" + URLEncoder.encode(query, "UTF-8")
				+ "&itc=ur-t-i0-und";
		URL obj = new URL(postString);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		con.setRequestMethod("GET");
		con.setRequestProperty("Accept-Charset", "UTF-8");
		con.setRequestProperty("content-type", "application/x-www-form-urlencoded");
		con.setUseCaches(false);
		con.setDoOutput(true);
		BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));
		String inputLine;
		StringBuffer response = new StringBuffer();
		String s = "";
		String[] ls;
		while ((inputLine = br.readLine()) != null) {
			System.out.println(response.append(inputLine));
			s = inputLine.replace("\"", "").replace("]", "").replace("[", "");
		}
		br.close();
		try {
			ls = s.split(",");
			return ls[2].toString();
		} catch (Exception e) {
			return "";
		}

	}

	public static String translateGoogle(String query, String source, String target) {
		try {
			String word = "async=translate,sl:" + source + ",tl:" + target + ",st:" + URLEncoder.encode(query, "UTF-8")
					+ ",id:1483510327994,qc:true,ac:false,_id:tw-async-translate,_pms:s";
			String postString = "https://www.google.co.uk/async/translate?vet=10ahUKEwiylajI6qfRAhWnDcAKHbZtAZwQqDgILjAA..i&ei=JZJsWPLuM6ebgAa224XgCQ&yv=2&bvm=bv.142059868,d.bGg";
			URL obj;
			obj = new URL(postString);
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
			con.setRequestMethod("POST");
			con.setRequestProperty("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
			con.setUseCaches(false);
			con.setDoOutput(true);
			byte[] postData = (word).getBytes(StandardCharsets.UTF_8);
			try (DataOutputStream wr = new DataOutputStream(con.getOutputStream())) {
				wr.write(postData);
			}
			BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));

			
			String s = "";
			String[] ls;
			String inputLine = br.readLine();
			System.out.println(inputLine.length());
			System.out.println(inputLine);
			int b = inputLine.indexOf("\\u003C\\/span\\u003E\\u003Cspan");
			System.out.println(b);
			s = inputLine.substring(inputLine.indexOf("id=\\\"tw-answ-target-text\\\"\\u003E") + 32);
			s = s.substring(0, s.indexOf("\\u003C\\/span\\u003E\\u003Cspan"));
			System.out.println(s);
			br.close();
			ls = s.split(";");

			String[] arr = s.split(";");
			String urdu = "";
			if (target == "ur") {
				for (int i = 0; i < arr.length; i++) {
					if (arr[i].toString().contains(" ")) {
						String sss = arr[i].toString().replace("#", "").replace("&", "").replace(" ", "")
								.replace("\"", "").replace("\\", "").replace("[", "").replace("]", "");
						try {
							int hexVal = Integer.parseInt(sss);
							urdu += " " + (char) hexVal;
						} catch (Exception e) {
						}
					} else {
						try {
							int hexVal = Integer.parseInt(arr[i].toString().replace("#", "").replace("&", "")
									.replace("\"", "").replace("\\", "").replace("[", "").replace("]", ""));
							urdu += (char) hexVal;
						} catch (Exception e) {
						}

					}
				}
				
				return urdu;
			}

			return s;
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		return "";

	}

}