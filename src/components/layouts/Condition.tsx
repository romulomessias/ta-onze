import React, { FC, Fragment } from "react";

interface ConditionIfProps {
    condition: boolean;
}

export const IF: FC<ConditionIfProps> = ({ children, condition }) => {
    return <Fragment>{condition && children}</Fragment>;
};

const ELSE: FC = ({ children }) => {
    return <Fragment>{children}</Fragment>;
};

interface IConditionGroup extends FC {
    IF: FC<ConditionIfProps>;
    Else: FC;
}

const ConditionGroup: IConditionGroup = ({ children }) => {
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

ConditionGroup.IF = IF;
ConditionGroup.Else = ELSE;

export default ConditionGroup;
