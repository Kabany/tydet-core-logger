import { Context } from "tydet-core"
import { Logger, LoggerMode } from "../src/logger.service"

describe("Logger Service", () => {
  it("Should print in console", async () => {
    console.log = jest.fn();
    let app = new Context()
    let logger = new Logger(LoggerMode.CONSOLE)
    await app.mountService("logger", logger)
    logger.info("This is an info message")
    logger.debug("This is a debug message")
    logger.success("This is a success message")
    logger.failure("This is a failure message")
    logger.warn("This is a warning message")
    logger.error("This is an error message")
    expect(console.log).toHaveBeenCalledTimes(6)
  })
})