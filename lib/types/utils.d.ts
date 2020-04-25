import { query } from './types';
export declare const matchOperators: (query: query) => string[];
export declare const _parseInt: (anything: string | number) => number;
export declare const getSendData: (result: {
    code: number;
    message: string;
}, data: any) => {
    code: number;
    data: any;
    message: string;
};
export declare const filterQuery: (query: query, filed: "_start" | "_end" | "_limit" | "_sort" | "_order" | "_page" | "_num") => string | number | null;
export declare const isArr: (anything: any) => boolean;
export declare const isObj: (anything: any) => boolean;
