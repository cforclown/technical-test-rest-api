const mongoose = require("mongoose");

class UserDao {
    constructor() {
        this.create = this.create.bind(this);

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.find = this.find.bind(this);
        this.authenticate = this.authenticate.bind(this);

        this.update = this.update.bind(this);

        this.delete = this.delete.bind(this);
    }

    async create({ email, hashedPassword, name, dob, address, description }) {
        const userDoc = new mongoose.model("User")({
            email,
            password: hashedPassword,
            name,
            dob,
            address,
            description,
        });
        await userDoc.save();

        return userDoc;
    }

    get(userId) {
        return mongoose.model("User").findById(userId).select("-password").exec();
    }
    authenticate(email, hashedPass) {
        return mongoose
            .model("User")
            .findOne({
                email: email,
                password: hashedPass,
            })
            .select("-password")
            .exec();
    }
    getAll() {
        return mongoose.model("User").find({}).select("-password").exec();
    }
    find(query) {
        return mongoose
            .model("User")
            .find({
                fullname: { $regex: query, $options: "i" },
            })
            .select("-password")
            .exec();
    }

    async update({ _id, name, dob, address, description }) {
        const result = await mongoose.model("User").updateOne(
            { _id: _id },
            {
                $set: {
                    name,
                    dob,
                    address,
                    description,
                },
            }
        );
        if (result.n === 0) {
            return null;
        }

        return { _id, name, dob, address, description };
    }

    async delete(userId) {
        const res = await mongoose.model("User").deleteOne({ _id: userId }).exec();
        if (res.n === 0) {
            return null;
        }
        return userId;
    }
}

module.exports = new UserDao();
