#include <stdio.h>
#include <string.h>

int auth_validate_license(
    const char *license_path,
    const char *expected_product,
    const char *expected_fingerprint,
    const char *required_feature,
    char *out_json,
    size_t out_cap
);

static int g_authorized = 0;

int algo_authorize(
    const char *license_path,
    const char *expected_product,
    const char *expected_fingerprint,
    const char *required_feature,
    char *out_json,
    size_t out_cap
) {
    int status = auth_validate_license(
        license_path,
        expected_product,
        expected_fingerprint,
        required_feature,
        out_json,
        out_cap
    );
    g_authorized = (status == 0);
    return status;
}

int algo_get_required_steps(const char *scenario) {
    if (!g_authorized) {
        return -1;
    }
    if (strcmp(scenario, "success") == 0) {
        return 3;
    }
    if (strcmp(scenario, "fail") == 0) {
        return 2;
    }
    if (strcmp(scenario, "timeout") == 0) {
        return 8;
    }
    return -1;
}

int algo_process_step(const char *scenario, int step_index, char *out_json, size_t out_cap) {
    if (!g_authorized) {
        snprintf(
            out_json,
            out_cap,
            "{\"status\":\"failed\",\"error_code\":\"E1004\",\"message\":\"algorithm authorization required\"}"
        );
        return 1004;
    }

    if (strcmp(scenario, "fail") == 0 && step_index >= 1) {
        snprintf(
            out_json,
            out_cap,
            "{\"status\":\"failed\",\"error_code\":\"E3001\",\"message\":\"native algorithm failure\"}"
        );
        return 3001;
    }

    snprintf(out_json, out_cap, "{\"status\":\"processing\",\"step_index\":%d}", step_index);
    return 0;
}

int algo_finalize(
    const char *scenario,
    const char *task_id,
    const char *object_id,
    char *out_json,
    size_t out_cap
) {
    if (!g_authorized) {
        snprintf(
            out_json,
            out_cap,
            "{\"status\":\"failed\",\"error_code\":\"E1004\",\"message\":\"algorithm authorization required\"}"
        );
        return 1004;
    }

    if (strcmp(scenario, "success") == 0) {
        snprintf(
            out_json,
            out_cap,
            "{\"status\":\"success\",\"task_id\":\"%s\",\"object_id\":\"%s\",\"x\":123.4,\"y\":52.1,\"z\":18.7,\"yaw\":91.2,\"confidence\":0.93,\"message\":\"ok\"}",
            task_id,
            object_id
        );
        return 0;
    }

    if (strcmp(scenario, "timeout") == 0) {
        snprintf(
            out_json,
            out_cap,
            "{\"status\":\"failed\",\"task_id\":\"%s\",\"object_id\":\"%s\",\"error_code\":\"E4001\",\"message\":\"native algorithm exceeded time budget\"}",
            task_id,
            object_id
        );
        return 4001;
    }

    snprintf(
        out_json,
        out_cap,
        "{\"status\":\"failed\",\"task_id\":\"%s\",\"object_id\":\"%s\",\"error_code\":\"E3001\",\"message\":\"native algorithm failure\"}",
        task_id,
        object_id
    );
    return 3001;
}
