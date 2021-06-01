node $JALANGI_HOME/generate_direct_vanilla.js --analysis ../jalangi2/src/js/sample_analyses/ChainedAnalyses.js --analysis ../jalangi2/src/js/sample_analyses/dlint/DynamicShortcut.js engine.js
echo > ds-jalangi.result
node server.js
