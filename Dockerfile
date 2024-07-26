# 使用官方 Node.js 镜像作为基础镜像
FROM node as build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制所有文件到工作目录
COPY . .

# 构建应用（如果有构建步骤）
# RUN npm run build

# 暴露应用端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]