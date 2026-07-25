import mongoose from 'mongoose'

const BannerSchema = mongoose.Schema({
        title: {
                type:String,
                required:true
        },
        description:{
                type:String,
                required:true
        },
        imageurl:{
                type:String
        }
        
})
const Banner = mongoose.model('Banner',BannerSchema)
export default Banner