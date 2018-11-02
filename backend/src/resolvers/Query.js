const Query = {
    // the queries from the schema.graphql file have to be "implemented" here
    dogs(parent, args, context, info) {
        const dogs = global.dogs || [];
        return dogs;
    }
};

module.exports = Query;
