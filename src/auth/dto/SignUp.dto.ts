import * as Joi from 'joi';

export class SignUpDto {
  email: string;
  username: string;
  name: string;
  password?: string;
  loginMethod?: string;
}

export const SignUpSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
  loginMethod: Joi.string().valid('local', 'google').default('local'),
});
