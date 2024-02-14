import chalk from "chalk";
import path from "path"
import fs from "fs"
import axios from "axios"

import { CoreError, Service } from "tydet-core";
import { StringUtils } from "tydet-utils";

export enum LoggerMode {
  CONSOLE = "CONSOLE",
  FILE = "FILE",
  WEBHOOK = "WEBHOOK"
}

export enum LogLevel {
  INFO = "INFO",
  DEBUG = "DEBUG",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
  WARNING = "WARNING",
  ERROR = "ERROR"
}

export interface LoggerConfiguration {
  mode: LoggerMode
  path?: string
  endpoint?: string
}

export interface LoggerConfigurationMin extends LoggerConfiguration {
  min?: LogLevel
}

export interface LoggerConfigurationMax extends LoggerConfiguration {
  max?: LogLevel
}

export interface LoggerConfigurationOnly extends LoggerConfiguration {
  only?: LogLevel[]
}

const LevelList = Object.keys(LogLevel).map(function(type) {
  return LogLevel[type];
});

const SETS = "SETS";
const TOTAL = "TOTAL";

function readOption(option: LoggerConfigurationMin | LoggerConfigurationMax | LoggerConfigurationOnly) {
  let o: LoggerConfigurationOnly = {mode: option.mode}
  switch(option.mode) {
    case LoggerMode.CONSOLE:
      // OK
      break
    case LoggerMode.FILE:
      if (!StringUtils.isNotBlank(option.path)) throw new CoreError("Logger: the path is not defined or it is not valid when the given mode is set as 'FILE'. Please check that the path is set correctly.")
      o.path = option.path
      break
    case LoggerMode.WEBHOOK:
      if (!StringUtils.isNotBlank(option.endpoint) && StringUtils.isWebUrlValid(option.endpoint)) throw new CoreError("Logger: the endpoint URL is not defined or it is not valid when the given mode is set as 'WEBHOOK'. Please check that the endpoint is set correctly.")
      o.endpoint = option.endpoint
      break
    default:
      throw new CoreError("Logger: The given mode configuration is not valid. Please check that the value is a valid Logger Mode.")
  }
  if (StringUtils.isNotEmpty((option as LoggerConfigurationMin).min)) {
    let op = option as LoggerConfigurationMin
    o.only = LevelList.slice(LevelList.indexOf(op.min))
  } else if (StringUtils.isNotEmpty((option as LoggerConfigurationMax).max)) {
    let op = option as LoggerConfigurationMax
    o.only = LevelList.slice(0, LevelList.indexOf(op.max) + 1)
  } else if ((option as LoggerConfigurationOnly).only != null && (option as LoggerConfigurationOnly).only.length) {
    o = {...(option as LoggerConfigurationOnly)}
  } else {
    throw new CoreError("Logger: The given configuration is not valid. Please check that the configuration is set correctly")
  }
  return o
}

export class Logger extends Service {

  constructor(options?: (LoggerConfigurationMin | LoggerConfigurationMax | LoggerConfigurationOnly)[]) {
    let sets: LoggerConfigurationOnly[] = []
    if (options && options.length) {
      for (let option of options) {
        sets.push(readOption(option))
      }
    } else {
      sets.push({mode: LoggerMode.CONSOLE, only: LevelList})
    }
    let params = new Map()
    params.set(SETS, sets)
    params.set(TOTAL, sets.length)
    super(params)
  }

  private write(level: LogLevel, ...args: any[]) {
    let sets = this.params.get(SETS) as LoggerConfigurationOnly[]
    for (let set of sets) {
      if (set.only.includes(level)) {
        let m = set.mode
        let d = `[${(new Date()).toLocaleString()}]:`
        let s = ''
        for (let arg of args) {
          s += `${arg} `
        }
        if (m == LoggerMode.FILE) {
          try {
            let logPath = path.normalize(set.path)
            let stream = fs.createWriteStream(logPath, {flags: "a", encoding: "utf8", mode: 0o666})
            stream.write(`${level} ${d} ${s}\n`)
          } catch(err) {
            throw new CoreError(`Logger: Error found in the log path '${set.path}' for the mode FILE.\n${err}`)
          }
        } else if (m == LoggerMode.WEBHOOK) {
          try {
            axios.post(set.endpoint, {log: `${s}`, level: level, iat: new Date()})
            .then((response) => {
              // OK
            })
          } catch(err) {
            throw new CoreError(`Logger: Error found in the endpoint URL '${set.endpoint}' for the mode WEBHOOK.\n${err}`)
          }
        } else {
          let p = ''
          if (level == LogLevel.INFO) {
            p += chalk.bgBlue(`${level}`)
            p += chalk.blue(` ${d} ${s}`)
          } else if (level == LogLevel.DEBUG) {
            p += chalk.bgMagenta(`${level}`)
            p += chalk.magenta(` ${d} ${s}`)
          } else if (level == LogLevel.SUCCESS) {
            p += chalk.bgGreen(`${level}`)
            p += chalk.green(` ${d} ${s}`)
          } else if (level == LogLevel.FAILURE) {
            p += chalk.bgYellow(`${level}`)
            p += chalk.yellow(` ${d} ${s}`)
          } else if (level == LogLevel.WARNING) {
            p += chalk.bgHex('#FFA500').visible(`${level}`)
            p += chalk.hex('#FFA500').visible(` ${d} ${s}`)
          } else if (level == LogLevel.ERROR) {
            p += chalk.bgRed(`${level}`)
            p += chalk.red(` ${d} ${s}`)
          }
          console.log(p)
        }
      }
    }
  }

  info(...args: any[]) {
    this.write(LogLevel.INFO, ...args)
  }

  debug(...args: any[]) {
    this.write(LogLevel.DEBUG, ...args)
  }

  success(...args: any[]) {
    this.write(LogLevel.SUCCESS, ...args)
  }

  failure(...args: any[]) {
    this.write(LogLevel.FAILURE, ...args)
  }

  warn(...args: any[]) {
    this.write(LogLevel.WARNING, ...args)
  }

  error(...args: any[]) {
    this.write(LogLevel.ERROR, ...args)
  }
}