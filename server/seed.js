import { Category } from './models/Category.js';
import { Product } from './models/Product.js';
import { Coupon } from './models/Coupon.js';
import { AdminUser } from './models/AdminUser.js';
import { Order } from './models/Order.js';

export const seedDatabase = async () => {
  try {
    // 1. Seed Categories if empty
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('🌱 Seeding initial categories into Mongoose...');
      const initialCategories = [
        { name: 'Spices & Masalas', slug: 'spices', description: 'Pure, authentic stone-ground spices', displayOrder: 1, isActive: true },
        { name: 'Traditional Oils', slug: 'traditional-oils', description: 'Cold-pressed unrefined wood-pressed oils', displayOrder: 2, isActive: true },
        { name: 'Natural Food & Sweets', slug: 'natural-food', description: 'Raw forest honey, organic jaggery, & natural treats', displayOrder: 3, isActive: true },
        { name: 'Herbal Teas', slug: 'herbal-teas', description: 'Wellness infusions and traditional herbal tea blends', displayOrder: 4, isActive: true },
      ];
      await Category.insertMany(initialCategories);
      console.log('✅ Categories seeded successfully.');
    }

    // 2. Seed Admin User if empty
    const adminCount = await AdminUser.countDocuments();
    if (adminCount === 0) {
      console.log('🌱 Seeding initial executive admin account into Mongoose...');
      await AdminUser.create({
        name: 'Master Admin',
        email: 'admin@aham.com',
        password: 'Admin@123456',
        role: 'SUPER_ADMIN',
        permissions: ['MANAGE_PRODUCTS', 'MANAGE_ORDERS', 'MANAGE_CATEGORIES', 'MANAGE_COUPONS', 'MANAGE_USERS', 'VIEW_AUDIT_LOGS'],
        isActive: true,
      });
      console.log('✅ Master Admin account seeded.');
    }

    // 3. Seed Products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('🌱 Seeding initial products into Mongoose...');

      const spicesCat = await Category.findOne({ slug: 'spices' });
      const oilsCat = await Category.findOne({ slug: 'traditional-oils' });
      const foodCat = await Category.findOne({ slug: 'natural-food' });

      const initialProducts = [
        {
          name: 'Aham Natural Turmeric Powder',
          slug: 'aham-natural-turmeric-powder',
          sku: 'AHM-TUR-250',
          category: spicesCat ? spicesCat._id : null,
          category_name: 'Spices & Masalas',
          description: '100% natural, high-curcumin turmeric powder milled using traditional slow methods.',
          short_description: 'Stone-ground natural turmeric powder with rich aroma.',
          price: 399,
          compare_at_price: 499,
          cost_price: 180,
          stock_quantity: 100,
          low_stock_threshold: 15,
          unit: 'g',
          weight: '250g',
          images: [{ url: 'https://images.unsplash.com/photo-1615486171448-4fd325a8ee58?auto=format&fit=crop&q=80&w=800', is_primary: true }],
          status: 'PUBLISHED',
          is_active: true,
          is_featured: true,
          rating: 4.8,
          reviewCount: 24,
        },
        {
          name: 'Cold-Pressed Sesame Oil (Mara Chekku)',
          slug: 'cold-pressed-sesame-oil',
          sku: 'AHM-OIL-SES-500',
          category: oilsCat ? oilsCat._id : null,
          category_name: 'Traditional Oils',
          description: 'Traditional wood-pressed sesame oil extracted without solvent or high heat processing.',
          short_description: 'Pure wood-pressed sesame oil.',
          price: 450,
          compare_at_price: 550,
          cost_price: 250,
          stock_quantity: 8,
          low_stock_threshold: 15,
          unit: 'ml',
          weight: '500ml',
          images: [{ url: 'https://images.unsplash.com/photo-1474625121024-7595bfbc57ac?auto=format&fit=crop&q=80&w=800', is_primary: true }],
          status: 'PUBLISHED',
          is_active: true,
          is_featured: true,
          rating: 4.9,
          reviewCount: 38,
        },
        {
          name: 'Raw Wild Forest Honey',
          slug: 'raw-wild-forest-honey',
          sku: 'AHM-HON-500',
          category: foodCat ? foodCat._id : null,
          category_name: 'Natural Food & Sweets',
          description: 'Unprocessed, unpasteurized pure wild forest honey harvested sustainably by native honey foragers.',
          short_description: 'Pure, raw, unheated honey.',
          price: 650,
          compare_at_price: 799,
          cost_price: 350,
          stock_quantity: 45,
          low_stock_threshold: 10,
          unit: 'g',
          weight: '500g',
          images: [{ url: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&q=80&w=800', is_primary: true }],
          status: 'PUBLISHED',
          is_active: true,
          is_featured: false,
          rating: 4.7,
          reviewCount: 19,
        },
      ];

      await Product.insertMany(initialProducts);
      console.log('✅ Products seeded successfully.');
    }

    // 4. Seed Coupons if empty
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      console.log('🌱 Seeding initial coupons into Mongoose...');
      const initialCoupons = [
        { code: 'WELCOME10', discountType: 'PERCENTAGE', discountValue: 10, minOrderAmount: 499, isActive: true },
        { code: 'AHAM50', discountType: 'FLAT', discountValue: 50, minOrderAmount: 699, isActive: true },
      ];
      await Coupon.insertMany(initialCoupons);
      console.log('✅ Coupons seeded successfully.');
    }

    // 5. Seed Sample Orders if empty
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log('🌱 Seeding initial sample orders into Mongoose...');
      const sampleProduct = await Product.findOne();
      const initialOrders = [
        {
          orderNumber: 'AHM-10021',
          customer: { name: 'Ananya Ramesh', email: 'ananya@example.com', phone: '+91 9876543210' },
          shippingAddress: { street: '12 Green Park Road', city: 'Chennai', state: 'Tamil Nadu', pincode: '600018', country: 'India' },
          items: [
            {
              product: sampleProduct ? sampleProduct._id : null,
              name: sampleProduct ? sampleProduct.name : 'Aham Natural Turmeric Powder',
              sku: 'AHM-TUR-250',
              price: 399,
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1615486171448-4fd325a8ee58?auto=format&fit=crop&q=80&w=800',
            },
          ],
          subtotal: 798,
          tax: 0,
          shippingFee: 50,
          discount: 50,
          totalAmount: 798,
          paymentMethod: 'COD',
          paymentStatus: 'PENDING',
          orderStatus: 'PROCESSING',
          statusHistory: [{ status: 'PROCESSING', updatedBy: 'System Admin', note: 'Order confirmed and sent to warehouse' }],
          fulfillment: { carrier: 'BlueDart Express', trackingNumber: 'BD-98214732', trackingUrl: 'https://bluedart.com' },
        },
      ];
      await Order.insertMany(initialOrders);
      console.log('✅ Sample orders seeded successfully.');
    }

  } catch (error) {
    console.error('❌ Error during database seeding:', error.message);
  }
};
