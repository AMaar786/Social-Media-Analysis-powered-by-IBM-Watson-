package com.facebook.stream;



/**
 * @author <a href="http://restfb.com">Mark Allen</a>
 */

public abstract class Restfb {
  // Reads logging config from the classpath instead of specifying a JVM startup
  // parameter
  static {
    try {
      //LogManager.getLogManager().readConfiguration(Restfb.class.getResourceAsStream("/logging.properties"));
    } catch (Exception e) {
      throw new IllegalStateException("Could not read in logging configuration", e);
    }
  }
}