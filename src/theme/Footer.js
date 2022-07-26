import React from 'react';
import Footer from '@theme-original/Footer';
import index from '../pages/index.module.css';

// The K3s logo and landing page is copyright under CNCF, not SUSE, 
// so we need a custom footer for it.
export default function FooterWrapper(props) {
    var path = window.location.pathname
    if (path === "/") {
    return (
        <>
            <section className={index.cncfFooter}>
                Copyright © {new Date().getFullYear()} K3s Project Authors. All rights reserved. The Linux Foundation has registered trademarks
                and uses trademarks. For a list of trademarks of The Linux Foundation, 
                please see our <a href="https://www.linuxfoundation.org/trademark-usage"> Trademark Usage</a> page.
            </section>
        </>
    );
    } else {
    return (
        <>
            <Footer {...props} />
        </>
    );
    }
}