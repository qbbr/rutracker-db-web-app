.DEFAULT_GOAL = black@hole

UID           = $(shell id -u)
USER          = $(shell id -un)

COMPOSER      = composer
CONSOLE       = bin/console
PHPUNIT       = bin/phpunit
PHPCSFIXER    = vendor/bin/php-cs-fixer
PHPSTAN       = vendor/bin/phpstan

DC            = docker compose

##
# build containers
##
_build:
	$(DC) \
	    $(args) \
	    build \
	        --no-cache \
	        --build-arg UID=$(UID) \
	        --build-arg USER=$(USER)
.PHONY: _build

build@dev:
	make _build
.PHONY: build@dev

build@prod:
	make args='-f docker-compose.yml -f docker-compose.prod.yml' _build
.PHONY: build@prod

##
# install depends
##
_install:
	make check
	#make install-frontend
.PHONY: _install

install@dev:
	make _install
	make composer-install@dev
	#make load-fixtures@dev
	make migrate@dev
	make composer-clear-cache
.PHONY: install@dev

install@prod:
	make _install
	make composer-install@prod
	make composer-clear-cache
.PHONY: install@prod

install@test:
	#make install-db@test
	make load-fixtures@test
.PHONY: install@test

install-frontend:
	make cmd='./bin/install-frontend' exec-app
.PHONY: install-frontend

##
# composer
##
composer-install@dev:
	make cmd='$(COMPOSER) install' exec-app
.PHONY: composer-install@dev

composer-install@prod:
	make cmd='$(COMPOSER) install --no-dev --optimize-autoloader' exec-app
.PHONY: composer-install@prod

composer-clear-cache:
	make cmd='$(COMPOSER) clear-cache' exec-app
.PHONY: composer-clear-cache

##
# app
##
_load-fixtures:
	make cmd='$(CONSOLE) $(env_arg) doctrine:fixtures:load -n' exec-app
.PHONY: _load-fixtures

load-fixtures@dev:
	make _load-fixtures
.PHONY: load-fixtures@test

load-fixtures@test:
	make env_arg='-e test' _load-fixtures
.PHONY: load-fixtures@test

_migrate:
	make cmd='$(CONSOLE) $(env_arg) doctrine:migrations:migrate -n' exec-app
.PHONY: _migrate

migrate@dev:
	make _migrate
.PHONY: migrate@dev

cache-clear:
	make cmd='$(CONSOLE) c:c' exec-app
	make cmd='$(CONSOLE) c:w' exec-app
.PHONY: cache-clear

test:
	make cmd='$(PHPUNIT) --testdox' exec-app
.PHONY: test

##
# docker
##
up:
	$(DC) up -d --remove-orphans
.PHONY: up

down:
	$(DC) down -v
.PHONY: down

ps:
	$(DC) ps -a
.PHONY: ps

logs:
	$(DC) logs -f
.PHONY: logs

# make cmd='composer info' exec-app
exec-app:
	$(DC) exec app sh -c "$(cmd)"
.PHONY: exec-app

shell-app:
	$(DC) exec app bash
.PHONY: shell-app

shell-nginx:
	$(DC) exec nginx sh
.PHONY: shell-nginx

##
# lint
##
check: ### Check that platform requirements and validate composer.* files
	make cmd="$(COMPOSER) check-platform-reqs" exec-app
	make cmd="$(COMPOSER) validate" exec-app
.PHONY: check

cs:
	make cmd='$(PHPCSFIXER) fix --dry-run --diff' exec-app
.PHONY: cs

cs-fix:
	make cmd='$(PHPCSFIXER) fix' exec-app
.PHONY: cs-fix

phpstan:
	make cmd='$(PHPSTAN) analyse src tests' exec-app
.PHONY: phpstan
