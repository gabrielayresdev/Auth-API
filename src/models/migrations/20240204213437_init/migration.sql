-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "secondName" CHAR(11) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "cpf" CHAR(11) NOT NULL,
    "phone" VARCHAR(14) NOT NULL,
    "hash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "cep" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "addressRef" TEXT NOT NULL,
    "adm" BOOLEAN NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_secondName_key" ON "user"("secondName");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_cpf_key" ON "user"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");
