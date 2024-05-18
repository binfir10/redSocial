import { z } from "zod"

export const SignUpValidations = z.object({
  name: z.string().min(3,{ message:"Name required min 3 characters"}),
  username: z.string().min(3, { message: "Username required min 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(265, "La contraseña no puede tener más de 265 caracteres")
    .nonempty("La contraseña es obligatoria"),
})

export const SignInValidations = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(265, "La contraseña no puede tener más de 265 caracteres")
    .nonempty("La contraseña es obligatoria"),
})


export const PostValidations = z.object({
  caption: z.string().min(3).max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string()
})

export const ProfileValidations = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});