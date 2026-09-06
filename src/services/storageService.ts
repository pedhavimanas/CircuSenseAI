/**
 * IndexedDB storage utility for storing full-resolution PCB images
 * and avoiding localStorage quota limitations (which usually cap at ~5MB).
 */

const DB_NAME = 'circusense_store_v1';
const DB_VERSION = 1;
const IMAGE_STORE = 'pcb_images';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available in this environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IMAGE_STORE)) {
        db.createObjectStore(IMAGE_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const storageService = {
  /**
   * Save an image (dataURL string or Blob) by key.
   */
  saveImage: async (key: string, data: string | Blob): Promise<string> => {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(IMAGE_STORE, 'readwrite');
        const store = tx.objectStore(IMAGE_STORE);
        const req = store.put(data, key);
        req.onsuccess = () => resolve(key);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('IndexedDB saveImage failed, falling back to memory/session:', err);
      return key;
    }
  },

  /**
   * Retrieve an image by key.
   */
  getImage: async (key: string): Promise<string | null> => {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(IMAGE_STORE, 'readonly');
        const store = tx.objectStore(IMAGE_STORE);
        const req = store.get(key);
        req.onsuccess = () => {
          const res = req.result;
          if (res instanceof Blob) {
            resolve(URL.createObjectURL(res));
          } else {
            resolve(res || null);
          }
        };
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('IndexedDB getImage failed:', err);
      return null;
    }
  },

  /**
   * Delete an image by key.
   */
  deleteImage: async (key: string): Promise<boolean> => {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(IMAGE_STORE, 'readwrite');
        const store = tx.objectStore(IMAGE_STORE);
        const req = store.delete(key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return false;
    }
  }
};
