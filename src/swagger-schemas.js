module.exports = {
    register: {
        type: "object",
        properties: {
            email: { type: "string" },
            password: { type: "string" },
            confirmPassword: { type: "string" },
            name: { type: "string" },
            dob: { type: "date" },
            address: { type: "string" },
            description: { type: "string" },
        },
    },
    login: {
        type: "object",
        properties: {
            username: { type: "string" },
            password: { type: "string" },
        },
    },
    refreshToken: {
        type: "object",
        properties: {
            refreshToken: { type: "string" },
        },
    },

    createUser: {
        type: "object",
        properties: {
            email: { type: "string" },
            password: { type: "string" },
            confirmPassword: { type: "string" },
            name: { type: "string" },
            dob: { type: "date" },
            address: { type: "string" },
            description: { type: "string" },
        },
    },
    editUser: {
        type: "object",
        properties: {
            _id: { type: "string" },
            name: { type: "string" },
            dob: { type: "date" },
            address: { type: "string" },
            description: { type: "string" },
        },
    },
};
