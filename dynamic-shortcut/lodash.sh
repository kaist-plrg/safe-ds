#!/bin/bash

if [ "$#" -ne 1 ]; then
  TARGET=$SAFE_HOME/tests/benchmarks/lodash4/merged.js
else
  TARGET=$1
fi

REV_JSON=`echo $TARGET | sed 's/\(.*\).js/\1_jalangi_.json/'`
REV_JS=`echo $TARGET | sed 's/\(.*\).js/\1_jalangi_.js/'`
echo $REV_JSON
echo $REV_JS

$SAFE_HOME/bin/safe cfgSpanInfo -cfgSpanInfo:out=cfgSpanInfo.json $TARGET
node ../jalangi2/src/js/commands/esnstrument_cli.js --inlineIID --inlineSource $TARGET
node IID2CFGSpan.js $REV_JSON cfgSpanInfo.json
node instrument.js $REV_JS
