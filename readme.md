### webpack4学习笔记

### 功能

- 编译速度快(使用 happypack 插件实现多线程执行任务)
- hash 指纹(js、css 文件自动添加版本号)
- es2015编译
- 图片体积小支持 base64 压缩
- 支持自定义打包文件的目录
- 支持热更新
- 支持打包输出 map 文件，去除 console.log,注释
- 支持打包压缩文件
- 使用dllPlugin 加快打包速度

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


### DllPlugin

- 打包的时候不想每次都编译react，react-dom等这些公共得库，浪费重复的时间，可以将 react 加入到 webpack.dll.config.js 里面的 vendors 数组中，然后执行 `npm run dll`
- 会输出 dll 文件夹，包含 Dll.js 和 manifest.json 文件，
- manifest.json 包含 vendors 里面包的路径，编译是不会编译这些不需要编译的文件，会加快编译速度

#### 开发模式

- 无需 map 文件
- 无需压缩 css,js
- 启动多线程执行编译任务

#### 生产模式

- 生成 map
- 压缩文件
- 自动添加 hash 版本号（解决缓存问题）
- 打包完成后输出可视化分析

