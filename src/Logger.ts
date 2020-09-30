import chalk from 'chalk';
import fs from 'fs';
import { sep } from 'path';

interface LoggerOptions {
  showTimestamp: boolean;
  showLogLevel: boolean;
  logFileOptions: LogFileOptions;
}

interface LogFileOptions {
  enabled: boolean;
  logLevels: LogLevel[];
  path: string;
  timestamp: boolean;
  loglevel: boolean;
}

type LogLevel = 'log' | 'warn' | 'all';

enum LogType {
  LOG = 'LOG',
  WARN = 'WARN',
  ERR = 'ERR',
}

export class Logger {
  private timestamp: boolean;

  private logLevel: boolean;

  private logFileOptions: LogFileOptions;

  protected logFile;

  public constructor(loggerOptions?: LoggerOptions) {
    this.timestamp = loggerOptions?.showLogLevel ?? true;
    this.logLevel = loggerOptions?.showLogLevel ?? true;
    this.logFileOptions = {
      enabled: loggerOptions?.logFileOptions.enabled ?? true,
      path: loggerOptions?.logFileOptions.path ?? 'logs.txt',
      logLevels: loggerOptions?.logFileOptions.logLevels ?? ['all'],
      timestamp: loggerOptions?.logFileOptions.timestamp ?? true,
      loglevel: loggerOptions?.logFileOptions.loglevel ?? true,
    };

    this.logFile = fs.openSync(
      `${process.cwd()}${sep}${this.logFileOptions.path}`,
      'a+'
    );
  }

  public log(message: string): void {
    this.printMessage(LogType.LOG, message);
    if (this.logFileOptions.enabled) this.saveLog(LogType.LOG, message);
  }

  public warn(message: string): void {
    this.printMessage(LogType.WARN, message);
    if ((this, this.logFileOptions.enabled))
      this.saveLog(LogType.WARN, message);
  }

  public err(message: string): void {
    this.printMessage(LogType.ERR, message);
    if (this.logFileOptions.enabled) this.saveLog(LogType.ERR, message);
  }

  private saveLog(logType: LogType, message: string): void {
    const output =
      (this.logFileOptions.timestamp ? `[${this.getTimestamp()}]` : '') +
      (this.logFileOptions.loglevel
        ? (this.logFileOptions.timestamp ? ' - ' : '') + logType
        : '') +
      ': ' +
      message +
      '\n';

    fs.writeSync(this.logFile, output);
  }

  private printMessage(logType: LogType, message: string): void {
    const output =
      (this.timestamp ? chalk.underline(`[${this.getTimestamp()}]`) : '') +
      (this.logLevel
        ? (this.logFileOptions.timestamp ? ' - ' : '') +
          this.colorLogType(logType)
        : '') +
      ': ' +
      message;

    console.log(output);
  }

  protected getTimestamp(): string {
    const date = new Date();
    const timestamp =
      date.getFullYear().toString() +
      '-' +
      date.getMonth().toString().padStart(2, '0') +
      '-' +
      date.getDay().toString().padStart(2, '0') +
      ' ' +
      date.getHours().toString().padStart(2, '0') +
      ':' +
      date.getMinutes().toString().padStart(2, '0') +
      ':' +
      date.getSeconds().toString().padStart(2, '0');

    return timestamp;
  }

  protected colorLogType(logType: LogType): string {
    switch (logType) {
      case LogType.LOG:
        return chalk.green.bold(logType);
      case LogType.WARN:
        return chalk.yellow.bold(logType);
      case LogType.ERR:
        return chalk.red.bold(logType);
    }
  }
}
