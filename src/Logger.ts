import { sep } from 'path';
import fs from 'fs';

import chalk from 'chalk';

interface LoggerOptions {
  showTimestamp: boolean;
  showLogLevel: boolean;
  logFileOptions: LogFileOptions;
}

interface LogFileOptions {
  enabled: boolean;
  logLevels: LogLevel[];
  filename: string;
  folderPath: string;
  addTimestamp: boolean;
  addLogLevel: boolean;
}

type LogLevel = 'log' | 'warn' | 'all';

enum LogType {
  LOG = 'LOG',
  WARN = 'WARN',
  ERR = 'ERR',
}

export class Logger {
  private showTimestamp: boolean;

  private showLogLevel: boolean;

  private logFilePath: string;

  private logFileOptions: LogFileOptions;

  protected logFile;

  public constructor(loggerOptions?: LoggerOptions) {
    this.showTimestamp = loggerOptions?.showLogLevel ?? true;
    this.showLogLevel = loggerOptions?.showLogLevel ?? true;
    this.logFileOptions = {
      enabled: loggerOptions?.logFileOptions.enabled ?? true,
      filename: loggerOptions?.logFileOptions.filename ?? 'logs.txt',
      folderPath: loggerOptions?.logFileOptions.folderPath ?? process.cwd(),
      logLevels: loggerOptions?.logFileOptions.logLevels ?? ['all'],
      addTimestamp: loggerOptions?.logFileOptions.addTimestamp ?? true,
      addLogLevel: loggerOptions?.logFileOptions.addLogLevel ?? true,
    };

    this.logFilePath = `${this.logFileOptions.folderPath}${sep}${this.logFileOptions.filename}`;
    this.logFile = fs.openSync(this.logFilePath, 'a+');
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
      (this.logFileOptions.addTimestamp ? `[${this.getTimestamp()}]` : '') +
      (this.logFileOptions.addLogLevel
        ? (this.logFileOptions.addTimestamp ? ' - ' : '') + logType
        : '') +
      ': ' +
      message +
      '\n';

    fs.writeSync(this.logFile, output);
  }

  protected printMessage(logType: LogType, message: string): void {
    const output =
      (this.logFileOptions.addTimestamp
        ? chalk.underline.bold(`[${this.getTimestamp()}]`)
        : '') +
      (this.logFileOptions.addLogLevel
        ? (this.logFileOptions.addTimestamp ? ' - ' : '') +
          this.colorLogType(logType)
        : '') +
      ': ' +
      message;

    console.log(output);
  }

  protected getTimestamp(): string {
    const date = new Date();
    const timestamp =
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
