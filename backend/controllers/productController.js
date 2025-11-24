import { db } from '../config/firebase.js';
import { uploadToFirebaseStorage, deleteFromFirebaseStorage } from '../utils/uploadToStorage.js';

// Créer un produit
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, condition, brand, size } = req.body;
    const userId = req.user.uid;

    if (!title || !description || !price) {
      return res.status(400).json({ error: 'Titre, description et prix sont requis' });
    }

    // Upload des images
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToFirebaseStorage(file);
        imageUrls.push(url);
      }
    }

    const productData = {
      title,
      description,
      price: parseFloat(price),
      category: category || 'Autre',
      condition: condition || 'Bon état',
      brand: brand || '',
      size: size || '',
      images: imageUrls,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'available',
      views: 0,
      likes: []
    };

    const productRef = await db.collection('products').add(productData);
    
    res.status(201).json({
      id: productRef.id,
      ...productData
    });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer tous les produits avec filtres
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 25,
      sort = 'desc',
      minPrice,
      maxPrice,
      category,
      search
    } = req.query;

    // Requête simple sans index composé
    let query = db.collection('products').where('status', '==', 'available');

    const snapshot = await query.get();
    let products = [];

    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Filtres côté serveur (pas besoin d'index)
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Filtre de recherche
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Tri côté serveur
    products.sort((a, b) => {
      if (sort === 'asc') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = products.slice(startIndex, endIndex);

    res.json({
      products: paginatedProducts,
      total: products.length,
      page: parseInt(page),
      totalPages: Math.ceil(products.length / parseInt(limit))
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer un produit par ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productDoc = await db.collection('products').doc(id).get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Incrémenter les vues
    await db.collection('products').doc(id).update({
      views: (productDoc.data().views || 0) + 1
    });

    res.json({
      id: productDoc.id,
      ...productDoc.data()
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Mettre à jour un produit
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    const updates = req.body;

    const productDoc = await db.collection('products').doc(id).get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    if (productDoc.data().userId !== userId) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    // Upload de nouvelles images si présentes
    if (req.files && req.files.length > 0) {
      const newImageUrls = [];
      for (const file of req.files) {
        const url = await uploadToFirebaseStorage(file);
        newImageUrls.push(url);
      }
      updates.images = [...(productDoc.data().images || []), ...newImageUrls];
    }

    updates.updatedAt = new Date().toISOString();

    await db.collection('products').doc(id).update(updates);

    const updatedDoc = await db.collection('products').doc(id).get();
    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Supprimer un produit
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const productDoc = await db.collection('products').doc(id).get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    if (productDoc.data().userId !== userId) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    // Supprimer les images du storage
    const images = productDoc.data().images || [];
    for (const imageUrl of images) {
      try {
        await deleteFromFirebaseStorage(imageUrl);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'image:', error);
      }
    }

    await db.collection('products').doc(id).delete();
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Liker/Unliker un produit
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const productDoc = await db.collection('products').doc(id).get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    const likes = productDoc.data().likes || [];
    const index = likes.indexOf(userId);

    if (index > -1) {
      likes.splice(index, 1);
    } else {
      likes.push(userId);
    }

    await db.collection('products').doc(id).update({ likes });

    res.json({ likes });
  } catch (error) {
    console.error('Erreur lors du like:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer les produits d'un utilisateur
export const getUserProducts = async (req, res) => {
  try {
    const { userId } = req.params;

    const snapshot = await db.collection('products')
      .where('userId', '==', userId)
      .get();

    const products = [];
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Tri côté serveur (pas besoin d'index)
    products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
