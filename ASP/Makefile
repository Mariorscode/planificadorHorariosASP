ROOT_DIR := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

pythonpath:
	@echo "Setting PYTHONPATH..."
	@export PYTHONPATH=$(ROOT_DIR)

unittest: pythonpath
	@echo "Running tests with pytest..."
	@pytest-3 test/ -v # Add -s to see print statements

run:
	clingo engine.lp knowledge.lp context.lp
