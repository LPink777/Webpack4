### webpack4构建前端打包应用的方案

[![Greenkeeper badge](https://badges.greenkeeper.io/LPink777/Webpack4.svg)](https://greenkeeper.io/)

使用webpack4.x来构造前端项目的打包方案，项目中使用了dllpiugin,happyPack等插件对性能进行了优化。有问题欢迎大家issue。

### 功能

- babel编译,es6转es5语法
- 图片打包压缩
- 支持热更新
- js、css文件自动添加版本号
- 打包压缩文件,去除console.log,注释等多余code
- 支持代码分离，打包出公用得code
- 使用dllPlugin 加快打包速度
- 使用happyPack进行多线程打包

### 使用版本

- webpack 4.20.2
- react 16.5.2
- react-dom 16.5.2
- react-router-dom 4.3.1

### 目录结构

```
.
├── dist  --------------------- 打包文件
├── dll  ---------------------- dll加速文件
├── webpack.config.dev.js  ------------------- 开发环境相关配置
├── webpack.config.pro.js  ------------------- 生产环境相关配置
├── webpack_dll.config.js  ------------------- dllPlugin配置
├── package.json  --------------------- 项目配置文件
├── README.md  ------------------------ 说明文件
├── postcss.config  -------------------- postcss配置文件
├── .eslintrc  -------------------- eslint配置文件
├── .babelrc  --------------------- babel配置文件
└── src  ------------------------------ 源码目录
    ├── index.js  --------------------- 入口文件路由配置
    ├── index.css  ----------------------- 公共css
    ├── index.html  ---------------------- html入口文件
    ├── static  -------------------------- 静态资源文件
```

### 克隆

```
git clone https://github.com/LPink777/Webpack4.git
```

### 安装依赖

```
npm install
```

### 编译

```
npm run dev （开发模式）
```

### 打包

```
npm run dll  (dll加速)
npm run build （生产模式）
```


### package.json - script 参数解析

- --open 打开浏览器

- --color webpack 输出信息颜色

- --hot 热更新

- --inline 热更新的方式

- --mode development（开发模式） || production (生产模式)

- --profile webpack 运行信息

- --json > stats.json 输出 webpack 信息 在官网http://webpack.github.io/analyse/中上传stats.json 分析数据

### 补充内容

我的微信公众号: 罗曼蒂克的消亡,欢迎大家订阅,日常推送一些温暖的小故事。

![二维码](https://github.com/LPink777/Webpack4/blob/master/src/static/qrcode.jpg)