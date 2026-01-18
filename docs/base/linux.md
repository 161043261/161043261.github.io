# Linux

## ~/.zshrc

```bash
# zsh
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="ys"
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"
export EDITOR="vim"

# proxy="127.0.0.1:7897"
# export HTTP_PROXY="http://$proxy"
# export HTTPS_PROXY="http://$proxy"
# export ALL_PROXY="socks5://$proxy"

export PATH="$HOME/.local/bin:$PATH"

# C, C++
export CC="clang" # "clang-cl"
export CXX="clang++" # "clang-cl"
export CMAKE_GENERATOR="Ninja"

# Java
export SDKMAN_DIR="$HOME/.sdkman"
[[ -s "$HOME/.sdkman/bin/sdkman-init.sh" ]] && source "$HOME/.sdkman/bin/sdkman-init.sh"

export GRAALVM_HOME="$HOME/.sdkman/candidates/java/current"
export JAVA_HOME=$GRAALVM_HOME
export PATH="$JAVA_HOME/bin:$PATH"

# JavaScript nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# JavaScript pnpm
export PNPM_HOME="$HOME/.local/share/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac

# Python miniconda3
export PATH="$HOME/miniconda3/bin:$PATH"

__conda_setup="$('conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "$HOME/miniconda3/etc/profile.d/conda.sh" ]; then
        . "$HOME/miniconda3/etc/profile.d/conda.sh"
    else
        export PATH="$HOME/miniconda3/bin:$PATH"
    fi
fi
unset __conda_setup
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

sudo yum update -y && sudo yum upgrade -y

sudo yum install \
gcc gcc-c++ \
clang clang-tools-extra cmake curl \
gdb git \
iperf3 \
lldb llvm \
net-tools ninja-build \
pkgconfig \
tree \
vim \
wget \
zip zsh -y

sudo yum clean all && sudo yum autoremove -y

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
rsync ./example.log \                    # local path
-e 'ssh -p 22' who@?.?.?.?:~/example.log # remote path

rsync -e 'ssh -p 22' who@?.?.?.?:~/example.log \  # remote path
./example.log                                     # local path
```

## scp

```bash
scp [-r] -p <remote-port> <local-path> who@?.?.?.?:<remote-path>
scp [-r] -p <remote-port> who@?.?.?.?:<remote-path> <local-path>

# example
scp -p 22 ./example.log \  # local path
who@?.?.?.?:~/example.log  # remote path

scp -p 22 who@?.?.?.?:~/example.log \  # remote path
./example.log                          # local path
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

## 硬链接, 软链接

硬链接不能链接目录

```bash
ln [-s] /path/to/src /path/to/dst
```
