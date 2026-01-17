import type { BaseFileResponse } from "./common";

export interface SaveFile extends BaseFileResponse {
    user_id: number;
}

export interface SaveFileResponse extends BaseFileResponse {
    id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
}