# TelePal Custom Domain Setup Guide

## 🌐 Setting Up Custom Domain for GitHub Pages

### Prerequisites
- GitHub repository: https://github.com/brickjawn/TelePal
- GitHub Pages enabled
- Domain name (purchased or subdomain)

## Step 1: Configure GitHub Pages

1. Go to your repository: https://github.com/brickjawn/TelePal
2. Click **Settings** tab
3. Scroll to **Pages** section
4. Under **Custom domain**, enter your domain (e.g., `telepal.yourdomain.com`)
5. Check **"Enforce HTTPS"** (will be available after DNS is configured)
6. Click **Save**

## Step 2: DNS Configuration

### Option A: Subdomain (Recommended)
If using a subdomain like `telepal.yourdomain.com`:

**Add these DNS records:**
```
Type: CNAME
Name: telepal (or your subdomain)
Value: brickjawn.github.io
TTL: 3600 (or default)
```

### Option B: Root Domain
If using root domain like `yourdomain.com`:

**Add these DNS records:**
```
Type: A
Name: @
Value: 185.199.108.153
TTL: 3600

Type: A
Name: @
Value: 185.199.109.153
TTL: 3600

Type: A
Name: @
Value: 185.199.110.153
TTL: 3600

Type: A
Name: @
Value: 185.199.111.153
TTL: 3600
```

**Also add:**
```
Type: CNAME
Name: www
Value: brickjawn.github.io
TTL: 3600
```

## Step 3: Update CNAME File

1. Edit the `CNAME` file in your repository
2. Replace the placeholder with your actual domain
3. Commit and push changes

## Step 4: Verify Setup

1. Wait 5-10 minutes for DNS propagation
2. Visit your custom domain
3. Check that HTTPS is working
4. Test PWA installation

## Popular Domain Providers

### Namecheap
1. Go to Domain List → Manage
2. Click Advanced DNS
3. Add records as shown above

### GoDaddy
1. Go to My Products → DNS
2. Add records as shown above

### Cloudflare (Recommended)
1. Add your domain to Cloudflare
2. Update nameservers at your registrar
3. Add DNS records in Cloudflare dashboard
4. Enable SSL/TLS (Full mode)

## Domain Suggestions

### Professional Domains
- `telepal.app` - Perfect for PWA
- `telepal.dev` - Developer-focused
- `telepal.io` - Modern and clean
- `telepal.pro` - Professional

### Subdomain Options
- `telepal.yourdomain.com`
- `app.yourdomain.com`
- `prompter.yourdomain.com`
- `tools.yourdomain.com`

## Troubleshooting

### Common Issues
1. **DNS not propagating**: Wait up to 24 hours
2. **HTTPS not working**: Wait for GitHub to provision SSL
3. **CNAME conflicts**: Remove conflicting records
4. **Subdomain not working**: Check CNAME record

### Verification Commands
```bash
# Check DNS resolution
nslookup your-domain.com

# Check GitHub Pages status
curl -I https://your-domain.com
```

## Security Considerations

1. **Always use HTTPS**: GitHub Pages provides free SSL
2. **Enable HSTS**: Add security headers
3. **Verify domain ownership**: GitHub will verify automatically
4. **Monitor for issues**: Check GitHub Pages status

## Next Steps

After domain setup:
1. Update any hardcoded URLs in the app
2. Test PWA installation on custom domain
3. Update documentation with new URL
4. Consider adding analytics
5. Set up monitoring

## Support

- GitHub Pages Documentation: https://docs.github.com/en/pages
- DNS Troubleshooting: https://dnschecker.org
- SSL Checker: https://www.ssllabs.com/ssltest/
