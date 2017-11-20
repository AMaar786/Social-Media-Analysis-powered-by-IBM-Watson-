package com.facebook.stream;

import java.io.IOException;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.TimeZone;



import com.ibm.alchemy.AlchemyAnalysis;
import com.ibm.watson.developer_cloud.http.ServiceCall;
import com.ibm.watson.developer_cloud.language_translator.v2.LanguageTranslator;
import com.icp.utils.DashDB;
import com.restfb.Connection;
import com.restfb.DefaultFacebookClient;
import com.restfb.FacebookClient;
import com.restfb.Parameter;
import com.restfb.Version;
import com.restfb.types.Post;
import com.sma.resources.Translation;

import twitter4j.internal.org.json.JSONArray;
import twitter4j.internal.org.json.JSONException;
import twitter4j.internal.org.json.JSONObject;


public class FacebookStream extends Restfb {
	/**
	 * RestFB Graph API client.
	 */
	private static AlchemyAnalysis serviceAlchemy = null;
	private static FacebookClient facebookClient23;
	public static HashMap<String, String> facebookRow = new HashMap<String, String>();
	public static Date timeStamp;
	public static DashDB db = new DashDB();

	static Runnable periodicTask;
	public FacebookStream(){}
	public FacebookStream(String accessToken) {
		facebookClient23 = new DefaultFacebookClient(accessToken, Version.VERSION_2_3);
	}

	void runEverything() throws JSONException, ParseException, SQLException, IOException {
		search();
	}

	public void search() throws JSONException, ParseException, SQLException, IOException {
		System.out.println("searching...");

		Calendar cal = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat("EEE MMM dd HH:mm:ss 'UTC' yyyy");
		String oldTime = null;
		try {
			oldTime = db.getTimeStamp("1");
			System.out.println(oldTime);
			//TimeZone pakistan = TimeZone.getTimeZone("Asia/Karachi");
			TimeZone pakistan = TimeZone.getTimeZone("UTC");
			// set the time zone to the date format
			sdf.setTimeZone(pakistan);
			// print the date to the console

			cal.setTime(sdf.parse(oldTime));
			cal.add(Calendar.SECOND, 1);
			System.out.println(cal.getTime().toString());
			db.updateTimeStamp("1", cal.getTime().toString());

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		Connection<Post> page = facebookClient23.fetchConnection("alliedbanklimited" + "/feed", Post.class,
				Parameter.with("limit", 99), Parameter.with("since", sdf.parse(oldTime)));
System.out.println(page.toString());
		List<Post> post = page.getData();
	
		for (Post status : post) {
	System.out.println(post);
			String content = status.getMessage();
			if (!FacebookStream.identifyLanguage(status.getMessage()).equals("en")) {
				String urdu_content = Translation.translateRoman(status.getMessage());
				System.out.println(urdu_content);
				content = Translation.translateGoogle(urdu_content, "ur", "en");
			}
			if (status.getMessage() != null && FacebookStream.identifyLanguage(content).equals("en")) {
				
				serviceAlchemy = new AlchemyAnalysis(content);
				db.updateTimeStamp("1", status.getCreatedTime().toString());
				String tone = serviceAlchemy.getTone();
				String sentiment = serviceAlchemy.getSentiment();
				facebookRow = new HashMap<String, String>();
				facebookRow.put("sentiment", sentiment);
				facebookRow.put("tone", tone);
				facebookRow.put("sources", "facebook");
				facebookRow.put("location", "pakistan");
				java.util.Date utilDate = status.getCreatedTime();

				facebookRow.put("datatime", new java.sql.Timestamp(utilDate.getTime()).toString());

				facebookRow.put("snippet", content);

				String entity = serviceAlchemy.extractEntities();
				facebookRow.put("entity", entity);
				String keyword = serviceAlchemy.extractKeywords();
				facebookRow.put("keyword", keyword);

				String concept = serviceAlchemy.extractConcepts();
				facebookRow.put("concept", concept);
				facebookRow.put("link", status.getLink());
				db.insertRow(facebookRow);

			}
			else
			{
				if(content.length()>1){
					db.updateTimeStamp("1", status.getCreatedTime().toString());
				}
			}
		}
	}

	public static String identifyLanguage(String text) {
		String lang = null;
		LanguageTranslator service = new LanguageTranslator();
		service.setUsernameAndPassword("c61a8668-6968-4832-8e3a-24110ddc2c82", "16N0HJlOUTmY");

		ServiceCall<List<com.ibm.watson.developer_cloud.language_translator.v2.model.IdentifiedLanguage>> langs = service
				.identify(text);
		List<com.ibm.watson.developer_cloud.language_translator.v2.model.IdentifiedLanguage> langIds = langs.execute();

		JSONArray jArray;
		try {
			jArray = new JSONArray(langIds.toString());
			JSONObject jObj = (JSONObject) jArray.get(0);
			lang = jObj.get("language").toString();

		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return lang;
	}
}
