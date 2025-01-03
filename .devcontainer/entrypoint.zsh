#!/usr/bin/env zsh


workspace=/root/cruftbusters.com
ln -sf $workspace/.config /root/.config
ln -sf $workspace/.devcontainer/nginx.conf /etc/nginx/nginx.conf

git clone git@github.com:cruftbusters/cruftbusters.com.git $workspace
cd $workspace

git config core.editor nvim
git config init.defaultBranch main
git config pull.rebase true
git config push.autoSetupRemote true

pnpm -r install

screen -d -m -S home-dev pnpm -F home dev
screen -d -m -S home-test pnpm -F home exec vitest --ui --api 5174
screen -d -m -S home-e2e pnpm -F home exec playwright test --ui --ui-port 5175

nginx

/bin/zsh
