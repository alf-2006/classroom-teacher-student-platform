export async function checkedQuery<T extends { error: unknown | null }>(
  query: PromiseLike<T>,
): Promise<T> {
  const result = await query
  if (result.error) throw new Error('تعذر تحميل البيانات. أعد المحاولة بعد التحقق من الاتصال.')
  return result
}
