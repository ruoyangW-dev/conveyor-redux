Npm publish checklist
***********************

autoinvent-example
-------------------

check that the autoinvent-example project works with the new changes

docs/_build
------------

delete 'docs/_build' folder
run 'make html' in the '/docs' directory
(ensure removed files do not linger in /_build folder)

lib
-----

delete 'lib' folder
run 'tsc' in the project directory
(ensure removed files do not linger in /lib folder)

npm pack
---------

run 'npm pack' in project directory -> displays contents/files which will be published
ensure all listed files are approved for publication
delete tarball file created with 'npm pack'

checks
-------

version is incremented?
name is correct? ("@autoinvent/" prefix?)
on latest branch?

publish
--------

'npm login' (if haven't done so already; need npm account for this)
'npm publish --access public' (since scoped package need --access tag)


tag
----

git tag v{version in package.json during publish} {commit#}
(example: git tag v0.1.0 38e743d4823r8wef...)
git push --tags