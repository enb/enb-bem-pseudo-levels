NPM_BIN = ./node_modules/.bin
ENB = $(NPM_BIN)/enb
JSHINT = $(NPM_BIN)/jshint
JSCS = $(NPM_BIN)/jscs
MOCHA = $(NPM_BIN)/mocha

validate: lint

lint: npm
	$(JSHINT) .
	$(JSCS) -c .jscs.js .

examples: npm
	cd examples/nested-base-level && ../../$(ENB) make pseudo --no-cache

clean: npm
	cd examples/nested-base-level && ../../$(ENB) make pseudo --no-cache

clean: npm
	rm -rf examples/nested-base-level/simple-pseudo-level.blocks
	rm -rf examples/nested-base-level/nested-pseudo-level.blocks

npm:
	npm install

.PHONY: validate
