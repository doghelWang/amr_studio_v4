/**
 * Zero-Omission Data Model for AMR Studio V4.
 * Precisely aligned with controller_model_comp_desc.proto
 */
export const DRIVE_TYPE_LABELS = {
    STANDARD_DIFF: '标准差速 Differential',
    SINGLE_STEER: '单舵轮 Single Steer',
    DUAL_STEER: '双舵轮 Dual Steer',
    QUAD_STEER: '四舵轮 Quad Steer',
};
export const NAV_METHOD_LABELS = {
    LASER_SLAM: '激光 SLAM',
    REFLECTOR: '激光反射板',
    QR_CODE: '二维码',
    VISUAL_SLAM: '视觉 SLAM',
    HYBRID: '混合导航',
};
// Removed legacy hardcoded CATEGORY_ATTRIBUTE_TEMPLATES to enforce strict CModel Schema inheritance.
//# sourceMappingURL=types.js.map