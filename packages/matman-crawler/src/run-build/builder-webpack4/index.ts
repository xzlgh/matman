import webpack from 'webpack';
import {MatmanConfig} from 'matman-core';
import {createProdConfig} from './builder';

/**
 * 获得 webpack 的配置结果
 *
 * @param {MatmanConfig} matmanConfig
 * @return {Object}
 */
export function getWebpackConfig(matmanConfig: MatmanConfig): Promise<webpack.Configuration> {
  return Promise.resolve(createProdConfig(matmanConfig));
}

/**
 * 通过 webpack 接口来调用构建
 * @param {Object} webpackConfig 传递给 webpack 构建的参数
 * @param {Function} callback 回调
 */
export function runBuild(webpackConfig: webpack.Configuration, callback: () => void): void {
  // 执行构建
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      throw err;
    }

    console.log(
      stats.toString({
        chunks: false,
        colors: true,
        children: false,
      }),
    );

    callback();
  });
}