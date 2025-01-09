const Parent = require('../models/Parent');
const User = require('../models/User');


exports.editParentProfile = async(req,res)=>{
    try{
        const {updatedData} = req.body;
        if(!updatedData){
            return res.status(400).json({message:'No new data provided to update.'})
        };

        const loggedInId = req.user && req.user.id;
            if(!loggedInId){
              return res.status(401).json({message:'Unauthorized'})
            };
        
            const loggedInUser = await User.findById(loggedInId);
            if(!loggedInUser || loggedInUser.role!=='parent'){
              return res.status(403).json({message:"Access denied, only logged-in parents can access."})
            };

            const parent = await Parent.findOne({userId:loggedInId});
            if(!parent){
                return res.status(404).json({message:'No parent found with the userId.'})
            };

            const restrictedFields = ['parentOf'];

            for (let key in updatedData){
                if (parent.parentProfile.hasOwnProperty(key)){
                    if(restrictedFields.includes(key)){
                        return res.status(404).json({message:'You are not allowed to change the parentOf field'})
                    };
                    parent.parentProfile[key] = updatedData[key];
                }
            }
            await parent.save();

            res.status(200).json({
                message:'Profile updated successfully',
                updatedProfile:parent,
            });
    }
    catch (err) {
        res.status(500).json({
            message:'Internal server error.',
            error:err.message,
        });
    }
};