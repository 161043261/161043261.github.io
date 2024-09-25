# zsh
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="ys"
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"
export EDITOR="vim"

# admin
ip="10.162.148.173"
port="7890"
export HTTP_PROXY=http://$ip:$port
export HTTPS_PROXY=http://$ip:$port
export ALL_PROXY=socks5://$ip:$port

# c cc
export CMAKE_GENERATOR="Ninja"

# go
export GOPATH="$HOME/go"
export GOBIN="$HOME/bin"
export GO111MODULE="on"
export GOPROXY="https://goproxy.cn"

# java
export JAVA_HOME="$HOME/jdk-21"
export PATH="$JAVA_HOME/bin:$PATH"
export M2_HOME="/usr/share/maven"
export PATH="$M2_HOME/bin:$PATH"

# js, ts
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# python
export PATH="$HOME/venv/bin:$PATH"