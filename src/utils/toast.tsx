import { toast } from 'sonner';
import { CheckCircle2, XCircle, Info, AlertCircle } from 'lucide-react';
import type { ApiError } from '../interface/api';

export const showSuccessToast = (message: string, description?: string) => {
    toast.success(message, {
        description,
        icon: <CheckCircle2 className="w-5 h-5" />,
        duration: 4000,
    });
};

export const showErrorToast = (error: unknown) => {
    let message = 'An unexpected error occurred';
    let description: string | undefined;

    if (isApiError(error)) {
        message = error.message;
        description = error.status ? `Error ${error.status}` : undefined;
    } else if (error instanceof Error) {
        message = error.message;
    }

    toast.error(message, {
        description,
        icon: <XCircle className="w-5 h-5" />,
        duration: 5000,
    });
};

export const showInfoToast = (message: string, description?: string) => {
    toast.info(message, {
        description,
        icon: <Info className="w-5 h-5" />,
        duration: 4000,
    });
};

export const showWarningToast = (message: string, description?: string) => {
    toast.warning(message, {
        description,
        icon: <AlertCircle className="w-5 h-5" />,
        duration: 4000,
    });
};

// Type guard for ApiError
const isApiError = (error: unknown): error is ApiError => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as ApiError).message === 'string'
    );
};