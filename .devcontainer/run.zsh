#!/usr/bin/env zsh
if [ "$SSH_AUTH_SOCK" = "" ]; then
  eval $(ssh-agent)
  ssh-add
fi

docker run -it --rm \
  -e SSH_AUTH_SOCK=$SSH_AUTH_SOCK \
  -p 8080:8080 \
  -v $(dirname $SSH_AUTH_SOCK):$(dirname $SSH_AUTH_SOCK) \
  -v $HOME/.gitconfig:/root/.gitconfig:ro \
  cruftbusters.com/devcontainer
