#!  /bin/bash
# Build Conveyor Tarball Files

rm -R lib
npm run lib
rm conveyor-redux-1.0.0.tgz
npm pack --quiet
echo "!!! conveyor tar files ready !!!"
