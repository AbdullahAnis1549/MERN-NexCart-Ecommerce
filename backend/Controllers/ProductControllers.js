import Product from "../Models/ProductSchema.js";
import { uploadImage } from "../utils/Uploadimage.js";
import { formatProduct, formatProducts } from "../utils/productHelper.js";

const safeJsonParse = (val, fallback = []) => {
    if (!val) return fallback;
    if (Array.isArray(val)) return val;
    try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch {
        return fallback;
    }
};

export const GetAllProduct = async (req, res) => {
    try {
        const {
            search,
            catid,
            minPrice,
            maxPrice,
            isBestSeller,
            isFeatured,
            page = 1,
            limit = 10
        } = req.query;

        // Filter object banao
        const filter = {};

        // Name search (case-insensitive)
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        // Category filter
        if (catid) {
            filter.catid = catid;
        }

        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Best Seller filter
        if (isBestSeller !== undefined) {
            filter.isBestSeller = isBestSeller === "true" || isBestSeller === true;
        }

        // Featured filter
        if (isFeatured !== undefined) {
            filter.isFeatured = isFeatured === "true" || isFeatured === true;
        }

        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(50, Math.max(1, Number(limit))); // max 50 per page
        const skip = (pageNum - 1) * limitNum;

        // Total count (pagination ke liye)
        const totalCount = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / limitNum);

        const products = await Product.find(filter)
            .populate("catid")
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: "success",
            totalCount,
            totalPages,
            currentPage: pageNum,
            limit: limitNum,
            data: formatProducts(products)
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: "fail",
            message: "Something went wrong"
        });
    }
};


// CREATE PRODUCT
export const CreateProduct = async (req, res) => {
    try {
        const {
            pname,
            pprice,
            catid,
            pdescription,
            mainStock,
            isBestSeller,
            isFeatured,
            salePrice,
            saleStartDate,
            saleEndDate,
            colors,
            sizes,
            variants
        } = req.body;

        if (!pname || !pprice || !catid || mainStock === undefined || !req.file || !pdescription) {
            return res.status(400).json({
                status: "fail",
                message: "all fields are required"
            });
        }

        const parsedColors = safeJsonParse(colors, []);
        const parsedSizes = safeJsonParse(sizes, []);
        const parsedVariants = safeJsonParse(variants, []);

        let computedStock = Number(mainStock);
        if (parsedVariants.length > 0) {
            // Keep mainStock in sync with sum of variant stocks
            computedStock = parsedVariants.reduce((sum, v) => sum + Number(v.stock || 0), 0);
        }

        const pro = await Product.create({
            name: pname,
            price: Number(pprice),
            catid: catid,
            productimage: req.file.path,
            pdescription: pdescription,
            mainStock: computedStock,
            isBestSeller: isBestSeller === true || isBestSeller === "true",
            isFeatured: isFeatured === true || isFeatured === "true",
            salePrice: salePrice ? Number(salePrice) : null,
            saleStartDate: saleStartDate ? new Date(saleStartDate) : null,
            saleEndDate: saleEndDate ? new Date(saleEndDate) : null,
            colors: parsedColors,
            sizes: parsedSizes,
            variants: parsedVariants
        });

        return res.status(201).json({
            status: "success",
            data: formatProduct(pro)
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: "fail",
            message: "Something went wrong"
        });
    }
};

// GET SINGLE PRODUCT
export const GetProduct = async (req, res) => {
    try {
        const id = req.params.id;

        const pro = await Product.findById(id).populate("catid");
        if (!pro) {
            return res.status(404).json({
                status: "fail",
                message: "Product not found"
            });
        }
        return res.status(200).json({
            status: "success",
            data: formatProduct(pro)
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: "fail",
            message: "Something went wrong"
        });
    }
};

// UPDATE PRODUCT
export const UpdateProduct = async (req, res) => {
    try {
        const {
            pname,
            pprice,
            catid,
            productdescription,
            pdescription,
            mainStock,
            isBestSeller,
            isFeatured,
            salePrice,
            saleStartDate,
            saleEndDate,
            colors,
            sizes,
            variants
        } = req.body;
        const id = req.params.id;

        const updateData = {};
        if (pname) updateData.name = pname;
        if (pprice) updateData.price = Number(pprice);
        if (catid) updateData.catid = catid;
        if (productdescription || pdescription) updateData.pdescription = productdescription || pdescription;
        if (isBestSeller !== undefined) updateData.isBestSeller = isBestSeller === true || isBestSeller === "true";
        if (isFeatured !== undefined) updateData.isFeatured = isFeatured === true || isFeatured === "true";
        if (req.file) updateData.productimage = req.file.path;

        if (salePrice !== undefined) updateData.salePrice = salePrice ? Number(salePrice) : null;
        if (saleStartDate !== undefined) updateData.saleStartDate = saleStartDate ? new Date(saleStartDate) : null;
        if (saleEndDate !== undefined) updateData.saleEndDate = saleEndDate ? new Date(saleEndDate) : null;

        if (colors !== undefined) updateData.colors = safeJsonParse(colors, []);
        if (sizes !== undefined) updateData.sizes = safeJsonParse(sizes, []);

        if (variants !== undefined) {
            const parsedVariants = safeJsonParse(variants, []);
            updateData.variants = parsedVariants;
            if (parsedVariants.length > 0) {
                updateData.mainStock = parsedVariants.reduce((sum, v) => sum + Number(v.stock || 0), 0);
            } else if (mainStock !== undefined) {
                updateData.mainStock = Number(mainStock);
            }
        } else if (mainStock !== undefined) {
            updateData.mainStock = Number(mainStock);
        }

        const pro = await Product.findByIdAndUpdate(id, updateData, {
            returnDocument: "after",
            runValidators: true
        }).populate("catid");

        if (!pro) {
            return res.status(404).json({
                status: "fail",
                message: "Product not found"
            });
        }

        return res.status(200).json({
            status: "success",
            data: formatProduct(pro)
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: "fail",
            message: "Something went wrong"
        });
    }
};

// DELETE PRODUCT
export const DeleteProduct = async (req, res) => {
    try {
        const id = req.params.id;

        const pro = await Product.findByIdAndDelete(id);
        if (!pro) {
            return res.status(404).json({
                status: "fail",
                message: "Product not found"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Product deleted successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: "fail",
            message: "Something went wrong"
        });
    }
};