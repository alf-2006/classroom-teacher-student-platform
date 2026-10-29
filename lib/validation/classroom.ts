import { z } from 'zod'

export const phoneSchema = z
  .string({ error: 'اكتب رقم موبايلك' })
  .trim()
  .transform((value) => value.replace(/[\s()-]/g, ''))
  .refine(
    (value) => /^\+[1-9]\d{6,14}$/.test(value),
    'اكتب رقم موبايلك بكود البلد، زي +201001234567',
  )

export const passwordSchema = z
  .string({ error: 'اكتب كلمة السر' })
  .min(10, 'كلمة السر محتاجة 10 حروف على الأقل')
  .max(128, 'كلمة السر طويلة زيادة. خلّيها 128 حرف بالكتير')

export const signUpSchema = z.object({
  fullName: z
    .string({ error: 'اكتب اسمك كامل' })
    .trim()
    .min(2, 'اكتب اسمك كامل عشان نعرفك')
    .max(120, 'اسمك طويل زيادة. خلّيه 120 حرف بالكتير'),
  phone: phoneSchema,
  password: passwordSchema,
})

export const signInSchema = z.object({
  phone: phoneSchema,
  password: z.string({ error: 'اكتب كلمة السر' }).min(1, 'اكتب كلمة السر'),
})

export const createClassSchema = z.object({
  name: z
    .string({ error: 'اكتب اسم الفصل' })
    .trim()
    .min(2, 'اسم الفصل قصير. اكتب حرفين على الأقل')
    .max(160, 'اسم الفصل طويل زيادة. خلّيه 160 حرف بالكتير'),
  description: z
    .string({ error: 'اكتب وصف الفصل بكلام بسيط' })
    .trim()
    .max(2000, 'الوصف طويل زيادة. خلّيه 2000 حرف بالكتير')
    .optional(),
  capacity: z.coerce
    .number({ error: 'اكتب عدد طلبة صحيح' })
    .int('عدد الطلبة لازم يكون رقم صحيح')
    .min(1, 'الفصل محتاج مكان لطالب واحد على الأقل')
    .max(10000, 'الفصل يشيل 10000 طالب بالكتير'),
})
