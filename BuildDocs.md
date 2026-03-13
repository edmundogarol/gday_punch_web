# Gday Punch Web App Build Docs (Mac OS)

#Installing requirements

## Homebrew
> Install Brew `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

## Postgres SQL
> Install Postgres `brew install postgresql@14`
> Access `psql` localhost in the commandline `psql -U postgres -h localhost`
> Create DB `postgres=# create database mydb;`
> Check DB created `SELECT datname FROM pg_database;`
> Create User + PW `postgres=# create user myuser with encrypted password 'mypass';`
> Grant User Privileges `postgres=# grant all privileges on database mydb to myuser;`

## Python
> `brew install python@3.11`
> Check python3 `which python3`
> `python3 --version` # Python 3.14.2

## VirtualEnv [Venv]
> Create python venv folder `/opt/homebrew/opt/python@3.11/bin/python3.11 -m venv venv`
> Activate venv `source venv/bin/activate`

## Yarn + Node
> Install yarn `brew install yarn`
> Install node `brew install node`

## NVM
> `brew install nvm`
> `mkdir -p ~/.nvm`
> `echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc`
> `echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc`
> `source ~/.zshrc`
> Use an LTS Node version (recommended: Node 18 or 20)
> `cd /Users/edmundogarol/Code/gday_punch_web/gdaypunchwebapp/gdaypunchreact`
> `nvm install 20`
> `nvm use 20`
> `node -v`   # should show v20.x

## AWS Cli
> Install AWS Cli via Homebrew `brew install awscli`
> `aws --version` # aws-cli/2.x.x Python/3.x