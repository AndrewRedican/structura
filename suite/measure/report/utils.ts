const COLOR_MARKER = '\u001b['

const createColorizer = (color: string) => (text: string | number) => `${COLOR_MARKER}${color}m${text}${COLOR_MARKER}0m`

export const cyan = createColorizer('36');

export const red = createColorizer('31');

export const green = createColorizer('32');

export const ms = (text: string | number) => `${text} ms`

export const MB = (text: string | number) => `${text} MB`
