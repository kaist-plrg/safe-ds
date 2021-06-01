export SAFE_HOME=../safe
../safe/bin/safe cfgSpanInfo -cfgSpanInfo:out=cfgSpanInfo.json $SAFE_HOME/bitops-nsieve-bits.js
node ../jalangi2/src/js/commands/esnstrument_cli.js --inlineIID --inlineSource $SAFE_HOME/bitops-nsieve-bits.js
node IID2CFGSpan.js $SAFE_HOME/bitops-nsieve-bits_jalangi_.json cfgSpanInfo.json
node instrument.js $SAFE_HOME/bitops-nsieve-bits_jalangi_.js

../safe/bin/safe analyze -config=$SAFE_HOME/config.json $SAFE_HOME/bitops-nsieve-bits.js
