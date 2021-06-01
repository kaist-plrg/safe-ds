# Installation Guide

We explain how to install SAFE_DS with necessary environment settings from the
scratch.  Before installation, please download JDK 8 and
[`sbt`](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Linux.html),
[`Node.js`](https://nodejs.org/en/download/) LTS version.

Additionally, we packaged the artifact in a docker container.  If you want to
skip the environment setting, we recommend you to use it.  You can install the
docker by following the instruction in
[https://docs.docker.com/get-started/](https://docs.docker.com/get-started/)
and downlaod our docker image with the following command:
```
$ docker pull GMBale/fse-21-safe-ds
$ docker run -w /home/ubuntu/safe-ds -it -m=16g --rm gmbale/fse-21-safe-ds
```
_WARNING_: The docker image is 1.7GB large thus be patient when you
download it and please assign more than 16GB memory for the docker engine.

## Download SAFE_DS
```
$ git clone https://github.com/kaist-plrg/safe-ds.git
$ cd safe-ds
```

## Environment Setting

1. Run the installation script
```
$ ./install.sh
# It took few minutes at the first time because it initilizes sbt
```
2. Add the environment variables.
```
$ export SAFE_HOME=<path to SAFE_DS>
$ export JALANGI_HOME=<path to SAFE_DS>/jalangi2
$ export DS_HOME=<path to SAFE_DS>/dynamic-shortcut
```
The above commands will appear after the first step `./install.sh`.
Copy and paste the commands on your shell.
The `<path to SAFE_DS>` should be the absolute path of SAFE_DS repository.

3. Run the `bin/safe` command to check whether your installation is successfully completed:
```
$ ./bin/safe help
```
