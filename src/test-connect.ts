import { PrismaClient } from '@prisma/client';
(async () => {
	const prisma = new PrismaClient();
	try {
		await prisma.$connect();
		console.log('✅ Conectou ao RDS!');
	} catch (e) {
		console.error('❌ Falha ao conectar:', e);
	} finally {
		await prisma.$disconnect();
	}
})();
