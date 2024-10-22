# ZSH
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="ys"
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"
export EDITOR="vim"

# $HOME
socket="10.163.132.21:7890"
export HTTP_PROXY=http://$socket
export HTTPS_PROXY=http://$socket
export ALL_PROXY=socks5://$socket
export PATH="$HOME/.local:$PATH"

# Go
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export GO111MODULE="on"
export GOPROXY="https://goproxy.cn"

# C, C++
export CC="/usr/bin/clang"
export CXX="/usr/bin/clang++"
export CMAKE_GENERATOR="Ninja"
# ln /mnt/c/Users/admin/duke $HOME/

# Java
export MAVEN_HOME="/usr/share/maven"
export PATH="$MAVEN_HOME/bin:$PATH"

# JavaScript, TypeScrpt
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Python
export PATH="$HOME/venv/bin:$PATH"

export SDKMAN_DIR="$HOME/.sdkman"
[[ -s "$HOME/.sdkman/bin/sdkman-init.sh" ]] && source "$HOME/.sdkman/bin/sdkman-init.sh"
