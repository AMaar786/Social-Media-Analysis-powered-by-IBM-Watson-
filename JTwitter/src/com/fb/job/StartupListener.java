package com.fb.job;

import java.sql.SQLException;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import org.quartz.SchedulerException;

public class StartupListener implements ServletContextListener {

	  public void contextInitialized(ServletContextEvent servletContextEvent) {
		
	  try {
		new JobIntializer();
	} catch (SchedulerException | SQLException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} 
	  }


	  public void contextDestroyed(ServletContextEvent servletContextEvent) {
	  }

	  
	}