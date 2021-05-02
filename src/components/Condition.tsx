import React, { FC, Fragment } from "react";

interface ConditionIfProps {
    condition: boolean;
}

const IF: FC<ConditionIfProps> = ({ children }) => {
    return <Fragment>{children}</Fragment>;
};

const ELSE: FC = ({ children }) => {
    return <Fragment>{children}</Fragment>;
};

interface ICondition extends FC {
    IF: FC<ConditionIfProps>;
    Else: FC;
}

const Condition: ICondition = ({ children }) => {
    const innerChildren = React.Children.toArray(
        children
    ) as React.ReactElement[];

    const [current] = innerChildren.filter((child) => {
        const { props = {} } = child;
        return props.condition ?? false;
    });

    const [otherwise] = innerChildren.filter((child) => {
        const { props = {} } = child;
        return props.condition === undefined;
    });

    if (current) {
        return <Fragment>{current}</Fragment>;
    }

    if (otherwise) {
        return <Fragment>{otherwise}</Fragment>;
    }

    return <Fragment />;
};

Condition.IF = IF;
Condition.Else = ELSE;

export default Condition;
