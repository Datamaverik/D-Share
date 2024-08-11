class FileMetadataStorage {
  private db: IDBDatabase | undefined;

  constructor() {
    const request = indexedDB.open("FileMetadataDatabase", 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const store = db.createObjectStore("fileMetadata", { keyPath: "id" });
      // Create an index on the fileName field for querying by name
      store.createIndex("fileNameIndex", "name", { unique: false });
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
    };

    request.onerror = (event) => {
      console.error("Error opening database", event);
    };
  }

  async saveFileMetadata(id: number, name: string): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction("fileMetadata", "readwrite");
    const store = transaction.objectStore("fileMetadata");
    const request = store.put({ id, name });

    request.onsuccess = () => {
      console.log("File metadata stored successfully");
    };

    request.onerror = (event) => {
      console.error("Error storing file metadata", event);
    };
  }

  async getFileIdByName(name: string): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject("Database not initialized");

      const transaction = this.db.transaction("fileMetadata", "readonly");
      const store = transaction.objectStore("fileMetadata");
      const index = store.index("fileNameIndex");
      const request = index.get(name);

      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        resolve(result ? result.id : undefined);
      };

      request.onerror = (event) => {
        console.error("Error retrieving file ID by name", event);
        reject(event);
      };
    });
  }

  async getAllFileMetadata(): Promise<{ id: number; name: string }[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject("Database not initialized");

      const transaction = this.db.transaction("fileMetadata", "readonly");
      const store = transaction.objectStore("fileMetadata");
      const request = store.getAll();

      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result);
      };

      request.onerror = (event) => {
        console.error("Error retrieving all file metadata", event);
        reject(event);
      };
    });
  }
}

export const fileMetadataStorage = new FileMetadataStorage();
