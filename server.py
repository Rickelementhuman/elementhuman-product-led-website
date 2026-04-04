"""
Local server for Element Human Webflow export.

- Serves static HTML pages from the Webflow export
- 301 redirects all /article/* URLs to www.elementhuman.com (SEO preservation)
- Clean URLs: /about-us serves about-us.html
- Runs on http://localhost:8080

Usage:
    python server.py
"""

import http.server
import os

PORT = 8080
LIVE_DOMAIN = "https://www.elementhuman.com"

# Articles from Screaming Frog crawl that are live (200 OK, indexable)
# These MUST redirect to the live site to avoid de-indexing
LIVE_ARTICLES = [
    "right-in-the-feels",
    "introducing-netflix-simulated-environment",
    "introducing-custom-questions",
    "how-arghos-became-arghaus-and-got-artsy-with-influencers",
    "the-attention-fixation",
    "data-access-new-pricing",
    "how-jake-from-state-farm-is-bringing-emotion-to-insurance",
    "how-to-stick-the-branding",
    "introducing-netflix-sts",
    "we-feel-then-we-think",
    "the-research-triangle-dilemma-cost-speed-quality",
    "creator-economy-growth-opportunities-impact",
    "influencer-marketing-consumer-buying-behaviour",
    "measurement-framework-influencer-campaigns",
    "creator-influencer-marketing-measurement",
    "environment-expansion-youtube-shorts",
    "why-simulated",
    "selling-skincare",
    "metrics-arent-measurement",
    "psychological-mechanisms-consumer-engagement-influencers",
]

# Other known redirects from the old site
REDIRECTS = {
    "/contact-us": "/meet-with-us",
    "/product/stopping-staying-power": "/stopping-staying-power",
    "/product/human-experience-workbench": "/human-experience-workbench",
    "/hx-science": "/science",
}


class EHRequestHandler(http.server.SimpleHTTPRequestHandler):

    def do_GET(self):
        path = self.path.split("?")[0].rstrip("/")

        # Root
        if path == "" or path == "/":
            self.path = "/index.html"
            return super().do_GET()

        # 301 redirect: /article/* -> live site
        if path.startswith("/article/"):
            slug = path.replace("/article/", "")
            target = f"{LIVE_DOMAIN}/article/{slug}"
            self.send_response(301)
            self.send_header("Location", target)
            self.send_header("Cache-Control", "public, max-age=31536000")
            self.end_headers()
            print(f"  301 -> {target}")
            return

        # 301 redirect: /insights -> live site (blog hub, CMS-driven)
        if path == "/insights":
            target = f"{LIVE_DOMAIN}/insights"
            self.send_response(301)
            self.send_header("Location", target)
            self.end_headers()
            print(f"  301 -> {target}")
            return

        # 301 redirect: /case-studies individual pages -> live site
        if path.startswith("/case-studies/") or path.startswith("/case-study/"):
            target = f"{LIVE_DOMAIN}{path}"
            self.send_response(301)
            self.send_header("Location", target)
            self.end_headers()
            print(f"  301 -> {target}")
            return

        # Known old URL redirects (internal)
        if path in REDIRECTS:
            new_path = REDIRECTS[path]
            self.send_response(301)
            self.send_header("Location", new_path)
            self.end_headers()
            print(f"  301 -> {new_path}")
            return

        # Clean URLs: /about-us -> /about-us.html
        html_path = path + ".html"
        if os.path.isfile(os.path.join(os.getcwd(), html_path.lstrip("/"))):
            self.path = html_path
            return super().do_GET()

        # Archive pages: /archive/login -> /archive/login.html
        if path.startswith("/archive/"):
            html_path = path + ".html"
            if os.path.isfile(os.path.join(os.getcwd(), html_path.lstrip("/"))):
                self.path = html_path
                return super().do_GET()

        # Fall through to default static file serving (css, js, images, etc.)
        return super().do_GET()

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {args[0]}")


def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    print(f"""
============================================
  Element Human — Local Website Server
============================================
  URL:       http://localhost:{PORT}
  Serving:   {os.getcwd()}
  Articles:  301 redirect to {LIVE_DOMAIN}
============================================

Pages available:
  http://localhost:{PORT}/                    Homepage
  http://localhost:{PORT}/product             Product
  http://localhost:{PORT}/about-us            About Us
  http://localhost:{PORT}/science             Science
  http://localhost:{PORT}/pricing             Pricing
  http://localhost:{PORT}/case-studies        Case Studies
  http://localhost:{PORT}/meet-with-us        Contact
  http://localhost:{PORT}/human-experience-workbench  HX Workbench
  http://localhost:{PORT}/stopping-staying-power      SSP
  http://localhost:{PORT}/privacy-policy      Privacy
  http://localhost:{PORT}/terms-conditions    Terms

Article redirects (301 -> live site):
  http://localhost:{PORT}/article/right-in-the-feels
  http://localhost:{PORT}/article/the-attention-fixation
  ... and {len(LIVE_ARTICLES)} more

Press Ctrl+C to stop.
""")

    with http.server.HTTPServer(("", PORT), EHRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")


if __name__ == "__main__":
    main()
