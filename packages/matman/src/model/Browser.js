import _ from 'lodash';
import { createPageDriver } from '../business';

/**
 * 浏览器类，使用这个类对浏览器进行设置并创建页面实例
 */
export default class Browser {
    /**
     * 构造函数
     *
     * @param {Object} [browserOptions] 参数
     * @author helinjiang
     */
    constructor(browserOptions) {
        this.browserOptions = browserOptions;
    }

    /**
     * 创建 Page 对象
     *
     * @param {String} caseModuleFilePath 当前 case 的文件名
     * @param {Object} [opts] 额外参数，传递给 MatmanConfig 和 PageDriver 使用
     * @return {PageDriver}
     * @author helinjiang
     */
    newPage(caseModuleFilePath, opts) {
        return createPageDriver(caseModuleFilePath, _.merge({ nightmareConfig: this.browserOptions }, opts));
    }
}
