const chalk = require("chalk")
import { Service } from "tydet-core";

export enum LoggerMode {
  CONSOLE = "CONSOLE",
  FILE = "FILE",
  WEBHOOK = "WEBHOOK"
}

const MODE = "MODE";

enum Levels {
  INFO = "INFO",
  DEBUG = "DEBUG",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
  WARNING = "WARNING",
  ERROR = "ERROR"
}

export class Logger extends Service {

  constructor(mode: LoggerMode, options?: any) {
    let params = new Map()
    params.set(MODE, mode)
    super(params)
  }

  private write(level: string, ...args: any[]) {
    let m = this.params.get(MODE)
    let d = `[${(new Date()).toLocaleString()}]:`
    let s = ''
    for (let arg of args) {
      s += `${arg} `
    }
    if (m == LoggerMode.FILE) {
      // TODO
    } else if (m == LoggerMode.WEBHOOK) {
      // TODO
    } else {
      let p = ''
      if (level == Levels.INFO) {
        p += chalk.bgBlue(`${level}`)
        p += chalk.blue(` ${d} ${s}`)
      } else if (level == Levels.DEBUG) {
        p += chalk.bgMagenta(`${level}`)
        p += chalk.magenta(` ${d} ${s}`)
      } else if (level == Levels.SUCCESS) {
        p += chalk.bgGreen(`${level}`)
        p += chalk.green(` ${d} ${s}`)
      } else if (level == Levels.FAILURE) {
        p += chalk.bgYellow(`${level}`)
        p += chalk.yellow(` ${d} ${s}`)
      } else if (level == Levels.WARNING) {
        p += chalk.bgHex('#FFA500').visible(`${level}`)
        p += chalk.hex('#FFA500').visible(` ${d} ${s}`)
      } else if (level == Levels.ERROR) {
        p += chalk.bgRed(`${level}`)
        p += chalk.red(` ${d} ${s}`)
      }
      console.log(p)
    }
  }

  info(...args: any[]) {
    this.write(Levels.INFO, ...args)
  }

  debug(...args: any[]) {
    this.write(Levels.DEBUG, ...args)
  }

  success(...args: any[]) {
    this.write(Levels.SUCCESS, ...args)
  }

  failure(...args: any[]) {
    this.write(Levels.FAILURE, ...args)
  }

  warn(...args: any[]) {
    this.write(Levels.WARNING, ...args)
  }

  error(...args: any[]) {
    this.write(Levels.ERROR, ...args)
  }
}