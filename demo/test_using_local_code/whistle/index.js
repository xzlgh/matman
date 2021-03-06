const path = require('path');

/**
 * 动态生成 whistle 规则，用于 dev 场景
 *
 * @param {Object} [opts] 参数
 * @param {String} [opts.port] whistle 端口
 * @param {String} [opts.mockstarPort] mockstar 端口
 */
function getDevRules(opts = {}) {
  const projectRootPath = path.join(__dirname, '../local-project');

  // 规则内容，具体语法请参考： http://wproxy.org/whistle/
  // 注意：如果涉及到正则表达式，则 \ 需要修改为 \\ (用两个反斜杠)，否则自动设置到 whistle 时会被丢失
  const ruleList = [
    `www.baidu.com/cgi-bin/a/b/demo_cgi 127.0.0.1:${opts.mockstarPort || 9527}`,
    `www.baidu.com/baidu1.html ${projectRootPath}/baidu1.html`,
    `www.baidu.com/baidu2.html ${projectRootPath}/baidu2.html`,
  ];

  return {
    name: `[auto]matman_test_using_local_code_${opts.port}`,
    rules: ruleList.join('\n'),
  };
}

module.exports = {
  getDevRules,
};
