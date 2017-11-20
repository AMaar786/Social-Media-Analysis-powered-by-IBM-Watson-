package com.fb.job;
import java.io.IOException;
import java.sql.SQLException;
import java.text.ParseException;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import com.facebook.stream.FacebookStream;
import twitter4j.internal.org.json.JSONException;
public class FacebookDataRetreivalJob implements Job {

  
    private  FacebookStream fbStream;
    public FacebookDataRetreivalJob() {
    	
    }

    public void execute(JobExecutionContext context)
        throws JobExecutionException {

        // Say Hello to the World and display the date/time
    	try {
    		fbStream = new FacebookStream("EAAYcKE0dwUYBACUMSBNrIqI7mx2FTGDWUedT1YvZC2l9BTJtjqXvZBht1ZA3lEvwBR5iwUK3gTODfZAO0rB9kF50ZAZBpaKYbZB4sBihlZAIYgqTicLBptqgUXmItbnDcBMRqiInhPhF8ZBtMBtTZB4k7P9ZCfwpUcHXgepOBAlTjgNBwZDZD");
			fbStream.search();
		} catch (JSONException | ParseException | SQLException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }

}
