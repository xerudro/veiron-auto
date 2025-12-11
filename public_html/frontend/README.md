# VEIRONAUTO - Frontend Package (Static Site)

Professional car rental website template - Static version

## 📦 Package Contents

- ✅ Complete responsive HTML/CSS/JS website
- ✅ Multi-language support (Romanian & English)
- ✅ Booking system with date picker
- ✅ Car fleet showcase
- ✅ Contact forms
- ✅ Static pricing data (no backend required)
- ✅ Optional backend API integration

## 🚀 Quick Start

### Option 1: Static Site (No Backend)

Just upload all files to your web hosting:

```bash
# Upload the entire frontend/ folder contents to your web root
# Example: public_html/ or www/ or htdocs/
```

Your site will be live immediately at: `https://yourdomain.com`

### Option 2: With Backend API

If you also purchase the backend package:

1. Upload `frontend/` to your web root
2. Upload `backend/` to a separate folder (e.g., `/home/username/backend/`)
3. Configure API URL in `assets/js/config.js` (optional)
4. The frontend will auto-detect and connect to the backend

## 📁 File Structure

```
frontend/
├── index-ro.html              # Homepage (Romanian)
├── index-en.html              # Homepage (English)
├── booking.html               # Booking page (Romanian)
├── booking-en.html            # Booking page (English)
├── parc-auto.html             # Fleet page (Romanian)
├── parc-auto-en.html          # Fleet page (English)
├── contact.html               # Contact page (Romanian)
├── contact-en.html            # Contact page (English)
├── despre-noi.html            # About page (Romanian)
├── about-us.html              # About page (English)
├── politica-de-confidentialitate.html  # Privacy policy (RO)
├── privacy-policy.html        # Privacy policy (EN)
├── termeni-si-conditii.html   # Terms (RO)
│
├── assets/
│   ├── css/                   # Stylesheets
│   ├── js/                    # JavaScript files
│   │   ├── booking.js         # Booking logic (RO)
│   │   ├── booking-en.js      # Booking logic (EN)
│   │   ├── parc-auto.js       # Fleet page (RO)
│   │   ├── parc-auto-en.js    # Fleet page (EN)
│   │   ├── api-client.js      # Optional backend integration
│   │   └── app.js             # Main app logic
│   ├── images/                # Images
│   │   └── cars/              # Car images
│   ├── json/                  # Static data
│   │   └── car-pricing-data.json  # Car pricing tiers
│   └── libs/                  # Third-party libraries
│
└── admin/                     # Future admin dashboard (Vue.js)
```

## 🎨 Customization

### 1. Update Car Data

Edit `assets/json/car-pricing-data.json`:

```json
{
  "cars": [
    {
      "id": "toyota-rav4",
      "name": "TOYOTA RAV4 AUTOMAT",
      "transmission": "automat",
      "pricing": {
        "tier1": 100,
        "tier2": 95,
        "tier3": 90,
        "tier4": 85
      },
      "deposit": 300
    }
  ]
}
```

### 2. Update Images

Replace images in `assets/images/cars/`:

- Format: JPG, PNG, or WebP
- Recommended size: 800x600px
- Naming: `brand-model/image-name.jpg`

### 3. Update Contact Information

Edit in HTML files:
- Phone numbers
- Email addresses
- Office locations
- Social media links

### 4. Change Colors & Branding

Edit `assets/css/style.css`:

```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
}
```

## 🌐 Multi-Language Support

The site includes both Romanian and English versions:

- Romanian: `index-ro.html`, `booking.html`, `parc-auto.html`, etc.
- English: `index-en.html`, `booking-en.html`, `parc-auto-en.html`, etc.

Language switcher is built into the navigation menu.

## 📱 Responsive Design

Fully responsive across all devices:
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px - 1920px)
- ✅ Tablet (768px - 1366px)
- ✅ Mobile (320px - 768px)

## 🔌 Backend Integration (Optional)

