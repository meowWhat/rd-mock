import { Middleware } from 'koa';
import { schema } from './types';
import 'colors';
interface ConfigOptions {
    delay?: number;
    port?: number;
    requestInterceptors?: Middleware[];
    responseInterceptors?: Middleware[];
}
declare const rdMock: (schema: schema, config: ConfigOptions) => void;
export { rdMock };
