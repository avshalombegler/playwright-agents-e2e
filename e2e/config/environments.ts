/**
 * Environment configuration for different deployment environments
 */
export interface EnvironmentConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  slowMo?: number;
  headless?: boolean;
}

export const environments: Record<string, EnvironmentConfig> = {
  dev: {
    baseURL: 'https://the-internet.herokuapp.com',
    timeout: 30000,
    retries: 1,
    slowMo: 100,
    headless: true
  },
  staging: {
    baseURL: 'https://the-internet.herokuapp.com',
    timeout: 45000,
    retries: 2,
    slowMo: 50,
    headless: true
  },
  production: {
    baseURL: 'https://the-internet.herokuapp.com',
    timeout: 60000,
    retries: 3,
    headless: true
  },
  local: {
    baseURL: 'http://localhost:3000',
    timeout: 15000,
    retries: 0,
    slowMo: 200,
    headless: true
  }
};

/**
 * Get environment configuration based on NODE_ENV or default to 'dev'
 */
export function getEnvironmentConfig(environmentName?: string): EnvironmentConfig {
  const env = environmentName || process.env.NODE_ENV || 'dev';
  const config = environments[env];
  
  if (!config) {
    console.warn(`Environment '${env}' not found, defaulting to 'dev'`);
    return environments.dev;
  }
  
  return config;
}