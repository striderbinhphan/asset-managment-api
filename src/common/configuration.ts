import {configKeys} from './constants';
import * as process from 'process';

export default () => {
  const config = {};
  for (const key in configKeys) {
    config[key] = process.env[key] || null;
  }
  return config;
};
