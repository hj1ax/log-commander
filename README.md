# `log-commander`
A simple logger made in Typescript

## installation
Run in the terminal:
```sh
$ npm install log-commander 	# or
$ yarn add log-commander
```

## Usage
```ts
const { Logger } = require('log-commander');	// or import { Logger } from 'log-commander';

const logger = new Logger({
	showTimestamp: true,	// Show timestamps in the terminal
	showLogLevel: true,	// Show log level in the terminal			
	logFileOptions: {
		enabled: true,	// Save logs into a file
		filename: 'logs.txt',	// File name
		folderPath: process.cwd(),	// Log file location
		addTimestamp: true,	// Add timestamp to the log
		logLevels: ['all'],	// Choose which log levels to save
		addLogLevel: true	// Add log level to the log
	}
});


logger.log("Message");	// Prints a message

logger.warn("Warning");	// Prints a warning

logger.err("Error");	// Print an error
```
