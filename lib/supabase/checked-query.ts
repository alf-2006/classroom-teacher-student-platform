export async function checkedQuery<T extends { error: unknown | null }>(
  query: PromiseLike<T>,
): Promise<T> {
  const result = await query
  if (result.error) throw new Error('مش قادرين نحمّل البيانات. اطّمن على الاتصال وجرّب تاني.')
  return result
}
