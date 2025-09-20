// apps/frontend/lib/logger.ts
type LogFn = (...args: unknown[]) => void;

const isDebug =
  typeof process !== "undefined" &&
  (process.env.DEBUG_API === "1" || process.env.NODE_ENV !== "production");

function makeLogger(prefix = "app") {
  const fmt = (level: string, args: unknown[]) =>
    [`[${prefix}]`, level.toUpperCase(), new Date().toISOString(), ...args];

  const debug: LogFn = (...args) => {
    if (isDebug) console.debug(...fmt("debug", args));
  };
  const info: LogFn = (...args) => {
    if (isDebug) console.info(...fmt("info", args));
  };
  const warn: LogFn = (...args) => {
    console.warn(...fmt("warn", args));
  };
  const error: LogFn = (...args) => {
    console.error(...fmt("error", args));
  };

  return { debug, info, warn, error };
}

// export un logger par défaut (préfixe par défaut)
export const logger = makeLogger("API");
export const makeNamedLogger = (name: string) => makeLogger(name);
export default logger;
