# GitHub Pages deployment

The website lives in `dist/` and needs no build command. The workflow in
`.github/workflows/pages.yml` publishes that directory on pushes to `main`,
or when manually run from GitHub Actions.

1. Push this project to your chosen GitHub repository.
2. In the repository, open **Settings > Pages** and select **GitHub Actions**
   under **Build and deployment > Source**.
3. Run **Deploy portfolio to GitHub Pages** from the Actions tab.
4. Confirm the deployment succeeds and open the URL shown by the deployment.

## Custom domain: aliciamurwira.tech

Register the exact domain you want, or use one you already own. In the
repository's **Settings > Pages > Custom domain**, save that domain before
pointing DNS at GitHub Pages. With this Actions workflow, the domain is set
in repository settings; a CNAME file does not configure it.

For `aliciamurwira.tech`, configure these DNS records at
your domain provider:

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | alicia-murwira.github.io |

The CNAME target must not include the repository name. Preserve unrelated DNS
records such as email records. After DNS validates and GitHub provisions the
certificate, enable **Enforce HTTPS** in Pages settings.

Reference: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
