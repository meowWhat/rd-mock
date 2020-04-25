import { query, parseOperatorsResult } from './types';
export declare const parseSort: (query: query) => {
    sortKey: string;
    orderKey: "asc" | "desc";
};
export declare const parseOperators: (query: query) => parseOperatorsResult;
export declare const parseSlice: (query: query) => {
    start: number;
    end: number;
    limit: number;
};
export declare const parsePaginate: (query: query) => {
    page: number;
};
