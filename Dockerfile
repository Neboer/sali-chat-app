# 下载后，需要yarn build，产生build文件夹，然后再docker build构建镜像。
FROM nginx
COPY build /usr/share/nginx/html