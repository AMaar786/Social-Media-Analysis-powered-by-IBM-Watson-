package com.ibm.alchemy;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.ibm.watson.developer_cloud.alchemy.v1.AlchemyLanguage;
import com.ibm.watson.developer_cloud.alchemy.v1.model.Concepts;
import com.ibm.watson.developer_cloud.alchemy.v1.model.DocumentEmotion;
import com.ibm.watson.developer_cloud.alchemy.v1.model.DocumentSentiment;
import com.ibm.watson.developer_cloud.alchemy.v1.model.Entities;
import com.ibm.watson.developer_cloud.alchemy.v1.model.Keywords;
import com.ibm.watson.developer_cloud.http.ServiceCall;
import com.icp.utils.DashDB;


public class AlchemyAnalysis {
	private static final String client = "abl";
	private AlchemyLanguage serviceAlchemy = null;
	private String current_text = null;
	private DashDB db;

	public AlchemyAnalysis() {
	}

	public AlchemyAnalysis(String current_text) {
		serviceAlchemy = new AlchemyLanguage();
		this.executeCredentialsPolicy();
		this.current_text = current_text;
		this.db = new DashDB();
	}

	public String getTone() {

		String tone = null;
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(AlchemyLanguage.TEXT, this.current_text);
		ServiceCall<DocumentEmotion> emotion = serviceAlchemy.getEmotion(params);
		JsonParser parser = new JsonParser();
		JsonObject emotionResponse = (JsonObject) parser.parse(emotion.execute().toString());
		JsonObject docEmotions = emotionResponse.get("docEmotions").getAsJsonObject();
		double highest_score = 0.0;

		for (Map.Entry<String, JsonElement> entry : docEmotions.entrySet()) {
			Double emotionScore = entry.getValue().getAsDouble();
			if (emotionScore > highest_score) {
				highest_score = emotionScore;
				tone = entry.getKey();
			}

		}

		return tone;
	}

	public String getSentiment() {

		String sentiment = null;
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(AlchemyLanguage.TEXT, this.current_text);
		ServiceCall<DocumentSentiment> docSentiment = serviceAlchemy.getSentiment(params);
		JsonParser parser = new JsonParser();
		JsonObject sentimentResponse = (JsonObject) parser.parse(docSentiment.execute().toString());
		JsonObject mainSentiment = sentimentResponse.get("docSentiment").getAsJsonObject();
		sentiment = mainSentiment.get("type").getAsString();
		return sentiment;
	}

	public String extractEntities()  {
		String entity = "";
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(AlchemyLanguage.TEXT, this.current_text);
		ServiceCall<Entities> docEntities = serviceAlchemy.getEntities(params);
		JsonParser parser = new JsonParser();
		JsonObject EntitiesResponse = (JsonObject) parser.parse(docEntities.execute().toString());
		JsonArray mainEntities = EntitiesResponse.get("entities").getAsJsonArray();
		for (int i = 0; i < mainEntities.size(); i++) {
			if (!mainEntities.get(i).getAsJsonObject().get("text").getAsString().toLowerCase().contains("keyword")) {
				try{
				boolean isStopword = db.isStopWord(AlchemyAnalysis.client,
						mainEntities.get(i).getAsJsonObject().get("text").getAsString());
				
				if (isStopword == false) {
					entity = mainEntities.get(i).getAsJsonObject().get("text").getAsString();
					break;
				}
}catch(Exception e){
					
				}

			}
		}

		return entity;
	}

	public String extractKeywords() throws SQLException {
		String keyword = "";
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(AlchemyLanguage.TEXT, this.current_text);
		ServiceCall<Keywords> docKeywords = serviceAlchemy.getKeywords(params);
		JsonParser parser = new JsonParser();
		JsonObject KeywordsResponse = (JsonObject) parser.parse(docKeywords.execute().toString());
		JsonArray mainKeywords = KeywordsResponse.get("keywords").getAsJsonArray();
		for (int i = 0; i < mainKeywords.size(); i++) {
			if (!mainKeywords.get(i).getAsJsonObject().get("text").getAsString().toLowerCase().contains("keyword")
					&& !mainKeywords.get(i).getAsJsonObject().get("text").getAsString().toLowerCase().contains("\\n")
					&& !mainKeywords.get(i).getAsJsonObject().get("text").getAsString().toLowerCase().contains("\\")
					&& !mainKeywords.get(i).getAsJsonObject().get("text").getAsString().toLowerCase().contains("]")) {
				try{
				boolean isStopword = db.isStopWord(AlchemyAnalysis.client,
						mainKeywords.get(i).getAsJsonObject().get("text").getAsString());
				if (isStopword == false) {
					keyword = mainKeywords.get(i).getAsJsonObject().get("text").getAsString();
					break;
				}
}catch(Exception e){
					
				}
			}
		}
		return keyword;
	}

	public String extractConcepts() throws SQLException {
		String concept = "";

		Map<String, Object> params = new HashMap<String, Object>();
		params.put(AlchemyLanguage.TEXT, this.current_text);
		ServiceCall<Concepts> docConcepts = serviceAlchemy.getConcepts(params);
		JsonParser parser = new JsonParser();
		JsonObject ConceptsResponse = (JsonObject) parser.parse(docConcepts.execute().toString());
		JsonArray mainConcepts = ConceptsResponse.get("concepts").getAsJsonArray();
		for (int i = 0; i < mainConcepts.size(); i++) {
			try{
			boolean isStopword = db.isStopWord(AlchemyAnalysis.client,
					mainConcepts.get(i).getAsJsonObject().get("text").getAsString());
			if (isStopword == false) {
				concept = mainConcepts.get(i).getAsJsonObject().get("text").getAsString();
				break;
			}
			}catch(Exception e){
				
			}
		}
		return concept;
	}

	public void executeCredentialsPolicy() {
		// serviceAlchemy.setApiKey("a3ba651066e45ab8dbb72ebaf8286095502c4ca9");
		// serviceAlchemy.setApiKey("3820b1a8559220db68e58694356924d373fcc6f9");
		// serviceAlchemy.setApiKey("405177125d5cc320871291f0eadbfbc822659248");

		/** -- licensed key -- **/
		serviceAlchemy.setApiKey("d46c31c075c63cba25a03cfbb709f15d3af305c4");

	}
}