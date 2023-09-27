export function expectString(envName: string): string {
  const val = process.env[envName];
  if (val === undefined) {
    throw new Error(`env ${envName}: required`);
  }
  return val;
}

export function expectInt(envName: string): number {
  const val = process.env[envName];
  if (val === undefined) {
    throw new Error(`env ${envName}: required`);
  }
  const valInt = parseInt(val, 10);
  if (isNaN(valInt)) {
    throw Error(`env ${envName}: int required`);
  }
  return valInt;
}

export function expectNodeEnv(
  envName: string,
  defaultValue?: "development" | "production"
) {
  const val = process.env[envName];
  if (val === "development" || val === "production") {
    return val;
  }
  if (val === undefined && defaultValue) {
    return defaultValue;
  }
  throw new Error(`env ${envName}: "development"|"production" required`);
}
