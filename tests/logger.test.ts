import { Context, CoreError } from "tydet-core"
import { LogLevel, Logger, LoggerMode } from "../src/logger.service"

describe("Logger Service", () => {
  it("Should print in console", async () => {
    let app = new Context()
    let logger = new Logger()
    await app.mountService("logger", logger)
    logger.info("This is an info message")
    logger.debug("This is a debug message")
    logger.success("This is a success message")
    logger.failure("This is a failure message")
    logger.warn("This is a warning message")
    logger.error("This is an error message", new CoreError("This is a test error"))
    await app.ejectAllServices()
  })

  it("Should print in a file", async () => {
    let app = new Context()
    let logger = new Logger([{
      mode: LoggerMode.FILE,
      path: "log.txt",
      min: LogLevel.INFO
    }])
    await app.mountService("logger", logger)
    logger.info("This is an info message")
    logger.debug("This is a debug message")
    logger.success("This is a success message")
    logger.failure("This is a failure message")
    logger.warn("This is a warning message")
    logger.error("This is an error message", new CoreError("This is a test error"))
    await app.ejectAllServices()
  })

  it("Should print in a file", async () => {
    let app = new Context()
    let logger = new Logger([{
      mode: LoggerMode.WEBHOOK,
      endpoint: "https://webhook-test.com/3e7b3278c816e89fd421c03d516112d1",
      min: LogLevel.INFO
    }])
    await app.mountService("logger", logger)
    logger.info("This is an info message")
    logger.debug("This is a debug message")
    logger.success("This is a success message")
    logger.failure("This is a failure message")
    logger.warn("This is a warning message")
    logger.error("This is an error message", new CoreError("This is a test error"))
    await app.ejectAllServices()
  })
})