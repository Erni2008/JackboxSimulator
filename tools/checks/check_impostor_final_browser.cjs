process.chdir(require('node:path').resolve(__dirname, '../..'));
/* Reuses the complete Stage 5 browser flow before testing each final act. */
process.env.IMPOSTOR_FINAL_QA='1';
require('./check_impostor_browser.cjs');
