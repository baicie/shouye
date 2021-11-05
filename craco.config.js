// @ts-check
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const WebpackBar = require('webpackbar');
const CracoLessPlugin = require('craco-less');
const path = require('path');

// const smp = new SpeedMeasurePlugin();

// 对第三方库进行打包设置
function getVendorGroupConfs() {
  // 分组1：自带发布版的第三方库
  const staticGroup = {
    groupName: 'venders-0',
    // 需要在webpack中设置别名的
    // 自己没有相关配置的才需要传
    alias: {
      // TODO 这几个到底咋弄比较好
      // "echarts": 'echarts/dist/echarts.min.js',
      // "konva": 'konva/konva.min.js',
      // "zrender": 'zrender/dist/zrender.min.js',
    },
    // 模块，列出的所有模块会打到一个chunk中
    modules: [
      'react',
      'react-dom',
      'react-router-cache-route',
      'react-router-dom',
      // "react-audio-analyser",
      // 'immutable',
      // "mobx",
      // "swiper",
      'dayjs',
      // "sortablejs",
      // "html2canvas",
      'axios',
    ],
  };

  // 可能按需引入的库，如echarts等
  const dynamicGroup1 = {
    groupName: 'vendors-1',
    modules: [
      // TODO 这三个怎么弄
      'echarts',
      'konva',
      'zrender',
    ],
  };

  // antd等
  const dynamicGroup2 = {
    groupName: 'vendors-2',
    modules: ['rc-.+?', 'antd'],
  };

  return [staticGroup, dynamicGroup1, dynamicGroup2];
}

// 获取cacheGroups中模块名test正则
function getModuleNameTestRegex(names) {
  return new RegExp(`[\\\\/]node_modules[\\\\/](?:${names.join('|')})[\\\\/]`);
}

// 获取splitChunks中cacheGroups的配置
function getCacheGroups() {
  // cacheGroup
  const vendorCacheGroups = getVendorGroupConfs().reduce(
    (cacheGroups, config, index) => {
      return {
        ...cacheGroups,
        [config.groupName]: {
          test: getModuleNameTestRegex(config.modules),
          priority: 100 - index,
          name: true,
          enforce: true,
        },
      };
    },
    {},
  );

  return {
    ...vendorCacheGroups,

    // 其他vendor代码
    // vendors: {
    //   test: /[\\/]node_modules[\\/]/,
    //   priority: -10,
    //   name: 'vendors-else',
    //   enforce: true, // node_modules里的直接强制打出来
    // },

    // 其他项目代码
    default: {
      minChunks: 2,
      priority: -20,
      // reuseExistingChunk: true,
    },
  };
}

// const appName = "zjyzWebTeacher";
const appName = require('./package.json').name;
console.info('================appName：', appName, process.env.NODE_ENV);
// const isEnvProduction =  process.env.NODE_ENV === 'production';
// const isEnvDevelopment = process.env.NODE_ENV === "development";
module.exports = {
  webpack: {
    alias: {
      '@': path.resolve('src'),
      img: path.resolve(__dirname, 'src/assets'),
    },
    plugins: [
      // 打包进度
      // @ts-ignore
      new WebpackBar({ profile: true }),
      ...// 开发环境配置
      (process.env.NODE_ENV === 'development'
        ? // process.env.NODE_ENV === "production" ?
          [
            // 分析器
            // new BundleAnalyzerPlugin({ openAnalyzer: true }),
            new HardSourceWebpackPlugin.ExcludeModulePlugin([
              {
                // HardSource works with mini-css-extract-plugin but due to how
                // mini-css emits assets, assets are not emitted on repeated builds with
                // mini-css and hard-source together. Ignoring the mini-css loader
                // modules, but not the other css loader modules, excludes the modules
                // that mini-css needs rebuilt to output assets every time.
                test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
              },
            ]),
            new HardSourceWebpackPlugin({
              // Clean up large, old caches automatically.
              cachePrune: {
                // Caches younger than `maxAge` are not considered for deletion. They must
                // be at least this (default: 2 days) old in milliseconds.
                maxAge: 2 * 24 * 60 * 60 * 1000,
                // All caches together must be larger than `sizeThreshold` before any
                // caches will be deleted. Together they must be at least this
                // (default: 50 MB) big in bytes.
                sizeThreshold: 50 * 1024 * 1024,
              },
            }),
          ]
        : []),
    ],
    configure: (webpackConfig, { env, paths }) => {
      console.log(process.env.NODE_ENV);
      // console.info('webpackConfig.output before:',  webpackConfig.output);
      webpackConfig.output = {
        ...webpackConfig.output,
        // publicPath: `/`,
        // library: "zjyzwebstudent",
        // libraryTarget: 'umd',
        // jsonpFunction: `webpackJsonp_zjyzwebstudent`,
        publicPath: '/',
        // library: `${appName}-[name]`,
        library: `${appName}`,
        libraryTarget: 'umd',
        jsonpFunction: `webpackJsonp_${appName}`,
      };
      // console.info('webpackConfig.output after:',  webpackConfig.output);
      // console.info('webpackConfig.resolve:', webpackConfig.resolve);

      // alias
      // const vendorAlias = getVendorGroupConfs().reduce((alias, config) => {
      //   return { ...alias, ...config.alias };
      // }, {});
      // webpackConfig.resolve.alias = { ...webpackConfig.resolve.alias, ...vendorAlias };

      // splitChunks
      const cacheGroups = getCacheGroups();
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        splitChunks: {
          chunks: 'all',
          // name: false,
          cacheGroups,
        },
      };

      // 关掉 sourceMap
      if (process.env.NODE_ENV !== 'development') {
        webpackConfig.devtool = false;
      }

      return webpackConfig;
    },
  },
  babel: {
    plugins: [
      // 启用修饰器语法
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties'],
    ],
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        resolveUrlLoaderOptions: {
          root: '',
          absolute: true,
        },
        cssLoaderOptions: {
          url: false,
        },
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#297FFF' },
            javascriptEnabled: true,
            cssModules: {
              localIdentName: '[path][name]__[local]--[hash:base64:5]', // if you use CSS Modules, and custom `localIdentName`, default is '[local]--[hash:base64:5]'.
            },
          },
        },
      },
    },
  ],
  devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
    // devServerConfig.headers = {
    //   "Access-Control-Allow-Origin": "*"
    // };
    devServerConfig = {
      ...devServerConfig,
      headers: { 'Access-Control-Allow-Origin': '*' },
      hot: true,
    };
    return devServerConfig;
  },
  // externals: {
  //   react: "React",
  //   "react-dom": "ReactDOM"
  //   // "babel-polyfill": 'babel-polyfill'
  // },
  eslint: {
    // 在dev server中关闭eslint
    enable: false,
  },
};
