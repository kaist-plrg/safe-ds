SAFE_DS: Accelerating JavaScript Static Analysis via Dynamic Shortcuts

**SAFE_DS** is an instance of **D**ynamic **S**hortcuts on JavaScript static analyzer **SAFE**,
which is a new technique to flexibly switch between abstract and concrete execution during
JavaScript static analysis in a sound way.
This artifact extends [SAFE](https://github.com/kaist-plrg/safe) for abstract execution and
[Jalangi2](https://github.com/Samsung/jalangi2) for concrete execution.
Jalangi2 is forked and its extension is imported as a git submodule.

This package is provided for [FSE'21 Artifact Evaluation](https://2021.esec-fse.org/track/fse-2021-artifacts).

## Getting Started Guide
The artifact is open-source can be obtained by cloning the following git
repository:
```
$ git clone https://github.com/kaist-plrg/safe-ds.git
$ cd safe-ds
```
To build and execute the artifact, you should follow the instrucitons in the
`INSTALL` file in the artifact.  Since our artifact is based on SAFE written in
Scala, it requires `sbt`, which is an intereactive build tool for Scala.
Moreover, for concrete execution by Jalangi2, you also need to install Node.js LTS version.

Additionally, we packaged the artifact in a docker container.  If you want to
skip the environment setting, we recommend you to use it.  You can install the
docker by following the instruction in
[https://docs.docker.com/get-started/](https://docs.docker.com/get-started/)
and downlaod our docker image with the following command:
```
$ docker pull gmbale/fse-21-safe-ds
$ docker run -w /home/ubuntu/safe-ds -it -m=16g --rm gmbale/fse-21-safe-ds
```
_WARNING_: The docker image is 1.7GB large thus be patient when you
download it and please assign more than 16GB memory for the docker engine.

## Basic Commands

You can run the artifact with the script files in the eval directory:
```
$ cd $SAFE_HOME/eval
```
### Analyze a JavaScript file with dynamic shortcut and print results
You can analyze a JavaScript program with **-ds** option as follows.
```
$ ./run -w -ds <INPUT JS FILE>
```
For example, `$ ./run -w -ds ../tests/semantics/language/function1.js`.

You can print analysis results as follows.
```
$ cat ds-safe.result ds-jalangi.result
```
### Clean the result files
```
$ ./clean
```
### Reproduce the experiments on Lodash4 tests (it takes about 24 hours)
```
$ ./experiment
```

## Step-by-Step Instructions for Checking Reproducibility

### Reproduce the experiments on Lodash4 tests
```
$ cd $SAFE_HOME/eval
$ ./experiment
```
The above script generates experimental results in the `raw_data` directory.

Note that experimental results are not deterministic due to execution time and
the timeout settings: 5m for total analysis time for each test case and 5s for
each trial of dynamic analysis.

### RQ1. Analysis Speed-up

Execute the following script to check the average analysis speed-up for each
benchmark.
```
$ node RQ1.js
```
Also, the following file shows the analysis speed-up for each test case.
```
$ cat RQ1_speed-up.json
```
It only shows the average analysis speed-up described in Section 6.1.
To fully calculate Figure 6, 7, and 8, please see 3rd, 4th, 5th, and
6th columns in the `raw_data/<BENCH-no?-DS>/summary.tsv` files.

### RQ2. Precision Improvement

To reproduce the slope result in Figure 9, please type the following command:
```
$ node RQ2.js
```
Moreover, it produces coordinates in Figure 9 except (0, 0) in the following file.
```
$ cat RQ2_precision.json
```

### RQ3. Opaque Function Coverage

The following script prints and produces the result in Table 1 respectively.
```
$ node RQ3.js
$ cat RQ3_opaque_function.json
```

### RQ scripts for the result of the paper
The directory `fse21_results` contains the numbers presented in the paper.
You can copy the directory into `raw_data` and run the RQ scripts on it.
```
$ cp -r fse21_results raw_data
$ node RQ*.js
```
