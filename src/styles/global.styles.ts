import { theme } from './Theme';
import { IStyle } from "fela";

export const baseStyle: IStyle = {
    backgroundColor: theme.pallette.navy40,
    padding: 0,
    margin: 0,
};

export const globalStyle: IStyle = {
    boxSizing: 'border-box'
}
