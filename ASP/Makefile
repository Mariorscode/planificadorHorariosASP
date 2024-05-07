ROOT_DIR := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
PYTHONPATH := $(ROOT_DIR)

install:
	@echo "Installing dependencies..."
	@pip3 install -r requirements.txt

unittest:
	@echo "Running tests with pytest..."
	@PYTHONPATH=$(PYTHONPATH) pytest-3 test/ -v # Add -s to see print statements
