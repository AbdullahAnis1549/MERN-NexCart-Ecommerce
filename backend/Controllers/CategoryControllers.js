import Category from "../Models/CategorySchema.js";

export const GetAllCategory = async (req, res) => {
    try {
        const cat = await Category.find()
        return res.status(200).json({
            status: "success",
            data: cat
        })


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: "fail",
            message: "Something went wrong"
        })
    }
};

export const CreateCategory = async (req, res) => {
    try {
        const { cname } = req.body;
        if (!cname || !req.file) {
            return res.status(400).json({
                status: "fail",
                message: "please enter all fields"
            })
        }
        const cat = await Category.create({
            name: cname,
            imageurl: req.file.path
        })
        return res.status(200).json({
            status: "success",
            data: cat
        })
    }
    catch (err) {
        return res.status(500).json({
            status: "fail",
            message: "Something went wrong"
        })
    }
};

export const GetCategory = async (req, res) => {
    try {
        const id = req.params.id
        const cat = await Category.findById(id)
        return res.status(200).json({
            status: "success",
            data: cat
        })


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: "fail",
            message: "Something went wrong"
        })
    }
};



export const UpdateCategory = async (req, res) => {
    try {
        const { cname } = req.body;
        const { id } = req.params;

        const updateData = {};

        if (cname) {
            updateData.name = cname;
        }

        if (req.file) {
            updateData.imageurl = req.file.path;
        }

        const cat = await Category.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!cat) {
            return res.status(404).json({
                status: "fail",
                message: "Category not found"
            });
        }

        return res.status(200).json({
            status: "success",
            data: cat
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: "fail",
            message: "Something went wrong"
        });
    }
};


export const DeleteCategory = async (req, res) => {
    try {

        const id = req.params.id

        await Category.findByIdAndDelete(id)
        return res.status(200).json({
            status: "success",

        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: "fail",
            message: "Something went wrong"
        })
    }
};