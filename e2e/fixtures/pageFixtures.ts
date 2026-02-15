import { test as base, Page } from '@playwright/test';
import * as Pages from '../pages';

// Helper type to convert PascalCase to camelCase while preserving internal casing
type ToCamelCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Lowercase<First>}${Rest}`
  : S;

// Create a type that maps Page class names to fixture names (camelCase)
type PageFixtures = {
  [K in keyof typeof Pages as ToCamelCase<K>]: InstanceType<typeof Pages[K]>;
};

// Type for page constructors
type PageConstructor = new (page: Page) => any;

// Dynamically create fixtures for all page classes
const createPageFixtures = () => {
  const fixtures: Record<string, any> = {};
  
  Object.entries(Pages).forEach(([className, PageClass]) => {
    // Convert ClassName to camelCase fixture name
    const fixtureName = className.charAt(0).toLowerCase() + className.slice(1);
    
    fixtures[fixtureName] = async ({ page }: { page: Page }, use: (fixture: any) => Promise<void>) => {
      const instance = new (PageClass as PageConstructor)(page);
      await use(instance);
    };
  });
  
  return fixtures;
};

export const test = base.extend<PageFixtures>(createPageFixtures());

export { expect } from '@playwright/test';

// Export as default for better extension recognition
export default test;