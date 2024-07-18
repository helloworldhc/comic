## 项目说明
该项目主要用于个人的漫画管理，web页面结构借鉴了[Komga](https://github.com/gotson/komga)。由comic-web和comic-server两个项目组成。主要工作流程是前端添加一个包含有zip漫画文件的文件夹作为漫画库的路径，后端解析zip文件并将封面保存在指定目录，前端浏览漫画时后端使用redis作为缓存以加快访问速度。

### comic-web
web前端项目。主要使用了[Vue](https://vuejs.org/)、[Vue Router](https://router.vuejs.org/)、[Element Plus](https://element-plus.org/)

### comic-server
web后端项目。主要使用了[Koa](https://koajs.com/)、Redis、MySQL。

## 部署方法
主要使用docker compose来进行部署

1.编译comic-web和comic-server的镜像

`docker compose build`

2.运行

`docker compose up -d`

可选配置项

| 服务 | 配置项 | 说明 |
| --- | --- | --- |
| mysql | -e MYSQL_DATABASE | server使用的数据库，如果更改的话需要同步修改 comic-server/config/pro.json中的mysql配置
| mysql | -e MYSQL_USER | server使用的数据库用户名，如果更改的话需要同步修改 comic-server/config/pro.json中的mysql配置，并且修改init.sql中的GRANT语句 |
| mysql | -v /var/lib/mysql | mysql数据存储位置 |
| redis | command password | server使用的redis的密码，如果更改的话需要同步修改 comic-server/config/pro.json中的redis配置 |
| server | -v /app/cover | server解析出的封面，必须映射到host的文件夹中，且与web的 `-v /app/cover` 一致 |
| server | -v /data | 包含zip漫画的文件夹 |
| web | -v /app/cover | web使用的封面，必须映射到host的文件夹中，且与server的 `-v /app/cover` 一致 |

若已经部署了redis和mysql服务，则需要删除docker-compose.yml中的的redis和mysql配置，并修改server的数据库配置。此外还需要在mysql中创建用户并初始化comic数据库

## 后期计划
- ~~为漫画库中的漫画添加搜索和排序~~
- ~~添加通用的搜素功能~~
- 添加收藏功能
- 添加漫画编辑功能，并且能够添加任意自定义标签以及在此基础上的搜索功能
- 添加用户管理功能
- 为漫画阅读页面添加各种配置项
- 添加i18n