package com.fb.job;

import static org.quartz.SimpleScheduleBuilder.simpleSchedule;
import static org.quartz.TriggerBuilder.newTrigger;
import java.sql.SQLException;
import java.util.Date;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.impl.StdSchedulerFactory;
import com.icp.utils.DashDB;


public class JobIntializer {
	public JobIntializer() throws SchedulerException, SQLException {
		
		configureFacebookJob();
	}
	private void configureFacebookJob() throws SchedulerException, SQLException{
		new DashDB().updateTimeStamp("1", new Date().toString());
		JobDetail job = JobBuilder.newJob(FacebookDataRetreivalJob.class)
			    .withIdentity("prepareCBMSDataJob", "group1").build();
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
}
