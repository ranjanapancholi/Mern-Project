const mongoose =require('mongoose');
const bcryptjs=require('bcryptjs');
const userSchema =new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        unique:true
    },
    lastname:{
        type:String,
        required:true,
        unique:true

    },
    email:{
        type:String,
        required:true,
        unique:true


    },
    password:{
    type:String,
        required:true,
        unique:true
    },
    tokens:[
        {
            token:{
                type:String,
                required:true,
            }
        }
    ]
    
})
userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = bcryptjs.hashSync(this.password, 10);
    }
    next();
})

userSchema.methods.generateToken = async function(){
    try {
        let generateToken = jwt.sign({_id : this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token : generateToken});
        await this.save();
        return generateToken;
    }catch(error){
        console.log(error)
    }
}
const Users=new mongoose.model("USER",userSchema);
module.exports =Users;