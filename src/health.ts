export interface HealthReport {
  OK: boolean,
  msg: string,
}

export interface HealthCheck {
  uptime: number,
  awsS3: HealthReport,
  mongoDB: HealthReport,
  redis: HealthReport
}