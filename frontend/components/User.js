import { Query } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";

const CURRENT_USER_QUERY = gql`
    query {
        me {
            id
            name
            email
            permissions
            cart {
                id
                quantity
                item {
                    id
                    title
                    price
                    image
                    description
                }
            }
        }
    }
`;

// this is how we build our own render prop
const User = props => (
    // the children of this component must be functions which receive the 'payload' as argument
    <Query {...props} query={CURRENT_USER_QUERY}>
        {payload => props.children(payload)}
    </Query>
);

User.propTypes = {
    children: PropTypes.func.isRequired
};

export default User;
export { CURRENT_USER_QUERY };
