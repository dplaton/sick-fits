const {forwardTo} = require('prisma-binding');

/**
 * The queries from the schema.graphql file have to be "implemented" here
 */
const Query = {
    // we can "forward" the query to the db instead of passing it through Yoga
    items: forwardTo('db')

    // async items(parent, args, context, info) {
    //    const items = await context.db.query.items()
    //    return items;
    // }
};

module.exports = Query;
