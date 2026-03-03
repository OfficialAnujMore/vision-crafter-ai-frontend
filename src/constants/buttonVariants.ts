export const buttonVariants = {
    default: 'default',
    outline: 'outline',
    icon: 'icon',
    link: 'link',
} as const;

export type ButtonVariant = typeof buttonVariants[keyof typeof buttonVariants];
