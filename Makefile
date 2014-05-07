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
	cd examples/simple-base-level && ../../$(ENB) make pseudo --no-cache
	cd examples/nested-base-level && ../../$(ENB) make pseudo --no-cache
	cd examples/mix-base-multilevel && ../../$(ENB) make pseudo --no-cache
	cd examples/mix-base-level && ../../$(ENB) make pseudo --no-cache

clean: npm
	rm -rf examples/simple-base-level/simple-pseudo-level.blocks
	rm -rf examples/simple-base-level/nested-pseudo-level.blocks
	rm -rf examples/nested-base-level/simple-pseudo-level.blocks
	rm -rf examples/nested-base-level/nested-pseudo-level.blocks
	rm -rf examples/mix-base-level/simple-pseudo-level.blocks
	rm -rf examples/mix-base-level/nested-pseudo-level.blocks
	rm -rf examples/mix-base-multilevel/simple-pseudo-multilevel.blocks
	rm -rf examples/mix-base-multilevel/nested-pseudo-multilevel.blocks

npm:
	npm install

.PHONY: validate
