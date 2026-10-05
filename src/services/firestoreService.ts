import { 
  collection, doc, setDoc, updateDoc, deleteDoc, 
  onSnapshot, getDocs, writeBatch 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Lead, Deal, Task, Invoice, Contact, Company } from '../types/crm';

export class FirestoreCRMService {
  // Test connection
  static isAvailable(): boolean {
    return !!db;
  }

  // Real-time synchronization listeners
  static subscribeToCollection<T>(
    collectionName: string, 
    onData: (items: T[]) => void,
    onError?: (err: any) => void
  ) {
    try {
      const colRef = collection(db, collectionName);
      return onSnapshot(colRef, (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as unknown as T[];
        onData(items);
      }, (error) => {
        console.warn(`Firestore subscription notice for [${collectionName}]:`, error.message);
        onError?.(error);
      });
    } catch (error) {
      console.warn(`Could not attach listener for [${collectionName}]:`, error);
      return () => {};
    }
  }

  // Seed initial data if database collection is empty
  static async seedIfEmpty(
    collectionName: string, 
    initialItems: any[]
  ) {
    try {
      const colRef = collection(db, collectionName);
      const snapshot = await getDocs(colRef);
      if (snapshot.empty && initialItems.length > 0) {
        console.log(`Seeding initial live records to Firestore collection [${collectionName}]...`);
        const batch = writeBatch(db);
        initialItems.forEach(item => {
          const docRef = doc(db, collectionName, String(item.id));
          batch.set(docRef, item);
        });
        await batch.commit();
        console.log(`Seeded ${initialItems.length} records to [${collectionName}].`);
      }
    } catch (error) {
      console.warn(`Initial seed skipped for [${collectionName}]:`, error);
    }
  }

  // Leads
  static async saveLead(lead: Lead) {
    try {
      await setDoc(doc(db, 'leads', lead.id), lead);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `leads/${lead.id}`);
    }
  }

  static async updateLead(id: string, updates: Partial<Lead>) {
    try {
      await updateDoc(doc(db, 'leads', id), updates as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `leads/${id}`);
    }
  }

  static async deleteLead(id: string) {
    try {
      await deleteDoc(doc(db, 'leads', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `leads/${id}`);
    }
  }

  // Deals
  static async saveDeal(deal: Deal) {
    try {
      await setDoc(doc(db, 'deals', deal.id), deal);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `deals/${deal.id}`);
    }
  }

  static async updateDeal(id: string, updates: Partial<Deal>) {
    try {
      await updateDoc(doc(db, 'deals', id), updates as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `deals/${id}`);
    }
  }

  static async deleteDeal(id: string) {
    try {
      await deleteDoc(doc(db, 'deals', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `deals/${id}`);
    }
  }

  // Tasks
  static async saveTask(task: Task) {
    try {
      await setDoc(doc(db, 'tasks', task.id), task);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `tasks/${task.id}`);
    }
  }

  static async updateTask(id: string, updates: Partial<Task>) {
    try {
      await updateDoc(doc(db, 'tasks', id), updates as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${id}`);
    }
  }

  static async deleteTask(id: string) {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tasks/${id}`);
    }
  }

  // Invoices
  static async saveInvoice(invoice: Invoice) {
    try {
      await setDoc(doc(db, 'invoices', invoice.id), invoice);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `invoices/${invoice.id}`);
    }
  }

  static async updateInvoice(id: string, updates: Partial<Invoice>) {
    try {
      await updateDoc(doc(db, 'invoices', id), updates as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `invoices/${id}`);
    }
  }

  static async deleteInvoice(id: string) {
    try {
      await deleteDoc(doc(db, 'invoices', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `invoices/${id}`);
    }
  }
}
