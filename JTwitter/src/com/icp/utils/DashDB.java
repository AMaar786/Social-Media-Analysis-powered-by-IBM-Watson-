package com.icp.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;

public class DashDB {
	public Connection connectToDB() {

		Connection conn = null;
		try {
			Class.forName("com.ibm.db2.jcc.DB2Driver");
			conn = DriverManager.getConnection(
					"jdbc:db2://dashdb-entry-yp-dal09-08.services.dal.bluemix.net:50001/BLUDB:user=dash5910;password=c205894a61e0;sslConnection=true;");
		}

		catch (Exception e) {
			// e.printStackTrace();
		}

		return conn;

	}

	public HashMap<String, String> QueyryDB(String column, String table) throws SQLException {
		HashMap<String, String> result = new HashMap<String, String>();
		Statement stmt = null;
		Connection conn = new DashDB().connectToDB();
		stmt = conn.createStatement();
		stmt.setEscapeProcessing(false);
		String sql;
		sql = "SELECT \"" + column + "\",count(\"" + column + "\")  FROM \"" + table + "\" group by \"" + column
				+ "\" ";

		ResultSet rs = stmt.executeQuery(sql);

		while (rs.next()) {
			// Retrieve by column name
			try {
				result.put(rs.getString(1), rs.getString(2));

			} catch (Exception exp) {
				continue;
			}
		}

		return result;

	}

	public HashMap<String, String> FilterDB(String column, String query, String querycol, String table)
			throws SQLException {
		HashMap<String, String> result = new HashMap<String, String>();
		Statement stmt = null;
		Connection conn = new DashDB().connectToDB();
		stmt = conn.createStatement();
		stmt.setEscapeProcessing(false);
		String sql;
		sql = "SELECT \"" + column + "\",count(\"" + column + "\")  FROM \"" + table + "\" " + " where " + query
				+ " group by \"" + column + "\"";
		System.out.println(sql);
		ResultSet rs = stmt.executeQuery(sql);

		while (rs.next()) {
			// Retrieve by column name
			try {
				result.put(rs.getString(1), rs.getString(2));

			} catch (Exception exp) {
				continue;
			}
		}

		return result;

	}

	public HashMap<String, ArrayList<Integer>> getTrendAnalysis(String column) throws SQLException {
		ArrayList<String> col1 = new ArrayList<String>();
		ArrayList<String> col2 = new ArrayList<String>();
		Statement stmt = null;
		Connection conn = new DashDB().connectToDB();
		stmt = conn.createStatement();
		stmt.setEscapeProcessing(false);
		String sql1;
		sql1 = "SELECT distinct Extract (MONTH FROM TRIM(SUBSTR(\"datatime\",1,10))) FROM \"abl\" order by Extract (MONTH FROM TRIM(SUBSTR(\"datatime\",1,10))) ";

		ResultSet rs = stmt.executeQuery(sql1);

		while (rs.next()) {
			// Retrieve by column name
			try {
				col1.add(rs.getString(1));

			} catch (Exception exp) {
				continue;
			}

		}
		String sql3;
		sql3 = "SELECT distinct \"" + column + "\" FROM \"abl\" ";

		ResultSet rs3 = stmt.executeQuery(sql3);

		while (rs3.next()) {
			// Retrieve by column name
			try {
				col2.add(rs3.getString(1));

			} catch (Exception exp) {
				continue;
			}

		}

		int counter = 0;
		String sql2;
		sql2 = "select \"" + column + "\",  Extract (MONTH FROM TRIM(SUBSTR(\"datatime\",1,10))) as \"month\",count(\""
				+ column + "\") as \"concepts_count\" from RSMA group by \"" + column
				+ "\",Extract (MONTH FROM TRIM(SUBSTR(\"datatime\",1,10))) order by Extract (MONTH FROM TRIM(SUBSTR(\"datatime\",1,10))) asc";
		Statement stmt2 = null;
		stmt2 = conn.createStatement();
		ResultSet rs2 = stmt2.executeQuery(sql2);
		ArrayList<HashMap<String, String>> records = new ArrayList<HashMap<String, String>>();
		HashMap<String, String> record = new HashMap<String, String>();
		while (rs2.next()) {
			try {

				if (rs2.getString(2).equals(col1.get(counter))) {
					record.put(rs2.getString(1), rs2.getString(3));

				} else {
					counter++;
					records.add(record);
					record = new HashMap<String, String>();
					record.put(rs2.getString(1), rs2.getString(3));
				}

			} catch (Exception exp) {
				continue;
			}
		}
		if (record.size() > 0) {
			records.add(record);
		}
		// inserting zeroes for non existing values
		for (int i = 0; i < col1.size(); i++) {
			for (int j = 0; j < col2.size(); j++) {
				if (records.get(i).containsKey(col2.get(j))) {
					continue;
				} else {
					records.get(i).put(col2.get(j), "0");
				}
			}
		}
		HashMap<String, ArrayList<Integer>> trends = new HashMap<String, ArrayList<Integer>>();
		for (int j = 0; j < col2.size(); j++) {
			ArrayList<Integer> counts = new ArrayList<Integer>();
			for (int i = 0; i < col1.size(); i++) {
				counts.add(Integer.parseInt(records.get(i).get(col2.get(j))));
			}
			trends.put(col2.get(j), counts);
		}
		ArrayList<Integer> months_final = new ArrayList<Integer>();
		for (int i = 0; i < col1.size(); i++) {
			months_final.add(Integer.parseInt(col1.get(i)));
		}
		trends.put("trend_label_months", months_final);
		return trends;

	}

