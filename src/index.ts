import { startCronJobs } from "@src/controllers/cron.ts";
import {
  initializeAppConfig,
  parseConfigArgs,
  validateAppConfig,
} from "@src/utils/config/app-config.ts";
import { Logger, LogLevel } = "@zilla/logger";
import startServer from "@src/server.ts";
async function bootstrap() {
  const parsedArgs = parseConfigArgs(Deno.args);
  const config = await initializeAppConfig({
    configPath: parsedArgs.configPath,
  });
  await validateAppConfig({ requireLLM: true });

  Logger.level = LogLevel.INFO;

  await startCronJobs();
  startServer(config.server.port);
}

bootstrap().catch((error) => {
  const logger = new Logger("bootstrap");
  logger.error("应用启动失败:", error);
  if (error instanceof Error) {
    const msg = error.message;
    if (msg.includes("配置") || msg.includes("config") || msg.includes("apikey") || msg.includes("apiKey") || msg.includes("api_key")) {
      logger.error("提示: 请先运行 `deno task doctor` 检查配置是否完整");
    }
  }
  Deno.exit(1);
});
