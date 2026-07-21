const fs = require('fs');

const content = fs.readFileSync('src/pages/Interview.jsx', 'utf8');

// Replace preset names
let modified = content.replace(/name:\s*"([^"]+)"/g, (match, p1) => {
    const key = p1.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `name: t('interview.presets.${key}', '${p1}')`;
});

// Also replace the JS alerts!
modified = modified.replace(/alert\("Please enter your name before starting the interview."\);/g, 'alert(t("interview.alerts.enter_name", "Please enter your name before starting the interview."));');
modified = modified.replace(/alert\("Error initializing interview question. Please try again."\);/g, 'alert(t("interview.alerts.error_init", "Error initializing interview question. Please try again."));');
modified = modified.replace(/alert\("Please answer the current question first."\);/g, 'alert(t("interview.alerts.answer_first", "Please answer the current question first."));');
modified = modified.replace(/alert\("AI Error during evaluation. Please try again."\);/g, 'alert(t("interview.alerts.ai_error", "AI Error during evaluation. Please try again."));');
modified = modified.replace(/alert\("Please complete and evaluate at least one question first."\);/g, 'alert(t("interview.alerts.complete_one", "Please complete and evaluate at least one question first."));');
modified = modified.replace(/alert\("Failed to save interview session to the database."\);/g, 'alert(t("interview.alerts.failed_save", "Failed to save interview session to the database."));');

fs.writeFileSync('src/pages/Interview.jsx', modified);
console.log("Interview.jsx updated with translations!");
