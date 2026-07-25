import Banner from "../Models/BannerSchema.js";

export const CreateBanner = async (req, res) => {

        try {

                const { bannertitle, bannerdescription } = req.body || {};

                if (!bannertitle || !bannerdescription || !req.file) {
                        return res.status(400).json({
                                status: 'fail',
                                message: 'please enter all fields'
                        });
                }

                const banner = await Banner.create({
                        title: bannertitle,
                        description: bannerdescription,

                        // Cloudinary image URL
                        imageurl: req.file.path
                });

                return res.status(200).json({
                        status: 'success',
                        data: banner
                });

        } catch (err) {

                console.log(err);

                return res.status(500).json({
                        status: 'fail',
                        message: 'something went wrong'
                });
        }
};

export const GetAllBanners = async (req, res) => {
        try {
                const Ban = await Banner.find()
                return res.status(200).json({
                        status: "success",
                        data: Ban
                })


        } catch (err) {
                console.log(err);
                return res.status(500).json({
                        status: "fail",
                        message: "Something went wrong"
                })
        }
};


export const UpdateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { bannertitle, bannerdescription } = req.body;

        const updateData = {};

        if (bannertitle !== undefined) {
            updateData.title = bannertitle;
        }

        if (bannerdescription !== undefined) {
            updateData.description = bannerdescription;
        }

        if (req.file) {
            updateData.imageurl = req.file.path;
        }

        const banner = await Banner.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!banner) {
            return res.status(404).json({
                status: "fail",
                message: "Banner not found"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Banner updated successfully",
            data: banner
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            status: "fail",
            message: "Something went wrong"
        });
    }
};

export const DeleteBanner = async (req, res) => {
    try {

        const id = req.params.id

        await Banner.findByIdAndDelete(id)
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