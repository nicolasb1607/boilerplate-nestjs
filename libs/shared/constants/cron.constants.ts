export const CRON_EXPRESSIONS = {
  EVERY_MINUTE: '* * * * *', // Runs every minute
  EVERY_5_MINUTES: '*/5 * * * *', // Runs every 5 minutes
  EVERY_15_MINUTES: '*/15 * * * *', // Runs every 15 minutes
  EVERY_30_MINUTES: '*/30 * * * *', // Runs every 30 minutes
  EVERY_HOUR: '0 * * * *', // Runs at the start of every hour
  EVERY_6_HOURS: '0 */6 * * *', // Runs every 6 hours
  EVERY_DAY_AT_MIDNIGHT: '0 0 * * *', // Runs every day at midnight
  EVERY_SUNDAY_AT_MIDNIGHT: '0 0 * * 0', // Runs every Sunday at midnight
  EVERY_1ST_OF_MONTH_AT_MIDNIGHT: '0 0 1 * *', // Runs on the 1st of every month at midnight
  EVERY_YEAR_ON_JAN_1ST: '0 0 1 1 *', // Runs once a year on January 1st
};
