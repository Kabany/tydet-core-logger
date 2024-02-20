# Documentation

TyDeT Core Logger is a module for TyDeT Core to handle log events across the Context of the core backend app.

It can push logs to the `sys.log`, to a file or to a webhook endpoint.

## Basic usage

```js
import { Context } from 'tydet-core';
import { Logger, LoggerMode, LogLevel } from 'tydet-core-logger';

let app = new Context()
let logger = new Logger()
await app.mountService("logger", logger)

logger.info("This is an info message")
logger.debug("This is a debug message")
logger.success("This is a success message")
logger.failure("This is a failure message")
logger.warn("This is a warning message")
logger.error("This is an error message")
```

## Configurations

The input argument will define which levels will be considered and where the logs will be stored. The input must be an array of `LoggerConfiguration` instances (interface). For example:

```js
let logger = new Logger([
  {
    mode: LoggerMode.CONSOLE,
    min: LogLevel.INFO
  },
  {
    mode: LoggerMode.FILE,
    path: "./logs/today.log"
    max: LogLevel.SUCCESS
  },
  {
    mode: LoggerMode.WEBHOOK,
    endpoint: "https://mywebhookserver.com/logs",
    only: [LogLevel.ERROR, LogLevel.WARNING]
  }
])
```

If there are no configurations, the following default setting will applied:

```js
let default = {
  mode: LoggerMode.CONSOLE,
  min: [LogLevel.DEBUG]
}
```


### Log Levels

The are 6 levels with the following order:

* **debug**: Used for basic logs.
* **info**: Used for basic logs, but it has more priority than the debug level.
* **success**: Used mostly for success messages or responses, such as any 2XX HTTP response from Express JS.
* **failure**: Used mostly for expected failed responses, such as any 4XX or 5XX HTTP responses from Express JS.
* **warning**: Used for warning messages. It has more priority than the success and failure levels.
* **error**: Used for error messages, both expected and unexpected. It is the message with more priority.

When you configure the looger, you can specify which levels will be ignored or printed:

* **min**: It will include from specified to the highest level.
* **max**: It will include from the lowest to the especified level.
* **only**: It will include the list of the specified levels. It must be an array.

### Log Modes

You can configure where to push the log messages:

* **CONSOLE**: It will print the logs using the `sys.print` (`console.log`) method.
* **FILE**: It will print the logs in a write stream to a file. When using this mode, it is required to specify a valid file path in the configuration.
* **WEBHOOK**: It will send the logs to an endpoint using a HTTP POST request. When using this mode, it is required to specify a valid WEB URL endpoint in the configuration.