If you have the backend package, the frontend can connect automatically:

1. **Auto-detection**: The `api-client.js` will try to find the backend
2. **Manual config**: Edit `assets/js/config.js`:

```javascript
const APP_CONFIG = {
    API_ENABLED: true,
    API_BASE_URL: '/backend/api/v1',
    MODE: 'api'  // or 'static'
};
```

3. **Features with backend**:
   - Real-time car availability
   - Booking management
   - Admin dashboard
   - Image upload
   - Dynamic pricing

## 📊 Features

### Static Mode (No Backend)
- ✅ Browse car fleet
- ✅ View car details
- ✅ See pricing tiers
- ✅ Contact forms (using static HTML forms or external services)
- ✅ Multi-language support

### API Mode (With Backend)
- ✅ All static features +
- ✅ Real-time availability checking
- ✅ Online booking system
- ✅ Payment integration
- ✅ Booking management
- ✅ Admin dashboard
- ✅ Car management (add/edit/delete)
- ✅ Image upload

## 🛠️ Technical Requirements

### Static Site:
- Web hosting with HTML support
- No special requirements
- Works on any hosting (GitHub Pages, Netlify, shared hosting, etc.)

### With Backend (Optional):
- PHP 7.4+ or 8.0+
- MySQL 5.7+ or MariaDB 10.2+
- Apache or Nginx
- SSL certificate (recommended)

## 📦 Deployment

### Static Site Deployment:

**Option 1: cPanel/Shared Hosting**
1. Upload all files to `public_html/`
2. Done! Visit your domain

**Option 2: GitHub Pages**
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
# Enable GitHub Pages in repository settings
```

**Option 3: Netlify**
1. Drag and drop the `frontend/` folder to Netlify
2. Done! Get a free subdomain

**Option 4: Vercel**
```bash
npm install -g vercel
vercel
```

### With Backend:

See `../backend/README.md` for backend deployment instructions.

## 🎯 Use Cases

### 1. Portfolio/Demo Site
Use the static version to showcase the design and features.

### 2. Small Business
Add backend for full functionality with booking system.

### 3. Development/Testing
Use static version for frontend development, backend for testing.

## 📄 License

This template is sold as-is with full rights to modify and use commercially.

## 🆘 Support

For support:
- Email: support@veironauto.com
- Documentation: See `docs/` folder
- Issues: Contact seller

## 🔄 Updates

Check for updates:
- Backend API compatibility
- New features
- Security patches
- Bug fixes

## 🎨 Customization Services

Need help customizing? Contact us for:
- Color scheme changes
- Logo integration
- Additional languages
- Custom features
- SEO optimization

## 📈 SEO Ready

The template includes:
- ✅ Semantic HTML5
- ✅ Meta tags
- ✅ Open Graph tags
- ✅ Schema.org markup
- ✅ Sitemap ready
- ✅ Mobile-friendly
- ✅ Fast loading times

## 🔒 Security

### Static Site:
- No server-side code = No server vulnerabilities
- HTML/CSS/JS only
- Perfect for high-security requirements

### With Backend:
- HTTPS required
- JWT authentication
- SQL injection prevention
- XSS protection
- CORS configuration

## 💡 Tips

1. **Performance**: Optimize images before upload (use TinyPNG or similar)
2. **SEO**: Update meta tags in each HTML file
3. **Analytics**: Add Google Analytics code before `</body>` tag
4. **Backup**: Always keep a backup before customization

## 🚀 Getting Started Checklist

- [ ] Upload files to hosting
- [ ] Update contact information
- [ ] Replace logo and branding
- [ ] Add your car inventory
- [ ] Update pricing
- [ ] Test on all devices
- [ ] Configure SSL certificate
- [ ] Set up analytics
- [ ] Test contact forms
- [ ] Go live!

---

**Version**: 1.0.0
**Last Updated**: December 2025
**Template by**: VEIRONAUTO Development Team
