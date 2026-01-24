export const textVariant = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    p: 'p',
} as const;

export const textColor = {
    black: "black",
    white: "white",
    accent: "accent",
    success: "success",
    error: "error",
    warning: "warning"
} as const;

export type TextVariant = typeof textVariant[keyof typeof textVariant];
export type TextColor = typeof textColor[keyof typeof textColor];