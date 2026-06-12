import { sequelize, Menu } from '../src/models/index.js';

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB conectada');
    const menus = await Menu.findAll({ raw: true });
    console.log('Menús en BD:', menus.length);
    console.log(JSON.stringify(menus, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error consultando menus:', err);
    process.exit(1);
  }
};

main();
