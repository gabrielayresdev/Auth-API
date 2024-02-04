interface UserInterface {
  id: string;
  firstName: string;
  secondName: string;
  email: string;
  cpf: string;
  phone: string;
  hash: string;
  salt: string;
  birthDate: Date;
  cep: string;
  address: string;
  addressRef: string | null;
}

export default function filterUserData(user: UserInterface) {
  const {
    firstName,
    secondName,
    email,
    cpf,
    phone,
    salt,
    birthDate,
    cep,
    address,
    addressRef,
  } = user;
  return {
    firstName,
    secondName,
    email,
    cpf,
    phone,
    salt,
    birthDate,
    cep,
    address,
    addressRef,
  };
}
