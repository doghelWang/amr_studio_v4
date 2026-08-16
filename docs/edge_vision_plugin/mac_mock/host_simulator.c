#define PY_SSIZE_T_CLEAN
#include <Python.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    int plugin_started_calls;
    int worker_ready_calls;
    int task_accepted_calls;
    int resource_snapshot_calls;
    int auth_valid_calls;
    int auth_failed_calls;
    int progress_calls;
    int result_calls;
    char last_result_json[4096];
    char last_status[64];
} HostState;

static HostState g_state;

static void reset_state(void) {
    memset(&g_state, 0, sizeof(g_state));
}

static int contains_text(const char *text, const char *needle) {
    return strstr(text, needle) != NULL;
}

static PyObject *host_notify_plugin_started(PyObject *self, PyObject *args) {
    const char *task_id = NULL;
    const char *mode = NULL;
    (void)self;
    if (!PyArg_ParseTuple(args, "ss", &task_id, &mode)) {
        return NULL;
    }
    g_state.plugin_started_calls += 1;
    printf("[host_runtime] plugin started task=%s mode=%s\n", task_id, mode);
    Py_RETURN_NONE;
}

static PyObject *host_notify_worker_event(PyObject *self, PyObject *args) {
    const char *event_json = NULL;
    (void)self;
    if (!PyArg_ParseTuple(args, "s", &event_json)) {
        return NULL;
    }
    if (contains_text(event_json, "\"event_type\": \"worker.ready\"")) {
        g_state.worker_ready_calls += 1;
    }
    if (contains_text(event_json, "\"event_type\": \"task.accepted\"")) {
        g_state.task_accepted_calls += 1;
    }
    if (contains_text(event_json, "\"event_type\": \"task.resource_snapshot\"")) {
        g_state.resource_snapshot_calls += 1;
    }
    if (contains_text(event_json, "\"event_type\": \"task.auth.valid\"")) {
        g_state.auth_valid_calls += 1;
    }
    if (contains_text(event_json, "\"event_type\": \"task.auth.failed\"")) {
        g_state.auth_failed_calls += 1;
    }
    if (contains_text(event_json, "\"event_type\": \"task.progress\"")) {
        g_state.progress_calls += 1;
    }
    return Py_BuildValue("");
}

static PyObject *host_notify_plugin_result(PyObject *self, PyObject *args) {
    const char *result_json = NULL;
    const char *status_ptr = NULL;
    (void)self;
    if (!PyArg_ParseTuple(args, "s", &result_json)) {
        return NULL;
    }
    g_state.result_calls += 1;
    snprintf(g_state.last_result_json, sizeof(g_state.last_result_json), "%s", result_json);

    status_ptr = strstr(result_json, "\"status\":");
    if (status_ptr != NULL) {
        if (strstr(status_ptr, "\"success\"") != NULL) {
            snprintf(g_state.last_status, sizeof(g_state.last_status), "success");
        } else if (strstr(status_ptr, "\"timeout\"") != NULL) {
            snprintf(g_state.last_status, sizeof(g_state.last_status), "timeout");
        } else if (strstr(status_ptr, "\"failed\"") != NULL) {
            snprintf(g_state.last_status, sizeof(g_state.last_status), "failed");
        }
    }
    printf("[host_runtime] plugin result=%s\n", result_json);
    Py_RETURN_NONE;
}

static PyObject *host_get_device_fingerprint(PyObject *self, PyObject *args) {
    (void)self;
    (void)args;
    return PyUnicode_FromString("MOCK-RK3588-EDGE-0001");
}

static PyMethodDef HostRuntimeMethods[] = {
    {"notify_plugin_started", host_notify_plugin_started, METH_VARARGS, "Notify plugin started."},
    {"notify_worker_event", host_notify_worker_event, METH_VARARGS, "Notify worker event."},
    {"notify_plugin_result", host_notify_plugin_result, METH_VARARGS, "Notify plugin result."},
    {"get_device_fingerprint", host_get_device_fingerprint, METH_NOARGS, "Get device fingerprint."},
    {NULL, NULL, 0, NULL}
};

static struct PyModuleDef host_runtime_module = {
    PyModuleDef_HEAD_INIT,
    "host_runtime",
    "Embedded host runtime callbacks",
    -1,
    HostRuntimeMethods
};

PyMODINIT_FUNC PyInit_host_runtime(void) {
    return PyModule_Create(&host_runtime_module);
}

