package com.social.stream;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;



import com.google.gson.Gson;
import com.icp.utils.DashDB;


public class SocialStream {
	public static ArrayList<String> sentimentsList = new ArrayList<String>();
	public static ArrayList<String> keywordsList = new ArrayList<String>();
	public static ArrayList<String> sourcesList = new ArrayList<String>();
	public static ArrayList<String> tonesList = new ArrayList<String>();
	public static ArrayList<String> locationsList = new ArrayList<String>();
	public static ArrayList<String> entitiesList = new ArrayList<String>();
	public static ArrayList<String> conceptsList = new ArrayList<String>();
	public static HashMap<String, String> keywordsMap = new HashMap<String, String>();
	public static HashMap<String, String> sourcesMap = new HashMap<String, String>();
	public static HashMap<String, String> sentimentsMap = new HashMap<String, String>();
	public static HashMap<String, String> tonesMap = new HashMap<String, String>();
	public static HashMap<String, String> locationsMap = new HashMap<String, String>();
	public static HashMap<String, String> entitiesMap = new HashMap<String, String>();
	public static HashMap<String, String> conceptsMap = new HashMap<String, String>();
	public static String responseJSON = null;
	public static ArrayList<String> posts = new ArrayList<String>();

	public static HashMap<String, String> getCountStream(ArrayList<String> list) {
		HashMap<String, String> result = new HashMap<String, String>();
		for (String value : list) {
			if (result.containsKey(value)) {
				int count = Integer.parseInt(result.get(value)) + 1;
				result.put(value, count + "");
			} else {
				result.put(value, "1");
			}
		}
		return result;
	}

	public static String getSocialResponse(String table) throws SQLException {
		DashDB db = new DashDB();
		SocialStream.responseJSON = "{\"sentiments\":" + new Gson().toJson(db.QueyryDB("sentiments",table)) + ",\"tones\":"
				+ new Gson().toJson(db.QueyryDB("tones",table)) + ",\"sources\":" + new Gson().toJson(db.QueyryDB("sources",table))
				+ ",\"locations\":" + new Gson().toJson(db.QueyryDB("location",table)) + ",\"entities\":"
				+ new Gson().toJson(db.QueyryDB("entities",table)) + ",\"keywords\":"
				+ new Gson().toJson(db.QueyryDB("keywords",table)) //+ ",\"entities_trends\":"
				//+ new Gson().toJson(db.getTrendAnalysis("entities")) + 
				//",\"concepts_trends\":"
				//+ new Gson().toJson(db.getTrendAnalysis("concepts")) + 
				+",\"concepts\":"
				+ new Gson().toJson(db.QueyryDB("concepts",table)) + ",\"content\":{\"body\":"
				+ new Gson().toJson(db.getSnippets(table)) + "}}";

		return SocialStream.responseJSON;

	}

	public static String getFilteredSocialResponse(String query, String querycol,String table) throws SQLException {
		DashDB db = new DashDB();
       
		/*SocialStream.responseJSON = "{\"sentiments\":" + new Gson().toJson(db.FilterDB("sentiments", query,querycol))
				+ ",\"tones\":" + new Gson().toJson(db.QueyryDB("tones")) + ",\"sources\":"
				+ new Gson().toJson(db.FilterDB("sources", query,querycol)) + ",\"locations\":"
				+ new Gson().toJson(db.QueyryDB("location")) + ",\"entities\":"
				+ new Gson().toJson(db.QueyryDB("entities")) + ",\"keywords\":"
				+ new Gson().toJson(db.QueyryDB("keywords")) + ",\"entities_trends\":"
				+ new Gson().toJson(db.getTrendAnalysis("entities")) + ",\"concepts_trends\":"
				+ new Gson().toJson(db.getTrendAnalysis("concepts")) + ",\"concepts\":"
				+ new Gson().toJson(db.QueyryDB("concepts")) + ",\"content\":{\"body\":"
				+ new Gson().toJson(db.getSnippets()) + "}}";
				*/
		HashMap<String, String> cols = new HashMap<String, String>();
		cols.put("sentiments", "sentiments");
		cols.put("tones", "tones");
		cols.put("sources", "sources");
		cols.put("locations", "location");
		cols.put("entities", "entities");
		cols.put("keywords", "keywords");
		//cols.put("entities_trends", "entities");
		cols.put("concepts", "concepts");
		//cols.put("concepts_trends", "concepts");
		@SuppressWarnings("rawtypes")
		Iterator it = cols.entrySet().iterator();
		String response = "";
		int counter = 0;
		while (it.hasNext()) {
			@SuppressWarnings("rawtypes")
			Map.Entry pair = (Map.Entry) it.next();
			if (counter == 0) {
				if(pair.getKey().toString().equals(querycol)){
				response = "{\"" + pair.getKey() + "\":" + new Gson().toJson(db.QueyryDB(pair.getValue().toString(),table));
				}else{
					response = "{\"" + pair.getKey() + "\":" + new Gson().toJson(db.FilterDB(pair.getValue().toString(),query,querycol,table));
				}
			} else {
				if (pair.getKey().toString().contains("trends")) {
					
					response = response + ",\"" + pair.getKey() + "\":"
							+ new Gson().toJson(db.getTrendAnalysis(pair.getValue().toString()));
					
				} 
				else if(pair.getKey().toString().equals(querycol)){
					response = response + ",\"" + pair.getKey() + "\":"
							+ new Gson().toJson(db.QueyryDB(pair.getValue().toString(),table));
				}
				else {
					response = response + ",\"" + pair.getKey() + "\":"
							+ new Gson().toJson(db.FilterDB(pair.getValue().toString(),query,querycol,table));
				}
			}
			counter++;
			
			it.remove(); // avoids a ConcurrentModificationException
		}
		
		response += ",\"content\":{\"body\":" + new Gson().toJson(db.getFilteredSnippets(query,querycol,table)) + "}}";
		System.out.println(response);
		return  response;

	}

	public static void main(String args[]) throws SQLException {
		
		
		
		//System.out.println(response);
	}

}
