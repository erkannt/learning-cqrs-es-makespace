.PHONY: dev test

.DEFAULT_GOAL := check-and-fix

node_modules: package.json package-lock.json
	npm install

check-and-fix: typecheck test fix

dev: node_modules
	npx ts-node-dev --project tsconfig.json --transpile-only --watch src ./src/index.ts

test: node_modules
	npx jest

typecheck: node_modules
	npx tsc --noEmit

lint: node_modules
	npx eslint .
	npx prettier --ignore-unknown --check '**'

fix: node_modules
	npx eslint --fix .
	npx prettier --ignore-unknown --check '**' --write
