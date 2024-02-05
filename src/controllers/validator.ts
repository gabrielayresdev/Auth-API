import { body } from "express-validator";

const userValidator = [
  body("id").isUUID().withMessage("Invalid ID format"),
  body("firstName").isString().notEmpty().withMessage("First name is required"),
  body("secondName")
    .isString()
    .notEmpty()
    .withMessage("Second name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("cpf")
    .isLength({ min: 11, max: 11 })
    .isString()
    .withMessage("Invalid CPF format"),
  body("phone")
    .isLength({ min: 14, max: 14 })
    .isString()
    .withMessage("Invalid phone number format"),
  body("password").isString().notEmpty().withMessage("Password is required"),
  body("birthDate")
    .isISO8601()
    .toDate()
    .withMessage("Invalid birth date format"),
  body("cep").isString().notEmpty().withMessage("CEP is required"),
  body("address").isString().notEmpty().withMessage("Address is required"),
  body("addressRef")
    .optional()
    .isString()
    .withMessage("Invalid address reference format"),
];

export { userValidator };
