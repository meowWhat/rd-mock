/// <reference types="lowdb" />
import { schema } from '../types';
declare const _default: (schema: schema) => {
    db: import("lowdb").LowdbSync<any>;
    keys: string[];
};
export default _default;
