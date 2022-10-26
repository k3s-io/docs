# K3s Website and Docs

This repo contains the content of the K3s documentation website found at https://docs.k3s.io. Please open an issue if you have suggestions for new content or edits. We also gladly accept community PRs. 

The website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

You can also use Docker to launch the website without needing to install and configure yarn:
```
docker run --rm -it -v $PWD:$PWD -w $PWD -p 3000:3000 node yarn start -h 0.0.0.0
```

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

An automated GH action will deploy the website to GitHub Pages once a PR has been merged to `main`.
