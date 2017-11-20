package com.fb.job;


import static org.quartz.JobBuilder.newJob;
import static org.quartz.TriggerBuilder.newTrigger;

import java.util.Date;

import static org.quartz.SimpleScheduleBuilder.*;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.Trigger;
import org.quartz.impl.StdSchedulerFactory;


import com.icp.utils.DashDB;

/**
 * This Example will demonstrate how to start and shutdown the Quartz scheduler and how to schedule a job to run in
 * Quartz.
 * 
 * @author Bill Kratzer
 */
public class SimpleExample {

  public void run() throws Exception {

	  
	// define the job and tie it to our MyJob class
	  JobDetail job = newJob(FacebookDataRetreivalJob.class)
	      .withIdentity("job1", "group1")
	      .build();

	  // Trigger the job to run now, and then repeat every 40 seconds
	  Trigger trigger = newTrigger()
	      .withIdentity("trigger1", "group1")
	      .startNow()
	      .withSchedule(simpleSchedule()
	              .withIntervalInSeconds(40)
	              .repeatForever())
	      .build();
	  Scheduler scheduler = StdSchedulerFactory.getDefaultScheduler();

	  // and start it off
	  scheduler.start();
	  // Tell quartz to schedule the job using our trigger
	  scheduler.scheduleJob(job, trigger);
	  
  }

  public static void main(String[] args) throws Exception {

    
    new DashDB().updateTimeStamp("1", new Date().toString());
    SimpleExample example = new SimpleExample();
    example.run();

  }

}
