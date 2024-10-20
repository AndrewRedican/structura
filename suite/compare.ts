const {getOptions} = await import('./compare/options.ts');
const options = getOptions();
const {compare} = await import('./compare/index.ts');
await compare(options);
