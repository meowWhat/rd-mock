//返回值规范

/* 成功状态码 */
export const SUCCESS = {
  code: 0,
  message: '成功',
}

/* 参数错误：10001-19999 */
export const PARAM_IS_INVALID = {
  code: 10001,
  message: '参数无效',
}
export const PARAM_IS_BLANK = {
  code: 10002,
  message: '参数为空',
}

/* 系统错误：40001-49999 */
export const SYSTEM_INNER_ERROR = {
  code: 40001,
  message: '系统繁忙，请稍后重试',
}
/* 数据错误：50001-599999 */
export const RESULT_DATA_NONE = {
  code: 50001,
  message: '数据未找到',
}
export const DATA_IS_WRONG = {
  code: 50002,
  message: '数据有误',
}
export const DATA_ALREADY_EXISTED = {
  code: 50003,
  message: '数据已存在',
}
/* 接口错误：60001-69999 */
export const INTERFACE_ADDRESS_INVALID = {
  code: 60004,
  message: '接口地址无效',
}
