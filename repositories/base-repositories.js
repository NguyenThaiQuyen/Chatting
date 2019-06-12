module.exports = class BaseRepositories {
    constructor(model) {
        this.model = model;
    };

    getOne(option) {
        return this.model.findOne(option).lean();
    }

    getAll(option) {
        return this.model.find(option).lean();
    };

    create(data) {
        if (Array.isArray(data)) {
            return this.model.createMany(data);
        }
        return this.model.create(data);
    };

    update(id, data) {
        return this.model.findByIdAndUpdate(id, data, {new: true}).lean();
    };
}