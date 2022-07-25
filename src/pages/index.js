import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import React from 'react';
import style from './index.module.css';

function Landing() {
  return (
    <Layout>
    <section className={style.intro}>
      <div className={style.bgPrimary}>
        <div className={`${style.wrap} ${style.gridTwo}`}>
          <div>
            <h1>Lightweight Kubernetes</h1>
            <h4>The certified Kubernetes distribution built for IoT & Edge computing</h4>
          </div>
          <div>
            <h4>This won't take long…</h4>
            <CodeBlock className="language-sh">{
`curl -sfL https://get.k3s.io | sh - 
# Check for Ready node, takes ~30 seconds 
k3s kubectl get node `
            }</CodeBlock>
            <p>For detailed installation, <a href="https://rancher.com/docs/k3s/latest/en/">refer to the docs</a></p>
          </div>
        </div>
      </div>
      <div className={style.folder}>
        <h4>Great For</h4>
        <div className={`${style.bgLight} ${style.gridDynamic} ${style.textCenter}`}>
          <h5>Edge</h5>
          <h5>IoT</h5>
          <h5>CI</h5>
          <h5>ARM</h5>
        </div>
      </div>
    </section>
    
    </Layout>
  );
}

export default Landing