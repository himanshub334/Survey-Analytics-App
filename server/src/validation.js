export function validateSurvey(input) {
  const errors = [];
  if (!input || typeof input.title !== 'string' || !input.title.trim()) errors.push('Title is required.');
  if (!Array.isArray(input?.questions) || input.questions.length === 0) errors.push('Add at least one question.');
  for (const [i, q] of (input?.questions ?? []).entries()) {
    if (!q || typeof q.text !== 'string' || !q.text.trim()) errors.push(`Question ${i + 1}: text is required.`);
    if (!['single', 'multiple', 'text'].includes(q?.type)) errors.push(`Question ${i + 1}: unsupported type.`);
    if (['single', 'multiple'].includes(q?.type) && (!Array.isArray(q.options) || q.options.length < 2 || q.options.some(o => typeof o !== 'string' || !o.trim()))) errors.push(`Question ${i + 1}: provide at least two non-empty options.`);
  }
  return errors;
}
export function validateAnswers(survey, answers) {
  const errors = [];
  if (!Array.isArray(answers)) return ['Answers must be an array.'];
  const byId = new Map(survey.questions.map(q => [String(q._id), q]));
  const seen = new Set();
  for (const answer of answers) {
    const q = byId.get(String(answer?.questionId));
    if (!q) { errors.push('Answer references an unknown question.'); continue; }
    if (seen.has(String(q._id))) { errors.push(`Question "${q.text}" has duplicate answers.`); continue; }
    seen.add(String(q._id));
    const v = answer.value;
    if (q.required && (v == null || v === '' || (Array.isArray(v) && v.length === 0))) errors.push(`Question "${q.text}" is required.`);
    if (q.type === 'text' && v != null && typeof v !== 'string') errors.push(`Question "${q.text}" expects text.`);
    if (q.type === 'single' && v != null && !q.options.includes(v)) errors.push(`Question "${q.text}" has an invalid option.`);
    if (q.type === 'multiple' && v != null && (!Array.isArray(v) || v.some(x => !q.options.includes(x)))) errors.push(`Question "${q.text}" has invalid options.`);
  }
  for (const q of survey.questions) if (q.required && !seen.has(String(q._id))) errors.push(`Question "${q.text}" is required.`);
  return errors;
}
