// src/index.ts
import createServer from './createServer';

async function main() {
  try {
    const server = await createServer();
    await server.start();

    async function onClose() {
      await server.stop(); 
      process.exit(0);
    }

    process.on('SIGTERM', onClose);
    process.on('SIGQUIT', onClose);
    process.on('SIGINT', onClose);
  } catch (error) {
    console.log('\n', error);
    process.exit(-1);
  }
}

main();
