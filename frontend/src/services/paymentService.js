import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { auth } from '../config/firebase';

export const paymentService = {
  // Créer une transaction (simplifié sans Stripe pour l'instant)
  createTransaction: async (productId, amount) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Vous devez être connecté');
    }

    const transactionData = {
      productId,
      buyerId: user.uid,
      amount,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'transactions'), transactionData);
    
    return {
      id: docRef.id,
      ...transactionData
    };
  },

  // Récupérer les transactions
  getTransactions: async () => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Vous devez être connecté');
    }

    // Récupérer les achats
    const purchasesQuery = query(
      collection(db, 'transactions'),
      where('buyerId', '==', user.uid)
    );
    const purchasesSnapshot = await getDocs(purchasesQuery);
    const purchases = [];
    purchasesSnapshot.forEach((doc) => {
      purchases.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Récupérer les ventes (produits vendus)
    const salesQuery = query(
      collection(db, 'transactions'),
      where('sellerId', '==', user.uid)
    );
    const salesSnapshot = await getDocs(salesQuery);
    const sales = [];
    salesSnapshot.forEach((doc) => {
      sales.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return {
      purchases,
      sales
    };
  },
};
