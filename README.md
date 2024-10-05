# rutracker-web-app

[WIP] Web Application for RuTracker on Symfony + Vue.js.

## Stack

 * [PHP 8.3](https://www.php.net/)
 * [Symfony 7.1](https://symfony.com/)
 * [MongoDB](https://www.mongodb.com/)
 * [Vue.js 3](https://vuejs.org/)
 * [Bootstrap 5.3](https://getbootstrap.com/)
 * under [Docker](https://www.docker.com/)

## Install

### Docker

```bash
curl -sSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

### on prod

```bash
make build@prod
make up
make install@prod
```

### on dev

```bash
cp docker-compose.override.yml.dist docker-compose.override.yml
make build@dev
make up
make install@dev
```

## Usage

```bash
x-www-browser 'http://127.0.0.1/'
```

## Tests

```bash
make install@test
make test
```

---

Developed with &lt;3 by [@qbbr](https://qbbr.cat).
