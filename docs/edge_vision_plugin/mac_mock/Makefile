CC ?= cc
CFLAGS ?= -O2 -Wall -Wextra -std=c11
PYTHON_INCLUDES := $(shell python3-config --includes)
PYTHON_LDFLAGS := $(shell python3-config --embed --ldflags)
BUILD_DIR := native/build
AUTH_LIB := $(BUILD_DIR)/libauth_core.dylib
ALGO_LIB := $(BUILD_DIR)/libalgo_core.dylib

all: $(AUTH_LIB) $(ALGO_LIB) host_simulator

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

$(AUTH_LIB): native/auth_core.c | $(BUILD_DIR)
	$(CC) -O2 -Wall -Wextra -dynamiclib -o $@ $<

$(ALGO_LIB): native/algo_core.c native/auth_core.c | $(BUILD_DIR)
	$(CC) -O2 -Wall -Wextra -dynamiclib -o $@ native/algo_core.c native/auth_core.c

host_simulator: host_simulator.c $(AUTH_LIB) $(ALGO_LIB)
	$(CC) $(CFLAGS) $(PYTHON_INCLUDES) -o $@ $< $(PYTHON_LDFLAGS)

run: host_simulator
	./host_simulator --scenario all

clean:
	rm -f host_simulator
	rm -rf $(BUILD_DIR)
