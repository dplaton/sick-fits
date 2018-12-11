import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { TransitionGroup, CSSTransition } from "react-transition-group";

/*
 * We customize the classes of the component so we have a flipping effect   
*/
const AnimationStyles = styled.span`
    position: relative;
    .count {
        display: block;
        position: relative;
        transition: all .4s;
        backface-visibility: hidden;
    }
    .count-enter {
        transform: scale(4) rotateX(0.5turn);
    }
    .count-enter-active {
        transform: rotateX(0);
    }
    .count-exit {
        top:0;
        position:absolute;
        transform: rotateX(0);
    }
    .count-exit-active {
        transform: scale(4) rotateX(0.5turn);
    }
`;

const Dot = styled.div`
    background: ${props => props.theme.red};
    border-radius: 50%;
    color: white;
    font-weight: 100;
    font-feature-settings: "tnum";
    font-variant-numeric: tabular-nums;
    line-height: 2rem;
    min-width: 3rem;
    margin-left: 1rem;
    padding: 0.5rem;
`;

/*
 * Using the TransitionGroup and the CSSTransition allows us to add a nice animation to the "cart count" badge
 * What React is doing is basically unmounting a component with count = x and mounting another one with count=x+1. 
 * In this proces React exposes a bunch of CSS classes so we can style the components (both the unmounted one and the mounted one)
 * 
 */
const CartCount = ({ count }) => (
    <AnimationStyles>
        <TransitionGroup>
            <CSSTransition
                unmountOnExit
                className="count"
                classNames="count"
                timeout={{ enter: 400, exit: 400 }}
                key={count}
            >
                <Dot>{count}</Dot>
            </CSSTransition>
        </TransitionGroup>
    </AnimationStyles>
);

export default CartCount;
