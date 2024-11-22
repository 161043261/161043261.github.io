# ZSH
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="ys"
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"
export EDITOR="vim"

# $HOME
proxy="10.163.232.45:7890"
export HTTP_PROXY=http://$proxy
export HTTPS_PROXY=http://$proxy
export ALL_PROXY=socks5://$proxy

# Go
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export GO111MODULE="on"
export GOPROXY="https://goproxy.cn"

# C, C++
export CC="/usr/bin/clang"
export CXX="/usr/bin/clang++"
export CMAKE_GENERATOR="Ninja"

# JavaScript, TypeScrpt
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Python3
export PATH="$HOME/python3/bin:$PATH"

# sdkman
export SDKMAN_DIR="$HOME/.sdkman"
[[ -s "$HOME/.sdkman/bin/sdkman-init.sh" ]] && source "$HOME/.sdkman/bin/sdkman-init.sh"