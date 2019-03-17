# Sali-chat-app React
![Build Status](https://travis-ci.org/bootstrap-tagsinput/bootstrap-tagsinput.svg?branch=master)
>沙粒聊天室React客户端5.0开放公测版，请配合5.0版服务端使用。
## 基于React+tsx开发
前端交互感觉流畅顺滑，更易于使用，开发和维护，代码十分易读。
## 采用Ant Design UI设计
更加漂亮和顺滑的操作，令人赞叹的视觉效果，组件式体系使得结构清晰。
## 通信用WebSocket+http
响应式消息传输，异步axios处理，有效提高加载速度，响应消息更加快速便捷。
## 支持WebPack+docker部署
项目发布几乎全部自动完成，直接放在服务器目录上便于管理，docker轻量级容器带来极小的性能开销
## 强大的可扩展性
未来可以实现点对点消息传输，聊天板系统，消息非对称加密传递，身份证书认证用户防止中间人攻击等高级操作……
## 移动、桌面全平台支持
几乎不用刻意适配，我们的css设计可以自动铺满您的设备屏幕
### 沙粒Sali聊天室，为了更好的沟通。
项目试验上线地址 http://45.76.194.96:8082/
### 项目部署流程
 1. 克隆整个仓库，然后进入
    ```
    git clone https://github.com/Neboer/sali-chat-app.git
    cd sali-chat-app
    ```
 2. 修改环境文件为部署环境
    ```
    vim src/environment.json
    ```
    将其中的environment改为production，并修改为您的ip地址。
 3. 安装依赖
     ```
     yarn
     ```
 4. 使用Webpack打包
    ```
    yarn build
    ```
 5. 构建docker镜像（替换yourname）
    ```
    docker build -t yourname .
    ```
 6. 运行docker实例（替换yourname,yourport）
    ```
    docker run -d -it -p yourport:80 yourname
    ```
 如果没有问题，运行```docker ps```可以查看到正在运行的实例。<br>
  对了，黑子确实蛮帅的。（这个开发者看超炮入迷了谁来救救他）