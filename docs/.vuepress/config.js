module.exports = {
  title: "前端日志",
  description: "欢迎访问我的前端日志",
  ga: "UA-121061441-1",
  markdown: {
    lineNumbers: true
  },
  head: [
    ['link', { rel: 'icon', href: '/hero.jpg' }]
  ],
  themeConfig: {
    repo: "wendaoshuai66/blogs",
    nav: [
      {
        text: "博客",
        link: "/blog/"
      }
    ],
    sidebar: {
      "/blog/": [
        {
          title: '前端基础',
          collapsable: false,
          children: [
            "unknowHtml1",
            "cssnote",
            "3d",
            "jsFunctionalProgramming_bottom",
            "jsFunctionalProgramming",
            "前端中经常出现的错误及捕获",
            "深拷贝",
            "Promise",
            "php_up",
            "php_middle",
            "php_down",
            "ES5_top",
            "ES5_bottom",
            "ES5_core",
            "ES5_core1",
            "JavaScript执行堆栈探索",
            "Interview",
            "面向切面",
            "system",
            "前端架构与性能优化那些事"
          ]
        },
        {
          title: '前端框架',
          collapsable: false,
          children: [
            "vue原理解析之准备工作",
            "vue原理解析之数据驱动",
            "vue原理解析之编译深入",
            "vue原理解析之响应式原理深入",
            "简单的实现Vue之响应式",
            "vue原理解析之nextTick探索",
            "Webpack",
            "Webpack使用总结",
            "Webpack系列手写模块打包代码",
            "React入门必学[上]",
            "React入门必学[下]",
            "Redux原理",
            "TypeScript使用手册",
            "NodeJS入门",
            "NodeJS框架入门",
            "NodeJS使用的总结",
            "pm2项目部署总结",
            "KOA源码的阅读",
            "深入Koa原理"
          ]
        },
        {
          title: '前端测试',
          collapsable: false,
          children: [
            "js_and_qa",
            "tegratedTesting"
          ]
        },
        {
          title: '前端工具',
          collapsable: false,
          children: [
            "为什么要使用package-lock.json",
            "Package.json依赖管理"
          ]
        },
        {
          title: '计算机网络',
          collapsable: false,
          children: [
            "http协议",
            "server-po",
          ]
        },
        {
          title: '操作系统',
          collapsable: false,
          children: [
            "Linux",
            "Linux_supplement",
            "Linux_web",
          ]
        },
        {
          title: '数据结构与算法',
          collapsable: false,
          children: [
            "前端中的数据结构-排序"
          ]
        },
        {
          title: '杂谈',
          collapsable: false,
          children: [
            "杂谈"
          ]
        },
        {
          title: '开发',
          collapsable: false,
          children: [
            "实战1步骤详解"
          ]
        },
      ],
    },
    lastUpdated: "更新时间",
    docsDir: "docs",
    editLinks: true,
    editLinkText: "本文源码地址"
  },
  plugins: {
    '@vuepress/medium-zoom': {
      selector: 'img',
      options: {
          margin: 16
      }
    },
    '@vuepress/back-to-top':true
  }
};
