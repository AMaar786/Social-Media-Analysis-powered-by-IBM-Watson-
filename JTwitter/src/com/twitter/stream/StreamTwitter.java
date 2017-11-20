package com.twitter.stream;

import twitter4j.FilterQuery;
import twitter4j.StallWarning;
import twitter4j.Status;
import twitter4j.StatusDeletionNotice;
import twitter4j.StatusListener;
import twitter4j.TwitterStream;
import twitter4j.TwitterStreamFactory;
import twitter4j.conf.ConfigurationBuilder;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.HashMap;
import com.facebook.stream.FacebookStream;
import com.ibm.alchemy.*;
import com.icp.utils.DashDB;
import com.sma.resources.Translation;


public class StreamTwitter {
	public static Boolean stream_status = false;
	private static HashMap<String,String> twitterRow;
	private DashDB db = new DashDB(); 
	public void startStream() {
		ConfigurationBuilder cb = new ConfigurationBuilder();
		cb.setDebugEnabled(true);
		cb.setOAuthConsumerKey("pClPTcVOBhGYhnKJdRE0lPMfB");
		cb.setOAuthConsumerSecret("4Y8L7rOKBT9HoSYw0egIn0yOj28VHOqkCv5stZACMNUuhfHQDO");
		cb.setOAuthAccessToken("859169870-jeTTX7ZeWqymuuG8IH09VsDENCNgCzBVIxEIpUBr");
		cb.setOAuthAccessTokenSecret("3guk38rTMcSrtfcJ3XZQrHrTrVyb2UplRjnmkCFUlZMbM");

		TwitterStream twitterStream = new TwitterStreamFactory(cb.build()).getInstance();
		//twitterStream.cleanUp();
		//twitterStream.shutdown();
		StatusListener listener = new StatusListener() {
			private AlchemyAnalysis serviceAlchemy = null;

			@Override
			public void onException(Exception arg0) {
				// TODO Auto-generated method stub

			}

			@Override
			public void onDeletionNotice(StatusDeletionNotice arg0) {
				// TODO Auto-generated method stub

			}

			@Override
			public void onScrubGeo(long arg0, long arg1) {
				// TODO Auto-generated method stub

			}

			@Override
			public void onStatus(Status status) {
				String content = status.getText();
				if (!FacebookStream.identifyLanguage(content).equals("en")) {
					String urdu_content = "";
					try {
						urdu_content = Translation.translateRoman(status.getText());
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					System.out.println(urdu_content);
					content = Translation.translateGoogle(urdu_content, "ur", "en");
				}
				if (FacebookStream.identifyLanguage(content).equals("en")) {
					// User user = status.getUser();
					// gets Username
					// String username = status.getUser().getScreenName();
					// System.out.println(username);
					// String profileLocation = user.getLocation();
					// System.out.println(profileLocation);
					// long tweetId = status.getId();
					// System.out.println(tweetId);
					
					serviceAlchemy = new AlchemyAnalysis(content);
					String tone = serviceAlchemy.getTone();
					String sentiment = serviceAlchemy.getSentiment();
					twitterRow = new HashMap<String, String>();
					twitterRow.put("sentiment", sentiment);
					twitterRow.put("tone", tone);
					twitterRow.put("sources", "twitter");
					twitterRow.put("location", "pakistan");
					
					twitterRow.put("snippet", content);
					java.util.Date utilDate = status.getCreatedAt();
					Calendar cal = Calendar.getInstance();
					cal.setTime(utilDate);
					cal.set(Calendar.MILLISECOND, 0);
						
					
					twitterRow.put("datatime", new java.sql.Timestamp(utilDate.getTime()).toString());
					System.out.println(new java.sql.Timestamp(utilDate.getTime()).toString());
					try{
					String entity = serviceAlchemy.extractEntities();
					twitterRow.put("entity", entity);
					String keyword = serviceAlchemy.extractKeywords();
					twitterRow.put("keyword", keyword);
					
					String concept = serviceAlchemy.extractConcepts();
					twitterRow.put("concept", concept);
					
					}catch(Exception e){
						e.printStackTrace();
					}
					twitterRow.put("link", "https://twitter.com/" + status.getUser().getScreenName() 
						    + "/status/" + status.getId());
					try {
						db.insertRow(twitterRow);
					} catch (SQLException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
				}
			}

			@Override
			public void onTrackLimitationNotice(int arg0) {
				// TODO Auto-generated method stub

			}

			@Override
			public void onStallWarning(StallWarning arg0) {
				// TODO Auto-generated method stub

			}
		};
		FilterQuery fq = new FilterQuery();

		String keywords[] = { "Allied Aasan Account",	"Abl credit",	"allied islami",	"Allied Bank",	"abl asan account",	"allied debit card",	"alied islamic branch",	"Alied Bank",	"allied asan account",	"allied dabit",	"alied islamic branches",	"Allied Bunk",	"allied asaan",	"allied atm",	"allied loan",	"ABLPk",	"allied asan",	"alied atm",	"allie finance",	"alliedbankpk",	"allied khanum",	"abl-atm",	"allied fiances",	"a.b.l",	"allied expres",	"abl atm",	"abl account",	"Allied lahore",	"allied express",	"abl credit",	"abl card",	"Allied Direct",	"alied express",	"abl debit",	"allied paybak",	"abl internet banking",	"Allied Rising Star",	"allied branches",	"abl paypak",	"abl internat banking",	"allied pay anyone",	"allied branch",	"abl tvc",	"abl netbanking",	"allied payanyone",	"alied branch",	"abl tv ad",	"abl app",	"allied visa card",	"alied branches",	"abl video",	"abl mobile",	"alied atm card",	"allied islamic branch",	"abl branch",	"abl mobile app",	"allied credit card",	"allied islamic bank",	"Allied internet banking",	"Abl credit",	"allied ismaly", };

		fq.track(keywords);

		twitterStream.addListener(listener);
		twitterStream.filter(fq);
		stream_status = true;
	}

	public Boolean getStreamStatus() {
		return stream_status;
	}

	public static void main(String args[]) {
		new StreamTwitter().startStream();
	}
}