	public ArrayList<String> getSnippets(String table) throws SQLException {
		Connection conn = new DashDB().connectToDB();
		Statement stmt = null;
		stmt = conn.createStatement();
		ArrayList<String> result = new ArrayList<String>();
		String sql;
		sql = "SELECT distinct \"snippet\",\"sources\",\"url\"  FROM \"" + table + "\" ";
		System.out.println(sql);
		ResultSet rs = stmt.executeQuery(sql);

		while (rs.next()) {
			// Retrieve by column name
			try {
				if (rs.getString(2).equals("blog")) {
					result.add(rs.getString(1).substring(0, 136) + "..." + " link: " + rs.getString(3) + " ("
							+ rs.getString(2) + ")");
				} else {
					result.add(rs.getString(1) + " link:" + rs.getString(3) + " (" + rs.getString(2) + ")");
				}

			} catch (Exception exp) {
				continue;
			}
		}
		return result;
	}

	public ArrayList<String> getFilteredSnippets(String query, String querycol, String table) throws SQLException {
		Connection conn = new DashDB().connectToDB();
		Statement stmt = null;
		stmt = conn.createStatement();
		ArrayList<String> result = new ArrayList<String>();
		String sql;
		sql = "SELECT distinct \"snippet\",\"sources\",\"url\"  FROM \"" + table + "\" where " + query;
		System.out.println(sql);
		ResultSet rs = stmt.executeQuery(sql);

		while (rs.next()) {
			// Retrieve by column name
			try {
				if (rs.getString(2).equals("blog")) {
					result.add(rs.getString(1).substring(0, 136) + "..." + " link: " + rs.getString(3) + " ("
							+ rs.getString(2) + ")");
				} else {
					result.add(rs.getString(1) + " link:" + rs.getString(3) + " (" + rs.getString(2) + ")");
				}

			} catch (Exception exp) {
				continue;
			}
		}
		System.out.println(result.toString());
		return result;
	}

	public String getTimeStamp(String id) throws SQLException {
		String timeStampDB = null;
		Connection conn = new DashDB().connectToDB();
		Statement stmt = null;
		stmt = conn.createStatement();

		String sql;
		sql = "SELECT  \"last_queried\"  FROM  \"last_queried\" ";
		ResultSet rs = stmt.executeQuery(sql);

		while (rs.next()) {
			// Retrieve by column name
			try {
				timeStampDB = rs.getString("last_queried");

			} catch (Exception exp) {

			}
		}

		return timeStampDB;
	}

	public void updateTimeStamp(String id, String timeStamp) throws SQLException {
		Connection conn = new DashDB().connectToDB();
		String sql;
		sql = "update \"last_queried\" set \"last_queried\" = \'" + timeStamp + "\' where \"id\"=\'" + id + "\'";
		PreparedStatement stmt = conn.prepareStatement(sql);
		int rs = stmt.executeUpdate();
		if (rs == 1) {

			System.out.println("timestamp updated...");
		}

	}

	public void insertRow(HashMap<String, String> row) throws SQLException {

		Connection conn = new DashDB().connectToDB();
		String sql;
		// sql = "INSERT INTO
		// \"abl\"(\"location\",\"sentiments\",\"tones\",\"datatime\",\"snippet\",\"sources\",\"entities\",\"keywords\",\"concepts\",\"links\")
		// VALUES (?,?,?,?,?,?,?,?,?,?)";
		sql = "INSERT INTO \"abl\"(\"location\",\"sentiments\",\"tones\",\"datatime\",\"snippet\",\"sources\",\"entities\",\"keywords\",\"concepts\",\"url\")  VALUES (?,?,?,?,?,?,?,?,?,?)";
		PreparedStatement stmt = conn.prepareStatement(sql);
		stmt.setString(1, row.get("location"));
		stmt.setString(2, row.get("sentiment"));
		stmt.setString(3, row.get("tone"));
		stmt.setString(4, row.get("datatime"));
		String snippet = null;
		if (row.get("snippet").length() > 8000) {
			snippet = row.get("snippet").substring(0, 8000);
		} else {
			snippet = row.get("snippet");
		}
		stmt.setString(5, snippet);
		stmt.setString(6, row.get("sources"));
		stmt.setString(7, row.get("entity"));
		stmt.setString(8, row.get("keyword"));
		stmt.setString(9, row.get("concept"));
		stmt.setString(10, row.get("link"));
		int rs = stmt.executeUpdate();

		System.out.println("row inserted" + rs);
	}

	public String getAuthentication(String username, String password) throws SQLException {
		String response = "";
		Connection conn = new DashDB().connectToDB();
		Statement stmt = null;
		stmt = conn.createStatement();

		String sql;
		sql = "SELECT  \"client_info\",\"clientname\",\"password\"  FROM  \"clients\" where \"clientname\"=\'"
				+ username + "\' and \"password\"= \'" + password + "\' ";
		ResultSet rs = stmt.executeQuery(sql);

		if (rs.next()) {
			// Retrieve by column name
			try {

				response = "{\"auth\":\"true\",\"client_info\":\"" + rs.getString("client_info") + "\"}";
			} catch (Exception exp) {
				exp.printStackTrace();
			}
		} else {
			response = "{\"auth\":\"false\"}";

		}

		return response;
	}

	public boolean isStopWord(String table, String word) throws SQLException {
		boolean isStopWord = false;
		Connection conn = new DashDB().connectToDB();
		Statement stmt = null;
		stmt = conn.createStatement();

		String sql;
		sql = "SELECT  *  FROM  \"" + table + "_stopwords" + "\" where \"stopwords\" like \'" + word + "\' ";
		ResultSet rs = stmt.executeQuery(sql);

		if (rs.next()) {

			isStopWord = true;

		} else {
			isStopWord = false;
		}

		return isStopWord;
	}

	public static void main(String args[]) throws SQLException {

		//System.out.println(new DashDB().isStopWord("abl", "Mr Trump"));

	}

}
