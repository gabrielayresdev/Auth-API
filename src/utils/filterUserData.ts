interface UserInterface {
  id: string;
  name: string;
  lastName: string;
  email: string;
  cpf: string;
  phone: string;
  hash: string;
  salt: string;
  birthDate: Date;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  houseNumber: string;
  addressRef: string | null;
}

export default function filterUserData(user: UserInterface) {
  const {
    name,
    lastName,
    email,
    cpf,
    phone,
    salt,
    birthDate,
    cep,
    state,
    city,
    neighborhood,
    street,
    houseNumber,
    addressRef,
  } = user;
  return {
    name,
    lastName,
    email,
    cpf,
    phone,
    birthDate,
    cep,
    state,
    city,
    neighborhood,
    street,
    houseNumber,
    addressRef,
  };
}
