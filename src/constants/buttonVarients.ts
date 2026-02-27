export const buttonVarients = {
    default: 'default',
    outline: 'outline',
    icon: 'icon',
    link: 'link',
} as const;

export type ButtonVariant = typeof buttonVarients[keyof typeof buttonVarients];
