# zsh
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="ys"
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"
export EDITOR="vim"

# user
proxy="10.163.153.106:7890"
export HTTP_PROXY=http://$proxy
export HTTPS_PROXY=http://$proxy
export ALL_PROXY=socks5://$proxy

# go
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export GO111MODULE="on"
export GOPROXY="https://goproxy.cn"

# c, c++
export CC="/usr/bin/clang"
export CXX="/usr/bin/clang++"
export CMAKE_GENERATOR="Ninja"

# js, ts
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# python3
export PATH="$HOME/python3/bin:$PATH"

# pnpm
export PNPM_HOME="/home/user/.local/share/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac
# pnpm end

export PATH="$HOME/emsdk:$PATH"
export PATH="$HOME/emsdk/upstream/emscripten:$PATH"

# bun completions
[ -s "/home/user/.bun/_bun" ] && source "/home/user/.bun/_bun"

# bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
. "/home/user/.deno/env"%