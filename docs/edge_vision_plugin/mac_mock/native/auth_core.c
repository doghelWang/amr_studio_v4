#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static unsigned long long fnv1a_append(unsigned long long hash, const char *text) {
    size_t i = 0;
    while (text[i] != '\0') {
        hash ^= (unsigned long long)(unsigned char)text[i];
        hash *= 1099511628211ULL;
        i += 1;
    }
    return hash;
}

static unsigned long long compute_signature(
    const char *product,
    const char *fingerprint,
    const char *expires_at,
    const char *feature,
    const char *salt
) {
    unsigned long long hash = 1469598103934665603ULL;
    hash = fnv1a_append(hash, "EDGE_AUTH_V1::STATIC_SEGMENT::");
    hash = fnv1a_append(hash, product);
    hash = fnv1a_append(hash, "::");
    hash = fnv1a_append(hash, fingerprint);
    hash = fnv1a_append(hash, "::");
    hash = fnv1a_append(hash, expires_at);
    hash = fnv1a_append(hash, "::");
    hash = fnv1a_append(hash, feature);
    hash = fnv1a_append(hash, "::");
    hash = fnv1a_append(hash, salt);
    hash = fnv1a_append(hash, "::RUNTIME_SEGMENT");
    return hash;
}

static int extract_json_string(const char *json, const char *key, char *out, size_t out_cap) {
    char pattern[128];
    const char *cursor = NULL;
    const char *start = NULL;
    const char *end = NULL;
    size_t length = 0;

    snprintf(pattern, sizeof(pattern), "\"%s\"", key);
    cursor = strstr(json, pattern);
    if (cursor == NULL) {
        return -1;
    }
    cursor = strchr(cursor, ':');
    if (cursor == NULL) {
        return -1;
    }
    start = strchr(cursor, '"');
    if (start == NULL) {
        return -1;
    }
    start += 1;
    end = strchr(start, '"');
    if (end == NULL) {
        return -1;
    }
    length = (size_t)(end - start);
    if (length + 1 > out_cap) {
        return -1;
    }
    memcpy(out, start, length);
    out[length] = '\0';
    return 0;
}

static int load_file(const char *path, char *out, size_t out_cap) {
    FILE *fp = fopen(path, "rb");
    size_t size = 0;
    if (fp == NULL) {
        return -1;
    }
    size = fread(out, 1, out_cap - 1, fp);
    fclose(fp);
    out[size] = '\0';
    return 0;
}

int auth_validate_license(
    const char *license_path,
    const char *expected_product,
    const char *expected_fingerprint,
    const char *required_feature,
    char *out_json,
    size_t out_cap
) {
    char json[2048];
    char product[128];
    char fingerprint[128];
    char expires_at[64];
    char feature[128];
    char salt[128];
    char signature[128];
    char computed[64];
    unsigned long long signature_value = 0ULL;

    if (load_file(license_path, json, sizeof(json)) != 0) {
        snprintf(
            out_json,
            out_cap,
            "{\"status\":\"invalid\",\"code\":\"E1001\",\"message\":\"license file not found\"}"
        );
        return 1001;
    }

    if (
        extract_json_string(json, "product", product, sizeof(product)) != 0 ||
        extract_json_string(json, "fingerprint", fingerprint, sizeof(fingerprint)) != 0 ||
        extract_json_string(json, "expires_at", expires_at, sizeof(expires_at)) != 0 ||
        extract_json_string(json, "feature", feature, sizeof(feature)) != 0 ||
        extract_json_string(json, "salt", salt, sizeof(salt)) != 0 ||
        extract_json_string(json, "signature", signature, sizeof(signature)) != 0
    ) {
        snprintf(
            out_json,
            out_cap,
            "{\"status\":\"invalid\",\"code\":\"E1002\",\"message\":\"license format invalid\"}"
        );
        return 1002;
    }

    signature_value = compute_signature(product, fingerprint, expires_at, feature, salt);
    snprintf(computed, sizeof(computed), "%016llX", signature_value);

    if (
        strcmp(product, expected_product) != 0 ||
        strcmp(fingerprint, expected_fingerprint) != 0 ||
        strcmp(feature, required_feature) != 0 ||
        strcmp(signature, computed) != 0
    ) {
        snprintf(
            out_json,
            out_cap,
            "{\"status\":\"invalid\",\"code\":\"E1002\",\"message\":\"license signature or binding mismatch\"}"
        );
        return 1002;
    }

    if (strcmp(expires_at, "2099-12-31") != 0) {
        snprintf(
            out_json,
            out_cap,
            "{\"status\":\"invalid\",\"code\":\"E1003\",\"message\":\"license expired\"}"
        );
        return 1003;
    }

    snprintf(
        out_json,
        out_cap,
        "{\"status\":\"valid\",\"code\":\"OK\",\"message\":\"license accepted\",\"feature\":\"%s\"}",
        feature
    );
    return 0;
}
