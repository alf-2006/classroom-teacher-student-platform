import { z } from 'zod'

export const phoneSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s()-]/g, ''))
  .refine((value) => /^\+[1-9]\d{6,14}$/.test(value), 'أدخل رقمًا بصيغة دولية مثل +201001234567')

export const passwordSchema = z
  .string()
  .min(10, 'كلمة المرور يجب أن تحتوي على 10 أحرف على الأقل')
  .max(128, 'كلمة المرور طويلة جدًا')

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, 'أدخل الاسم الكامل').max(120),
  phone: phoneSchema,
  password: passwordSchema,
})

export const signInSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, 'أدخل كلمة المرور'),
})

export const createClassSchema = z.object({
  name: z.string().trim().min(2, 'اسم الفصل قصير جدًا').max(160),
  description: z.string().trim().max(2000).optional(),
  capacity: z.coerce.number().int().min(1).max(10000),
})
