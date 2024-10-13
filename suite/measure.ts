const {getOptions} = await import('./measure/options.ts');
const options = getOptions();
const { measure } = await import('./measure/index.ts');
await measure(options);
