interface FileData {
  id: number;
  name: string;
  type: string;
  data: File;
}

class FileStorage {
  private dbName: string;
  private storeName: string;

  constructor(dbName: string = "FileDatabase", storeName: string = "files") {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  private async openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore(this.storeName, { keyPath: "id" });
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }

  public async storeFile(file: File): Promise<FileData> {
    const db = await this.openDatabase();
    const transaction = db.transaction(this.storeName, "readwrite");
    const store = transaction.objectStore(this.storeName);

    const fileData = {
      id: Date.now(),
      name: file.name,
      type: file.type,
      data: file,
    };

    return new Promise((resolve, reject) => {
      const request = store.put(fileData);

      request.onsuccess = () => {
        resolve(fileData);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }

  public async retrieveFile(fileId: number): Promise<FileData | null> {
    const db = await this.openDatabase();
    const transaction = db.transaction(this.storeName, "readonly");
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(fileId);

      request.onsuccess = (event) => {
        const fileData = (event.target as IDBRequest).result;
        if (fileData) {
          resolve(fileData);
        } else {
          resolve(null);
        }
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }
}

export default FileStorage;
