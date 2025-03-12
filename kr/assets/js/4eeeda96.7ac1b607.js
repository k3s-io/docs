"use strict";(self.webpackChunkk_3_s_docs=self.webpackChunkk_3_s_docs||[]).push([[5948],{5701:e=>{e.exports=JSON.parse('{"archive":{"blogPosts":[{"id":"/2025/03/10/simple-ha","metadata":{"permalink":"/kr/blog/2025/03/10/simple-ha","source":"@site/blog/2025-03-10-simple-ha.md","title":"The Basic HA Cluster","description":"Creating the simplest High Availability cluster with LB and upgrading","date":"2025-03-10T00:00:00.000Z","tags":[],"hasTruncateMarker":true,"authors":[{"title":"K3s maintainer","url":"https://github.com/dereknola","name":"Derek Nola","imageURL":"https://github.com/dereknola.png","key":"dereknola","page":null}],"frontMatter":{"title":"The Basic HA Cluster","description":"Creating the simplest High Availability cluster with LB and upgrading","authors":"dereknola","hide_table_of_contents":true},"unlisted":false,"nextItem":{"title":"Hello Blog","permalink":"/kr/blog/2025/03/09/hello-blog"}},"content":"While we have more [detailed docs](/datastore/ha-embedded/) on setting up a High Availability (HA) cluster, this post will cover the simplest HA cluster you can create. \\n\\n\x3c!-- truncate --\x3e\\n## Baseline HA Cluster \ud83d\udcbb\ud83d\udda5\ufe0f\ud83d\udcbb\\n\\nWhenever we get a question around HA, this is the cluster configuration I start with. It provides a solid foundation when deploying beyond a single server.\\n\\nOur cluster will have:\\n- 4 nodes or VMs:\\n    - 1 load balancer\\n    - 3 servers\\n- A k3s-upgrade plan that will automatically update the cluster to the latest patch version of a given minor.\\n\\n## Cluster Setup \ud83c\udf10\ud83d\udd27\\n\\nI\'m using `vagrant` to provision 4 Ubuntu 24.04 VMs for this setup, all on a flat network. Setup of nodes is left as an exercise for the reader \ud83d\ude05.\\n\\nMy nodes are configured with the following names and IPs:\\n| Name | IP |\\n|------|----|\\n| lb-0 | 10.10.10.100 |\\n| server-0 | 10.10.10.50 |\\n| server-1 | 10.10.10.51 |\\n| server-2 | 10.10.10.52 |\\n\\n### Load Balancer\\n\\nI\'m using [haproxy](https://www.haproxy.org/) as it supports later expansion to multiple LB nodes (via keepalived).\\n\\nSSH into the load balancer and install haproxy:\\n\\n```bash\\nsudo apt install haproxy\\n```\\n\\nThe haproxy config is simple, just forward traffic to the servers:\\n\\n```\\n#/etc/haproxy/haproxy.cfg\\nfrontend k3s\\n    bind *:6443\\n    mode tcp\\n    default_backend k3s\\n\\nbackend k3s\\n    mode tcp\\n    option tcp-check\\n    balance roundrobin\\n    server server-0 10.10.10.50:6443 check\\n    server server-1 10.10.10.51:6443 check\\n    server server-2 10.10.10.52:6443 check\\n```\\n\\nRestart haproxy to apply the config:\\n\\n```bash\\nsystemctl restart haproxy\\n```\\n\\n### Install K3s on first server\\n\\nOn the first server, install K3s with embedded etcd and a known token:\\n\\n```bash\\ncurl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL=v1.31 sh -s - \\\\\\n--cluster-init --token k3sblog --tls-san 10.10.10.100\\n```\\n\\nWe pass the `--tls-san` flag adds the load balancer IP as a Subject Alternative Name (SAN) for the certificate.\\n\\n### Join the other servers\\n\\nOn the other servers, join the cluster via the load balancer:\\n\\n```bash\\ncurl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL=v1.31 sh -s - \\\\\\n--server https://10.10.10.100:6443 --token k3sblog\\n```\\n\\n### Grab the kubeconfig\\n\\nNow that the cluster is up, we can grab the kubeconfig from the first server:\\n\\n```bash\\nscp server-0:/etc/rancher/k3s/k3s.yaml k3s.yaml\\n```\\n\\nModify it to access the cluster via the load balancer:\\n\\n```bash\\nsed -i \'s/127.0.0.1/10.10.10.100/\' k3s.yaml\\n```\\n\\nNo we can manage the cluster from our local machine:\\n\\n```bash\\nexport KUBECONFIG=$(pwd)/k3s.yaml\\nkubectl get nodes\\n```\\n\\n## Upgrade Plan \ud83c\udfd7\ufe0f\ud83d\udcdd\ud83d\udcd0\\n\\nThe plan I\'m using will keep k3s updated to the latest patch version of the channel we give. In this case I\'m using the `v1.31` channel, the same channel used above. Kubernetes v1.31.4 just released at time of writing this post, so with this plan we have stable upgrades handled for the next 10-12 months (depending on how many patch releases this minor gets).\\n\\n### Install the system-upgrade-controller\\n\\nThe upgrade plan is managed by the system-upgrade-controller. Install it:\\n\\n```bash\\nkubectl apply -f https://github.com/rancher/system-upgrade-controller/releases/latest/download/system-upgrade-controller.yaml\\nkubectl apply -f https://github.com/rancher/system-upgrade-controller/releases/latest/download/crd.yaml\\n```\\n\\n### Create the upgrade plan\\n```yaml\\n#server-plan.yaml\\napiVersion: upgrade.cattle.io/v1\\nkind: Plan\\nmetadata:\\n  name: server-plan\\n  namespace: system-upgrade\\nspec:\\n  concurrency: 1\\n  cordon: true\\n  nodeSelector:\\n    matchExpressions:\\n    - key: node-role.kubernetes.io/control-plane\\n      operator: In\\n      values:\\n      - \\"true\\"\\n  serviceAccountName: system-upgrade\\n  upgrade:\\n    image: rancher/k3s-upgrade\\n  channel: https://update.k3s.io/v1-release/channels/v1.31\\n```\\n\\n```bash\\nkubectl apply -f server-plan.yaml\\n```\\n\\nSee the [automated upgrade docs](/upgrades/automated) for more details.\\n\\n\\n## Conclusion \ud83d\ude80\\n\\n![kubectl summary](kubectl.png)\\n\\nWe now have a high-availability cluster, accessible via a single IP. Upgrades are handled for the next year. This is a great starting point to:\\n- Add agent nodes to expand our workload capacity\\n- Add another load-balancer for additional redundancy"},{"id":"/2025/03/09/hello-blog","metadata":{"permalink":"/kr/blog/2025/03/09/hello-blog","source":"@site/blog/2025-03-09-hello-blog.md","title":"Hello Blog","description":"This is the first blog post on k3s.io","date":"2025-03-09T00:00:00.000Z","tags":[],"hasTruncateMarker":true,"authors":[{"title":"K3s maintainer","url":"https://github.com/dereknola","name":"Derek Nola","imageURL":"https://github.com/dereknola.png","key":"dereknola","page":null}],"frontMatter":{"title":"Hello Blog","description":"This is the first blog post on k3s.io","authors":"dereknola"},"unlisted":false,"prevItem":{"title":"The Basic HA Cluster","permalink":"/kr/blog/2025/03/10/simple-ha"}},"content":"This is the first post on blog.k3s.io\\n\\n\x3c!-- everything above is seen in the snippet on the main blog page. The truncate tag below hides the rest --\x3e\\n\\n\x3c!-- truncate --\x3e\\n\\nWe will explore aspects of K3s, Kubernetes, and other related topics. These long form posts will be written by the K3s team and help illuminate aspects of the project that are not easily covered in the documentation.\\n\\nStay tuned for more posts in the future."}]}}')}}]);