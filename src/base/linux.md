---
title: Linux
description: Linux
---

# Linux

## ~/.zshrc

```bash
# zsh
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="ys"
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"
export EDITOR="vim"

# _proxy="127.0.0.1:7890"
# export HTTP_PROXY="http://$_proxy"
# export HTTPS_PROXY="http://$_proxy"
# export ALL_PROXY="socks5://$_proxy"

# export PATH="$HOME/.local/bin:$PATH"

# go env -w CGO_ENABLED=0
# go env -w GO111MODULE=on
# go env -w GOPROXY=https://goproxy.io,direct
export GOPATH="$HOME/go:$PATH"
export GOBIN="$GOPATH/bin:$PATH"

# C, C++
export CC="clang" # "clang-cl"
export CXX="clang++" # "clang-cl"
export CMAKE_GENERATOR="Ninja"
```

## vim

```bash
# 命令模式
i|insert|a # 切换到插入模式
:          # 切换到命令行模式
x          # 删除当前字符
o          # 在下方插入行, 并切换到插入模式
O          # 在上方插入行, 并切换到插入模式
dd         # 剪切当前行
yy         # 复制当前行
P          # 光标后粘贴
p          # 光标前粘贴
u          # 撤销

# 输入模式
esc        # 切换到命令模式

# 命令行模式
:w         # 写文件
:q         # 退出
:wq        # 写文件并退出
:q!        # 强制退出
```

## ubuntu

```bash
wsl --list [--online]
wsl --install -d Ubuntu
wsl --set-default Ubuntu
wsl --shutdown
# wsl --unregister Ubuntu

sudo apt update && sudo apt full-upgrade -y && \
sudo apt-get update && sudo apt-get full-upgrade -y

sudo apt install \
apt-transport-https \
build-essential \
ca-certificates clang clang-format clang-tools clangd cmake curl \
firewalld \
gdb git \
iperf3 \
lld lldb llvm \
net-tools ninja-build \
pkg-config \
tree \
vim \
wget \
zip zsh \
--fix-missing -y

sudo apt autoclean && sudo apt autoremove

# zsh
git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions && \
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
```

## ssh

```bash
# client
cat ~/.ssh/id_rsa.pub | ssh who@?.?.?.? -p 22 "cat >> ~/.ssh/authorized_keys" && ssh who@?.?.?.? -p 22

# vim ~/.ssh/config
Host <alias>
  HostName ?.?.?.?
  User who
```

## rsync

```bash
rsync [-r] <local-path> -e 'ssh -p <remote-port>' who@?.?.?.?:<remote-path>
rsync [-r] -e 'ssh -p <remote-port>' who@?.?.?.?:<remote-path> <local-path>

# example
rsync ./example.log \                    # local-path
-e 'ssh -p 22' who@?.?.?.?:~/example.log # remote-path

rsync -e 'ssh -p 22' who@?.?.?.?:~/example.log \  # remote-path
./example.log                                     # local-path
```

## scp

```bash
scp [-r] -p <remote-port> <local-path> who@?.?.?.?:<remote-path>
scp [-r] -p <remote-port> who@?.?.?.?:<remote-path> <local-path>

# example
scp -p 22 ./example.log \  # local-path
who@?.?.?.?:~/example.log  # remote-path

scp -p 22 who@?.?.?.?:~/example.log \  # remote-path
./example.log                          # local-path
```

## screen

```bash
screen -S <name> # 创建虚拟终端
screen -r <name> # 返回虚拟终端
screen -R <name> # 创建/返回虚拟终端
ctrl+a, d        # 分离虚拟终端
screen -ls       # 列出所有虚拟终端
```

## tar

```bash
tar -cf dst.tar src      # .tar
tar -xf src.tar          # .tar

tar -czf dst.tar.gz src  # .tar.gz
tar -xzf src.tar.gz      # .tar.gz

tar -cJf dst.tar.xz src  # .tar.xz
tar -xJf src.tar.xz      # .tar.xz

tar -cjf dst.tar.bz2 src # .tar.bz2
tar -xjf src.tar.bz2     # .tar.bz2

zip -d dst.zip src       # .zip
unzip src.zip -d dst     # .zip
```

## script

```bash
touch ./example.log && script -a ./example.log
```

## | && ||

- `left | right`: 将 left 的输出作为 right 的输入
- `left && right`: 只有 left 执行成功, 才执行 right
- `left || right`: 只有 left 执行失败, 才执行 right

```bash
# -a All
# -s Size
# -n Numeric-sort
# -r Reverse
ls -as | sort -nr
```

## ping

```bash
# -c count
# -i interval
# -s packet size
# -t ttl
ping www.bytedance.com
ping -c 5 www.bytedance.com
ping -i 3 -s 1024 -t 255 www.bytedance.com
```

## curl

```bash
# 发送 GET 请求
curl https://ys.mihoyo.com/main/character/inazuma\?char\=0
# 发送 POST 请求
curl -X POST -d 'char=0' https://ys.mihoyo.com/main/character/inazuma
# 传输文件
mkdir ys.mihoyo.com && \
curl https://ys.mihoyo.com/main/character/inazuma\?char\=0 -o ./ys.mihoyo.com/index.html
```

## iperf3

```bash
# client 发送
iperf3 -c ?.?.?.? \  # client
       -i 1       \  # interval
       -l 8K      \  # length
       -p 3000    \  # port
       -t 30         # time (s)

# server 监听
iperf3 -s      \  # server
       -p 3000    # port
```

## ufw

```bash
sudo ufw disable
sudo systemctl disable ufw
```

## 硬链接, 软链接

硬链接不能链接目录

```bash
ln [-s] /path/to/src /path/to/dst
```

## clang

```bash
clang-format --style=google -dump-config > ./.clang-format
```
