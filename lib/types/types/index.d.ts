import { LowdbSync } from 'lowdb';
import Router from 'koa-router';
export declare type query = {
    [key: string]: string | number;
};
export declare type schema = {
    [key: string]: Array<any>;
};
export declare type dbType = LowdbSync<any>;
export declare type router = Router<any, {}>;
export declare type parseOperatorsResult = {
    [key: string]: Array<{
        operators: string;
        range: number | string;
    }>;
};
