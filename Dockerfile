##
# base
##
FROM php:8.3-fpm-alpine AS base

ARG HOME="/var/www"
ARG USER
ARG UID

RUN apk update \
    && apk add --no-cache \
    bash \
    wget \
    unzip \
    openssl-dev \
    linux-headers \
    $PHPIZE_DEPS

RUN pecl install apcu mongodb \
    && docker-php-ext-enable apcu mongodb

#ARG CUSTOM_INI="/usr/local/etc/php/conf.d/ext-custom.ini"
#RUN echo 'extension=apcu' >> $CUSTOM_INI \
#    && echo 'extension=mongodb' >> $CUSTOM_INI

RUN wget https://getcomposer.org/download/latest-stable/composer.phar -O /usr/local/bin/composer \
    && chmod +x /usr/local/bin/composer

RUN adduser -u $UID -h $HOME -H -D -s /usr/sbin/nologin $USER

WORKDIR $HOME

##
# dev php
##
FROM base AS dev

ARG XDEBUG_INI="/usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini"

USER root:root

RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

RUN apk add \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && echo 'xdebug.mode=debug' >> $XDEBUG_INI \
    && echo 'xdebug.client_host=host.docker.internal' >> $XDEBUG_INI \
    && docker-php-source delete \
    docker-php-source delete \
    && apk del \
    ${PHPIZE_DEPS}

USER $USER:$USER

EXPOSE 9000

##
# prod php
##
FROM base AS prod

ENV APP_ENV=prod

USER root:root

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

RUN docker-php-source delete \
    docker-php-source delete \
    && apk del \
    ${PHPIZE_DEPS}


USER $USER:$USER

EXPOSE 9000

##
# nginx
##
FROM nginx:stable-alpine AS nginx
