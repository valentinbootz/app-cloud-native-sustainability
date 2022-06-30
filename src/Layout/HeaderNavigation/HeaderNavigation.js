import * as React from 'react';
import { Link as Link } from "react-router-dom";
import { StyledLink } from 'baseui/link';
import { Button } from 'baseui/button';
import {
    HeaderNavigation,
    ALIGN,
    StyledNavigationItem as NavigationItem,
    StyledNavigationList as NavigationList,
} from 'baseui/header-navigation';
import { withStyle } from 'baseui';

const StyledNavigationItem = withStyle(NavigationItem, () => ({
    marginRight: '10px'
}));

export default function () {

    return (
        <HeaderNavigation>
            <NavigationList $align={ALIGN.left}>
                <NavigationItem>
                    <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
                        Cloud Native Sustainability
                    </Link>
                </NavigationItem>
            </NavigationList>
            <NavigationList $align={ALIGN.center} />
            <NavigationList $align={ALIGN.right}>
                <NavigationItem>
                    <StyledLink href="#basic-link1">GitHub</StyledLink>
                </NavigationItem>
            </NavigationList>
            <NavigationList $align={ALIGN.right}>
                <StyledNavigationItem>
                    <Link to="/app" style={{ textDecoration: 'none' }}>
                        <Button>
                            Get started
                        </Button>
                    </Link>
                </StyledNavigationItem>
            </NavigationList>
        </HeaderNavigation>
    );
}