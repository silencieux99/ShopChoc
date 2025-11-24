import Stripe from 'stripe';
import { db } from '../config/firebase.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Créer une session de paiement
export const createCheckoutSession = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.uid;

    // Récupérer le produit
    const productDoc = await db.collection('products').doc(productId).get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    const product = productDoc.data();

    if (product.status !== 'available') {
      return res.status(400).json({ error: 'Produit non disponible' });
    }

    if (product.userId === userId) {
      return res.status(400).json({ error: 'Vous ne pouvez pas acheter votre propre produit' });
    }

    // Frais de service (5%)
    const serviceFee = Math.round(product.price * 0.05 * 100);
    const totalAmount = Math.round(product.price * 100) + serviceFee;

    // Créer une session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: product.title,
              description: product.description,
              images: product.images?.slice(0, 1) || [],
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Frais de service ShopChoc',
            },
            unit_amount: serviceFee,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/product/${productId}`,
      metadata: {
        productId,
        buyerId: userId,
        sellerId: product.userId,
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Erreur lors de la création de la session de paiement:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Vérifier le statut du paiement
export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const { productId, buyerId, sellerId } = session.metadata;

      // Mettre à jour le statut du produit
      await db.collection('products').doc(productId).update({
        status: 'sold',
        soldAt: new Date().toISOString(),
        buyerId,
      });

      // Créer une transaction
      await db.collection('transactions').add({
        productId,
        buyerId,
        sellerId,
        amount: session.amount_total / 100,
        stripeSessionId: sessionId,
        createdAt: new Date().toISOString(),
        status: 'completed',
      });

      // Incrémenter le compteur de ventes du vendeur
      const sellerDoc = await db.collection('users').doc(sellerId).get();
      if (sellerDoc.exists) {
        await db.collection('users').doc(sellerId).update({
          salesCount: (sellerDoc.data().salesCount || 0) + 1,
        });
      }

      res.json({ 
        success: true, 
        message: 'Paiement réussi',
        productId 
      });
    } else {
      res.json({ 
        success: false, 
        message: 'Paiement en attente ou échoué' 
      });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du paiement:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer l'historique des transactions
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.uid;

    // Transactions en tant qu'acheteur
    const buyerSnapshot = await db.collection('transactions')
      .where('buyerId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    // Transactions en tant que vendeur
    const sellerSnapshot = await db.collection('transactions')
      .where('sellerId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const purchases = [];
    const sales = [];

    buyerSnapshot.forEach(doc => {
      purchases.push({
        id: doc.id,
        ...doc.data(),
        type: 'purchase'
      });
    });

    sellerSnapshot.forEach(doc => {
      sales.push({
        id: doc.id,
        ...doc.data(),
        type: 'sale'
      });
    });

    res.json({ purchases, sales });
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
