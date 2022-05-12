.phony: dev test

node_modules: package.json package-lock.json
	npm install

dev: node_modules
	npm run start

test: node_modules
	npm run test