import fs from 'fs';
import {BrowserRunner, findMatmanConfig, MATMAN_CONFIG_FILE} from 'matman-core';
import _ from 'lodash';
// import {BrowserMasterAsync} from './model/BrowserMaster';
import PageDriverSync from './model/PageDriverSync';
import {MatmanConfigOpts, PageDriverOpts} from './types';
import {getCallerPath} from './util/caller';

// /**
//  * 初始化异步的 BrowserMaster 对象
//  *
//  * @param {Object} browserRunner 浏览器运行器，目前支持 puppeteer 和 nightmare 两种
//  */
// function launch(browserRunner: any): BrowserMasterAsync {
//   return new BrowserMasterAsync(browserRunner);
// }

/**
 * 获取新的 PageDriverOpts
 *
 * @param {PageDriverOpts} opts
 */
function getPageDriverOpts(opts?: PageDriverOpts): PageDriverOpts {
  const pageDriverOpts = _.merge({}, opts);

  let {caseModuleFilePath} = pageDriverOpts;

  // 特殊处理 caseModuleFilePath，如果没有，则自动获取
  if (!caseModuleFilePath || !fs.existsSync(caseModuleFilePath)) {
    // 注意，这里会有一些局限：假如使用者将该方法放在公共文件里面，则获取的值将会是同一个
    // 此时，需要手动定义并传入 caseModuleFilePath 来规避
    caseModuleFilePath = getCallerPath();

    // 如果无法获得 caseModuleFilePath，则直接抛出错误
    if (!caseModuleFilePath || !fs.existsSync(caseModuleFilePath)) {
      throw new Error(`Could not find caseModuleFilePath!`);
    }

    // 更新
    pageDriverOpts.caseModuleFilePath = caseModuleFilePath;
  }

  // 自动计算是哪个文件在调用 case 脚本，然后以调用者的文件名来做标记
  // 由于调用者脚本本身已经按目录存储，且同一个目录中不同调用者脚本文件名肯定不一样
  // 这样就能够区分标记了
  if (!pageDriverOpts.tag) {
    pageDriverOpts.tag = getCallerPath(caseModuleFilePath);
  }

  // 如果标签就是 case 文件本身路径，则清空，否则就会造成生成的文件名重叠
  if (pageDriverOpts.tag === caseModuleFilePath) {
    pageDriverOpts.tag = '';
  }

  return pageDriverOpts;
}

/**
 * 获得同步的 PageDriver
 *
 * @param {BrowserRunner} browserRunner 浏览器运行器，目前支持 puppeteer 和 nightmare 两种
 * @param {PageDriverOpts} pageDriverOpts
 * @param {MatmanConfigOpts} matmanConfigOpts
 */
export function launchSync(
  browserRunner: BrowserRunner,
  pageDriverOpts?: PageDriverOpts,
  matmanConfigOpts?: MatmanConfigOpts,
): PageDriverSync {
  // 处理下原始传入的 pageDriverOpts，部分设置默认值
  const newPageDriverOpts = getPageDriverOpts(pageDriverOpts);

  // 查找 matman config
  const matmanConfig = findMatmanConfig(newPageDriverOpts.caseModuleFilePath, matmanConfigOpts);

  // matman config 必须得存在
  if (!matmanConfig) {
    throw new Error(`Could not find ${MATMAN_CONFIG_FILE} or matman config setting!`);
  }

  // console.log('newPageDriverOpts', newPageDriverOpts);
  // console.log('matmanConfig', matmanConfig);

  return new PageDriverSync(browserRunner, matmanConfig, newPageDriverOpts);
}

// export {launchSync};
