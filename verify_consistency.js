const fs = require('fs');

function compareObjects(obj1, obj2, path = '') {
    const keys1 = Object.keys(obj1).sort();
    const keys2 = Object.keys(obj2).sort();

    const missingInExport = keys1.filter(k => !keys2.includes(k));
    const extraInExport = keys2.filter(k => !keys1.includes(k));

    if (missingInExport.length > 0) {
        console.error(`[MISSING KEYS] at ${path || 'root'}: ${missingInExport.join(', ')}`);
    }
    if (extraInExport.length > 0) {
        // console.warn(`[EXTRA KEYS] at ${path || 'root'}: ${extraInExport.join(', ')}`);
    }

    keys1.forEach(key => {
        if (keys2.includes(key)) {
            const val1 = obj1[key];
            const val2 = obj2[key];
            const newPath = path ? `${path}.${key}` : key;

            if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null) {
                if (Array.isArray(val1) && Array.isArray(val2)) {
                    if (val1.length !== val2.length) {
                        console.warn(`[ARRAY LENGTH MISMATCH] at ${newPath}: original=${val1.length}, export=${val2.length}`);
                    }
                    val1.forEach((item, index) => {
                        if (val2[index]) {
                            compareObjects(item, val2[index], `${newPath}[${index}]`);
                        }
                    });
                } else {
                    compareObjects(val1, val2, newPath);
                }
            } else if (typeof val1 !== typeof val2) {
                console.error(`[TYPE MISMATCH] at ${newPath}: original=${typeof val1}, export=${typeof val2}`);
            }
        }
    });
}

function runVerify() {
    const originalPath = process.argv[2];
    const exportedPath = process.argv[3];

    if (!originalPath || !exportedPath) {
        console.log("Usage: node verify_consistency.js <original.json> <exported.json>");
        return;
    }

    try {
        const original = JSON.parse(fs.readFileSync(originalPath, 'utf8'));
        const exported = JSON.parse(fs.readFileSync(exportedPath, 'utf8'));

        console.log("--- Starting Consistency Audit ---");
        compareObjects(original, exported);
        console.log("--- Audit Complete ---");
    } catch (e) {
        console.error("Error reading files:", e.message);
    }
}

runVerify();
