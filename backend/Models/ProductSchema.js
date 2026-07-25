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
    }
});

const Product = mongoose.model("Product", productSchema);

export default Product;