all: reader.js

dev:
	yarn dev:ts

build:
	cd deploy && git rm -r . && rm -rf _next && cd .. && yarn build && cp -r out/* deploy/

reader.js: reader.cpp
	EM_CACHE=.emcache emcc -fexceptions $(shell pkg-config --cflags exiv2) $(shell pkg-config --libs exiv2 expat zlib) -lembind reader.cpp -s EXPORT_ES6=1 -s MODULARIZE=1 -s EXPORT_NAME=ReaderMain -s SINGLE_FILE=1 -s ALLOW_MEMORY_GROWTH=1 -s ENVIRONMENT=web -o $@
