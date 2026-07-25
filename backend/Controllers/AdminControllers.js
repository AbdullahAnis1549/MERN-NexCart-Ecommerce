import User from "../Models/UserSchema.js";
import Product from "../Models/ProductSchema.js";
import Category from "../Models/CategorySchema.js";
import Order from "../Models/OrderSchema.js";
import Review from "../Models/ReviewSchema.js";

// ═══════════════════════════════════════════════════
//  DASHBOARD STATS
// ═══════════════════════════════════════════════════

export const GetDashboardStats = async (req, res) => {
  try {
    // ── Basic Counts ──
    const [totalUsers, totalProducts, totalCategories, totalOrders, totalReviews] =
      await Promise.all([
        User.countDocuments({ role: "user" }),
        Product.countDocuments(),
        Category.countDocuments(),
        Order.countDocuments(),
        Review.countDocuments()
      ]);

    // ── Revenue (confirmed/shipped/delivered orders) ──
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ["CONFIRMED", "SHIPPED", "DELIVERED"] } } },
      { $group: { _id: null, totalRevenue: { $sum: "$grandTotal" } } }
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // ── Orders by Status ──
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const statusMap = {};
    ordersByStatus.forEach((s) => { statusMap[s._id] = s.count; });

    // ── Monthly Revenue (last 6 months) ──
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $in: ["CONFIRMED", "SHIPPED", "DELIVERED"] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$grandTotal" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // ── Top 5 Selling Products ──
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.priceAtPurchase", "$items.quantity"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 1,
          totalSold: 1,
          totalRevenue: 1,
          name: "$product.name",
          productimage: "$product.productimage",
          price: "$product.price"
        }
      }
    ]);

    // ── Recent 10 Orders ──
    const recentOrders = await Order.find()
      .populate("userId", "name email")
      .populate("items.productId", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    // ── Low Stock Products (stock <= 5) ──
    const lowStockProducts = await Product.find({ mainStock: { $lte: 5 } })
      .populate("catid", "name")
      .select("name mainStock price productimage")
      .sort({ mainStock: 1 })
      .limit(10);

    return res.status(200).json({
      status: "success",
      data: {
        counts: {
          totalUsers,
          totalProducts,
          totalCategories,
          totalOrders,
          totalReviews,
          totalRevenue
        },
        ordersByStatus: {
          PENDING: statusMap["PENDING"] || 0,
          CONFIRMED: statusMap["CONFIRMED"] || 0,
          SHIPPED: statusMap["SHIPPED"] || 0,
          DELIVERED: statusMap["DELIVERED"] || 0,
          CANCELLED: statusMap["CANCELLED"] || 0
        },
        monthlyRevenue,
        topProducts,
        recentOrders,
        lowStockProducts
      }
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "fail", message: "Something went wrong" });
  }
};

// ═══════════════════════════════════════════════════
//  USER MANAGEMENT (Admin)
// ═══════════════════════════════════════════════════

// Sab users list karo (search + pagination)
export const GetAllUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    const filter = { role: "user" };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-password -verifycode -resetpasscode")
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      data: users
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "fail", message: "Something went wrong" });
  }
};

// Single user detail + uske orders
export const GetUserDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password -verifycode -resetpasscode");
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    const orders = await Order.find({ userId: id })
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });

    const totalSpent = orders
      .filter((o) => ["CONFIRMED", "SHIPPED", "DELIVERED"].includes(o.status))
      .reduce((sum, o) => sum + (o.grandTotal || o.totalAmount), 0);

    return res.status(200).json({
      status: "success",
      data: { user, orders, totalSpent, totalOrders: orders.length }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "fail", message: "Something went wrong" });
  }
};

// User delete karo
export const DeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ status: "fail", message: "Admin ko delete nahi kar sakte" });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({ status: "success", message: "User delete ho gaya" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "fail", message: "Something went wrong" });
  }
};

// ═══════════════════════════════════════════════════
//  ORDER MANAGEMENT (Admin — additional endpoints)
// ═══════════════════════════════════════════════════

// Orders with filters (status, date range, search by user)
export const GetAllOrdersAdmin = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20, startDate, endDate } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    let query = Order.find(filter)
      .populate("userId", "name email phone")
      .populate("items.productId", "name productimage price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const [orders, totalCount] = await Promise.all([
      query,
      Order.countDocuments(filter)
    ]);

    // Agar search hai (user name/email) toh filter karo populated data se
    let filteredOrders = orders;
    if (search) {
      const s = search.toLowerCase();
      filteredOrders = orders.filter(
        (o) =>
          o.userId?.name?.toLowerCase().includes(s) ||
          o.userId?.email?.toLowerCase().includes(s) ||
          o._id.toString().includes(s)
      );
    }

    return res.status(200).json({
      status: "success",
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      data: filteredOrders
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "fail", message: "Something went wrong" });
  }
};

// Single order detail (admin)
export const GetOrderDetailAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("userId", "name email phone image")
      .populate("items.productId", "name productimage price catid");

    if (!order) {
      return res.status(404).json({ status: "fail", message: "Order not found" });
    }

    return res.status(200).json({ status: "success", data: order });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "fail", message: "Something went wrong" });
  }
};
