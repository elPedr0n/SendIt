import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Compostos com patente (RF05) + acessórios comuns. Upsert por nome: rodar de novo é seguro.
const exercises = [
  { name: 'Supino reto', category: 'Peito', trackingType: 'reps_weight' },
  { name: 'Agachamento livre', category: 'Pernas', trackingType: 'reps_weight' },
  { name: 'Levantamento Terra', category: 'Costas', trackingType: 'reps_weight' },
  { name: 'Barra fixa', category: 'Costas', trackingType: 'reps_weight' },
  { name: 'Supino inclinado c/ halteres', category: 'Peito', trackingType: 'reps_weight' },
  { name: 'Remada curvada', category: 'Costas', trackingType: 'reps_weight' },
  { name: 'Desenvolvimento', category: 'Ombros', trackingType: 'reps_weight' },
  { name: 'Prancha', category: 'Core', trackingType: 'time' },
  { name: 'Corrida', category: 'Cardio', trackingType: 'distance' }
];

async function main() {
  for (const exercise of exercises) {
    await prisma.exerciseDict.upsert({
      where: { name: exercise.name },
      update: { category: exercise.category, trackingType: exercise.trackingType },
      create: { ...exercise, isCustom: false }
    });
  }
  console.log(`[seed] ${exercises.length} exercícios garantidos`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
