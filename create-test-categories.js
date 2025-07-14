const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

// Função para criar slug a partir do nome
function createSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

async function createTestCategories() {
  try {
    console.log('🔧 Creating test categories...');
    
    const categories = [
      { name: 'Eletrônicos', description: 'Produtos eletrônicos e tecnológicos' },
      { name: 'Roupas', description: 'Vestuário e acessórios' },
      { name: 'Casa e Jardim', description: 'Produtos para casa e jardim' },
      { name: 'Esportes', description: 'Produtos esportivos e fitness' },
      { name: 'Livros', description: 'Livros e materiais de leitura' },
      { name: 'Alimentos', description: 'Produtos alimentícios' },
      { name: 'Beleza', description: 'Produtos de beleza e cuidados pessoais' },
      { name: 'Automotivo', description: 'Produtos automotivos' }
    ];

    for (const category of categories) {
      // Verificar se a categoria já existe
      const existingCategory = await prisma.category.findFirst({
        where: { name: category.name }
      });

      if (existingCategory) {
        console.log(`✅ Category already exists: ${category.name}`);
        continue;
      }

      // Criar slug
      const slug = createSlug(category.name);

      // Criar categoria
      const newCategory = await prisma.category.create({
        data: {
          name: category.name,
          slug: slug
        }
      });

      console.log(`✅ Category created: ${newCategory.name} (ID: ${newCategory.id}, Slug: ${newCategory.slug})`);
    }

    console.log('🎉 All test categories processed!');
    
  } catch (error) {
    console.error('❌ Error creating categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestCategories(); 