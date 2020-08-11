
import { openDB, DBSchema } from 'idb/index';

interface MenuDB extends DBSchema {
  'items': {
    key: string;
    value: string;
  };
}

export class App {
  public message: string = `Lala`;
  products: string[] = [];

  async clicked() {
    await this.clearProducts();
    await this.saveMenu();
    this.products.splice(0, this.products.length, ...(await this.getAllProducts()));
  }
  async saveMenu(): Promise<boolean> {
    const db = await openDB<MenuDB>('menu-db', 1, {
      upgrade(db) {
        db.createObjectStore('items');
      },
    });
    await db.put('items', 'lala', '1');
    return true;
  }

  async getAllProducts(): Promise<string[]> {
    const db = await openDB<MenuDB>('menu-db', 1);
    const tx = db.transaction(['items'], 'readonly');
    const store = tx.objectStore('items');
    return await store.getAll();
  }

  async clearProducts(): Promise<boolean> {
    const db = await openDB<MenuDB>('menu-db', 1);
    const tx = db.transaction(['items'], 'readwrite');
    const store = tx.objectStore('items');
    await store.clear();
    return true;
  }
}
