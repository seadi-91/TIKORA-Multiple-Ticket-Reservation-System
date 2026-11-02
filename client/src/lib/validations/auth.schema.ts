import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const customerRegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(60, "Full name cannot exceed 60 characters"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    phone: z
      .string()
      .min(9, "Phone number must be at least 9 digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z.literal(true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CustomerRegisterFormData = z.infer<typeof customerRegisterSchema>;

export const organizationRegisterSchema = z
  .object({
    organizationName: z
      .string()
      .min(2, "Organization name must be at least 2 characters")
      .max(100, "Organization name cannot exceed 100 characters"),
    category: z.enum(["BUS", "CINEMA", "EVENT", "SPORTS"] as const, {
      message: "Please select your organization category",
    }),
    businessLicense: z
      .string()
      .min(3, "Business license or commercial registration number is required"),
    taxNumber: z.string().optional(),
    contactPersonName: z
      .string()
      .min(2, "Contact person name is required"),
    email: z
      .string()
      .min(1, "Official email is required")
      .email("Please enter a valid official email address"),
    phone: z
      .string()
      .min(9, "Official phone number must be at least 9 digits"),
    address: z.string().min(3, "Office or physical address is required"),
    city: z.string().min(2, "City is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z.literal(true, {
      message: "You must accept the Partner & Provider Terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type OrganizationRegisterFormData = z.infer<typeof organizationRegisterSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const otpSchema = z.object({
  email: z.string().email(),
  otp: z
    .string()
    .length(6, "Verification code must be exactly 6 digits")
    .regex(/^\d+$/, "Verification code must only contain numbers"),
});

export type OtpFormData = z.infer<typeof otpSchema>;
