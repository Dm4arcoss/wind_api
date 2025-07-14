const { PrismaClient } = require('./generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'vistoriasbrasill@gmail.com' }
    });

    if (existingUser) {
      console.log('Usuário já existe:', existingUser.email);
      return;
    }

    // Criar hash da senha
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Criar usuário de teste
    const user = await prisma.user.create({
      data: {
        email: 'vistoriasbrasill@gmail.com',
        password: hashedPassword,
        name: 'Usuário Teste',
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });

    console.log('Usuário criado com sucesso:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 