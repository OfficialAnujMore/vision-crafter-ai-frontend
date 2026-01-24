export const buttonVarients = {
    primary: 'primary',
    secondary: 'secondary',
    icon: 'icon',
    ternary: 'ternary',
} as const;

export type ButtonVariant = typeof buttonVarients[keyof typeof buttonVarients];