import {createLogger, format, transports} from 'winston';
import {toBoolean} from '../helper/cast.helper';

const options = {
  file: {
    filename: 'error.log',
    level: 'error',
  },
  console: {
    level: 'silly',
  },
};

// export log instance based on the current environment
const loggerConfig = {
  format: format.combine(format.timestamp(), format.errors({stack: true}), format.json()),
  transports: [
    new transports.Console(options.console),
    ...(toBoolean(process.env.WRITE_LOGS_TO_FILE) === true
      ? [
          new transports.File(options.file),
          new transports.File({
            filename: 'combine.log',
            level: 'info',
          }),
          new transports.File({
            filename: 'warning.log',
            level: 'warn',
          }),
        ]
      : []),
  ],
};

export const loggerInstance = createLogger(loggerConfig);
