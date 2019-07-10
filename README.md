<h1 align="center">
  <img src="https://i.imgur.com/RGCZZjl.png" alt="LXD Hub Logo" width="500" />
</h1>

<h4 align="center">Display, search and copy <a href="https://linuxcontainers.org/lxd/" target="blank">LXC</a> images using a web interface. </h4>

 <p align="center">
  <a href="https://gitter.im/Roche/lxdhub?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/Roche/lxdhub.svg" alt="Gitter" /></a>
  <a href="https://circleci.com/gh/Roche/lxdhub"><img src="https://circleci.com/gh/Roche/lxdhub.png?circle-token=f41c49274b61c18d8a5867ab9d49b9f27a2227aa&style=shield" alt="Circle CI Status"></a>
 </p>

<p align="center">
  <img src="docs/assets/lxdhub-web-preview.png" width="70%">
</p>

# Purpose

[![Greenkeeper badge](https://badges.greenkeeper.io/Roche/lxdhub.svg)](https://greenkeeper.io/)

**LXDHub** is a management system for [linux containers (LXC)](https://linuxcontainers.org/). With LXDHub you can visualize **LXC images** of multiple (private & public) remotes. One of the key features of LXDHub is to **clone LXC images** from one remote to another. Therefor you can *mirror* public remotes to your private remote.

# Installation

## Prerequisites

- [lxc >= 3.x](https://linuxcontainers.org/)

Install lxd over snap:
```
sudo snap install lxd
sudo /snap/bin/lxd init
export PATH=$PATH:/snap/bin/
# usermod -aG lxd ${USER}
```

The fastest way to run LXDHub on your computer is by pulling the LXDHub LXC image from
our [public remote](https://lxdhub.xyz/remote/lxdhub/images).

```bash

lxc remote add lxdhub https://lxdhub.xyz:8443 --accept-certificate --public
lxc launch lxdhub:lxdhub mylxdhub
lxc info mylxdhub | grep "eth0:.*inet" | head -n1 | awk '{print "Open http://"$3":3000 in your browser"}'

```

Adding your remotes:

```bash

lxc exec mylxdhub -- su -l lxdhub -c "cat << EOF >> ~/lxdhub/lxdhub.yml
  - name: efiks
    url: https://images.efiks.ovh:8443
    protocol: lxd
    public: true
    readonly: true
EOF"

# restart the services
lxc exec mylxdhub -- systemctl restart lxdhub-dbsync.service
lxc exec mylxdhub -- systemctl restart lxdhub.service

```

LXDHub can also be installed with other technologies:

- [Install from source with docker-compose](docs/install-from-source.md)

# Configuration Management

## Ansible

Important Note:
these playbooks were tested in the following environment:
* ansible >= 2.5.1
* Ubuntu
* lxc (snap/native)

one can use the roles in the `ansible` folder to deploy lxdhub on their own server.

```bash
cd ansible
ansible-playbook deploy.yml -D -vv
```

one can also parametrize the container_name and lxdhub_version to be checked out as extra-vars.

```
ansible-playbook deploy.yml -D -vv -e "container_name=next-lxdhub" -e "lxdhub_version=v1.8.0"
```

This call will:

  1. create you a local `lxdhub` container (default)
  1. clone, build lxdhub inside of this container
  1. setup systemctl services
  1. publish an image in your local: remote

# Packages

Under the hood, LXDHub is split in five packages. The following graph visualizes the dependencies of each package.

![Package Dependency](docs/assets/package_dependency_graph.svg)

<table>
  <tr>
    <th>Name</th>
    <th>Version</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><a href="https://github.com/Roche/lxdhub/tree/master/packages/web">@lxdhub/web</a></td>
    <td><a href="https://www.npmjs.com/package/@lxdhub/api"><img src="https://badge.fury.io/js/%40lxdhub%2Fweb.svg" alt="npm version" height="18"></a></td>
    <td>The LXDHub webinterface</td>
  </tr>
  <tr>
    <td><a href="https://github.com/Roche/lxdhub/tree/master/packages/api">@lxdhub/api</a></td>
    <td><a href="https://www.npmjs.com/package/@lxdhub/api"><img src="https://badge.fury.io/js/%40lxdhub%2Fapi.svg" alt="npm version" height="18"></a></td>
    <td>The REST API for the LXDHub webinterface</td>
  </tr>
  <tr>
    <td><a href="https://github.com/Roche/lxdhub/tree/master/packages/dbsync">@lxdhub/dbsync</a></td>
    <td><a href="https://www.npmjs.com/package/@lxdhub/dbsync"><img src="https://badge.fury.io/js/%40lxdhub%2Fdbsync.svg" alt="npm version" height="18"></a></td>
    <td>The script to synchronize multiple LXD remotes with the LXDHub database</td>
  </tr>
  <tr>
    <td><a href="https://github.com/Roche/lxdhub/tree/master/packages/db">@lxdhub/db</a></td>
    <td><a href="https://www.npmjs.com/package/@lxdhub/db"><img src="https://badge.fury.io/js/%40lxdhub%2Fdb.svg"   alt="npm version" height="18"></a></td>
    <td>The package, which provides database functions for the @lxdhub/api and @lxdhub/dbsync packages</td>
  </tr>
  <tr>
    <td><a href="https://github.com/Roche/lxdhub/tree/master/packages/common">@lxdhub/common</a></td>
    <td><a href="https://www.npmjs.com/package/@lxdhub/common"><img src="https://badge.fury.io/js/%40lxdhub%2Fcommon.svg"   alt="npm version" height="18"></a></td>
    <td>The package, which provides common functions for all LXDHub-packages.</td>
  </tr>
</table>

The packages `@lxdhub/db` and `@lxdhub/common` are solely libraries, which can not be run seperatly. Whereas the packages `@lxdhub/web`, `@lxdhub/api` and `@lxdhub/dbsync` can be run seperatly via [Docker](https://www.docker.com/) or [NodeJS](https://nodejs.org/en/).

# Tests

## Prerequisites

- [NodeJS >= v9.x.x](https://nodejs.org/en/blog/release/v9.0.0/)
- [LXD >= 2.x.x](https://linuxcontainers.org/lxd/)

## Unit / Integration Tests

Run the automated test cases with NodeJS.

```bash

docker build -t $USER/lxdhub .
docker run -it $USER/lxdhub test
docker run -it $USER/lxdhub lint

```

# Related

- [@lxdhub/web](packages/web/README.md): The LXDHub webinterface
- [@lxdhub/api](packages/api/README.md): The REST API for the LXDHub webinterface
- [@lxdhub/dbsync](packages/dbsync/README.md): The script to synchronize multiple LXD remotes with the LXDHub database
- [@lxdhub/db](packages/db/README.md): The package, which provides database functions for the `@lxdhub/api` and `@lxdhub/dbsync` packages
- [@lxdhub/common](packages/common/README.md): The package, which provides common functions for all LXDHub-packages
- [CONTRIBUTING.md](CONTRIBUTING.md): The contributing guidelines
- [COPYRIGHT](COPYRIGHT): Copyright informations
- [publish.md](docs/publish.md): Documentation on how LXDHub is being published
- [LXC](https://linuxcontainers.org/): The underlying technology behind LXDHub

# People

- [Livio Brunner](https://github.com/BrunnerLivio) - Author
- [Eric Keller](https://github.com/erickellerek1) - Idea
