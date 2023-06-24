## Transfix Image Metadata Reader

Fastest and most secure image metadata reader on the Internet

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

This repo uses Nixkpgs / [nix-shell](shell.nix).

```bash
# open up the nix-shell which contains all dependencies

nix-shell
# emscripten will build exiv2 the first time the shell is initialized

# build the JS for the metadata reader
make

# start the development server
make dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deployment

```bash
make build
# Static build artifacts will be in the `out` folder.
```

The build artifacts are checked into a repo (link!) which is deployed into Cloudflare Pages. Builds are done locally due to emscripten (which would be too slow for CI) and the artifacts placed in a separate repo because the emscripten output is quite large - 3.4 MB as of this writing.

## Todo

- [ ] Slim down emscripten build - currently 3.4 MB
- [ ] JSON download of metadata
- [ ] CSV download of metadata