static int verify_scenario(const char *scenario, int python_rc) {
    int success = 1;
    if (python_rc != 0 && strcmp(scenario, "success") == 0) {
        success = 0;
    }
    if (g_state.plugin_started_calls != 1 || g_state.worker_ready_calls != 1 || g_state.task_accepted_calls != 1) {
        success = 0;
    }
    if (g_state.resource_snapshot_calls != 1 || g_state.result_calls != 1) {
        success = 0;
    }
    if (strcmp(scenario, "license_invalid") == 0) {
        if (g_state.auth_failed_calls != 1 || g_state.auth_valid_calls != 0) {
            success = 0;
        }
        if (g_state.progress_calls != 0) {
            success = 0;
        }
        if (strcmp(g_state.last_status, "failed") != 0 || !contains_text(g_state.last_result_json, "\"E1002\"")) {
            success = 0;
        }
    } else {
        if (g_state.auth_valid_calls != 1 || g_state.auth_failed_calls != 0) {
            success = 0;
        }
        if (strcmp(scenario, "success") == 0 && strcmp(g_state.last_status, "success") != 0) {
            success = 0;
        }
        if (strcmp(scenario, "fail") == 0 && strcmp(g_state.last_status, "failed") != 0) {
            success = 0;
        }
        if (strcmp(scenario, "timeout") == 0 && strcmp(g_state.last_status, "timeout") != 0) {
            success = 0;
        }
        if (strcmp(scenario, "license_invalid") != 0 && g_state.progress_calls <= 0 && strcmp(scenario, "fail") == 0) {
            success = 0;
        }
    }
    return success;
}

static int run_scenario(const char *scenario) {
    PyObject *sys_module = NULL;
    PyObject *sys_path = NULL;
    PyObject *plugin_module = NULL;
    PyObject *plugin_main = NULL;
    PyObject *result = NULL;
    int python_rc = 0;
    int ok = 0;

    reset_state();
    printf("[host] running scenario=%s\n", scenario);

    sys_module = PyImport_ImportModule("sys");
    sys_path = PyObject_GetAttrString(sys_module, "path");
    PyList_Insert(sys_path, 0, PyUnicode_FromString("."));
    Py_DECREF(sys_path);
    Py_DECREF(sys_module);

    plugin_module = PyImport_ImportModule("plugin_api");
    if (plugin_module == NULL) {
        PyErr_Print();
        return 0;
    }
    plugin_main = PyObject_GetAttrString(plugin_module, "main");
    if (plugin_main == NULL) {
        Py_DECREF(plugin_module);
        PyErr_Print();
        return 0;
    }

    {
        wchar_t *argv_items[3];
        argv_items[0] = Py_DecodeLocale("plugin_api.py", NULL);
        argv_items[1] = Py_DecodeLocale("--mode", NULL);
        argv_items[2] = Py_DecodeLocale(scenario, NULL);
        PySys_SetArgvEx(3, argv_items, 0);
        result = PyObject_CallObject(plugin_main, NULL);
        PyMem_RawFree(argv_items[0]);
        PyMem_RawFree(argv_items[1]);
        PyMem_RawFree(argv_items[2]);
    }

    if (result == NULL) {
        PyErr_Print();
        python_rc = 1;
    } else {
        python_rc = (int)PyLong_AsLong(result);
        Py_DECREF(result);
    }

    Py_DECREF(plugin_main);
    Py_DECREF(plugin_module);

    ok = verify_scenario(scenario, python_rc);
    printf(
        "[host] verify scenario=%s ok=%s auth_valid=%d auth_failed=%d progress=%d status=%s\n",
        scenario,
        ok ? "true" : "false",
        g_state.auth_valid_calls,
        g_state.auth_failed_calls,
        g_state.progress_calls,
        g_state.last_status
    );
    return ok;
}

int main(int argc, char **argv) {
    const char *scenario = "all";
    int all_ok = 1;

    if (argc == 3 && strcmp(argv[1], "--scenario") == 0) {
        scenario = argv[2];
    }

    if (PyImport_AppendInittab("host_runtime", PyInit_host_runtime) == -1) {
        fprintf(stderr, "failed to register host_runtime module\n");
        return 1;
    }

    Py_Initialize();
    if (!Py_IsInitialized()) {
        fprintf(stderr, "failed to initialize python runtime\n");
        return 1;
    }

    if (strcmp(scenario, "all") == 0) {
        all_ok &= run_scenario("success");
        all_ok &= run_scenario("fail");
        all_ok &= run_scenario("timeout");
        all_ok &= run_scenario("license_invalid");
    } else {
        all_ok &= run_scenario(scenario);
    }

    Py_Finalize();
    return all_ok ? 0 : 1;
}
