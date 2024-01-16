import z from 'zod';

const Schema = z.object({
    name: z
        .string()
        .min(1, { message: "Name field has to be filled." }),
    email: z
      .string()
      .min(1, { message: "Email field has to be filled." })
      .email("This is not a valid email."),
    password: z
      .string()
      .min(6, { message: "Password field has to be filled." }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password field has to be filled." })
});

const SignUpSchema = Schema.superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match"
      });
    }
});

const SignInSchema = Schema.omit({ name: true }).omit({confirmPassword: true});

const ResetSchema = Schema.omit({ name: true });

const parseSchema = (input, type) => {
    switch(type){
        case 'signin':
            return SignInSchema.safeParse(input);
        case 'signup':
        default:
            return SignUpSchema.safeParse(input);
    }
}

export const validateAuthFields = (type) => (req, res, next) => {
    const result = parseSchema(req.body, type)

    if (!result.success) {
    // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    next();
};