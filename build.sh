#!  /bin/bash
# Build Conveyor Tarball Files

rm -R lib
yarn run lib
rm conveyor-redux-v1.0.0.tgz
yarn pack --quiet
echo "!!! conveyor tar files ready !!!"
