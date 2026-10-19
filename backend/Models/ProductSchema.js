import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "name required"]
    },
    pdescription: {
        type: String,
        required: [true, "description required"]
    },
    productimage: {
        type: String
    },
    price: {
        type: Number,
        required: [true, "price required"]
    },
    mainStock: {
        type: Number,
        required: [true, "mainStock required"],
        min: [0, "mainStock must be >= 0"]
    },
    catid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    isBestSeller: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    salePrice: {
        type: Number,
        default: null,
        min: [0, "salePrice must be >= 0"]
    },
    saleStartDate: {
        type: Date,
        default: null
    },
    saleEndDate: {
        type: Date,
        default: null
    },
    colors: [
        {
            name: { type: String, trim: true },
            hex: { type: String, trim: true }
        }
    ],
    sizes: [
        { type: String, trim: true }
    ],
    variants: [
        {
            color: { type: String, trim: true },
            size: { type: String, trim: true },
            stock: { type: Number, default: 0, min: 0 }
        }
    ],
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0,
        min: 0
    },
    hasSeededAttributes: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;