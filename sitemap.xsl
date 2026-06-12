<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>XML Sitemap | ConvertOcean</title>
        <style>
          :root {
            --bg-color: #0b0f19;
            --card-bg: #111827;
            --text-main: #f3f4f6;
            --text-muted: #9ca3af;
            --link-color: #00dfd8;
            --link-hover: #00b8b2;
            --border-color: #1f2937;
            --header-bg: #1f2937;
          }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
          }
          h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            color: var(--text-main);
          }
          p.desc {
            font-size: 15px;
            color: var(--text-muted);
            margin-bottom: 30px;
            line-height: 1.5;
          }
          .table-container {
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }
          th {
            background-color: var(--header-bg);
            color: var(--text-main);
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 14px 20px;
            border-bottom: 1px solid var(--border-color);
          }
          td {
            padding: 14px 20px;
            border-bottom: 1px solid var(--border-color);
            font-size: 14.5px;
            word-break: break-all;
          }
          tr:last-child td {
            border-bottom: none;
          }
          tr:hover td {
            background-color: rgba(255, 255, 255, 0.02);
          }
          a {
            color: var(--link-color);
            text-decoration: none;
            font-weight: 500;
          }
          a:hover {
            color: var(--link-hover);
            text-decoration: underline;
          }
          .badge {
            display: inline-block;
            padding: 2px 8px;
            font-size: 11px;
            font-weight: 600;
            border-radius: 4px;
            background-color: rgba(0, 223, 216, 0.1);
            color: var(--link-color);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <xsl:choose>
            <xsl:when test="s:sitemapindex">
              <h1>ConvertOcean XML Sitemap Index</h1>
              <p class="desc">
                This XML Sitemap Index contains references to <xsl:value-of select="count(s:sitemapindex/s:sitemap)"/> sitemap(s).
              </p>
              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <th width="80%">Sitemap Location</th>
                      <th width="20%">Last Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="s:sitemapindex/s:sitemap">
                      <tr>
                        <td>
                          <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
                        </td>
                        <td>
                          <xsl:value-of select="s:lastmod"/>
                          <xsl:if test="not(s:lastmod)">N/A</xsl:if>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </div>
            </xsl:when>
            <xsl:otherwise>
              <h1>ConvertOcean XML Sitemap</h1>
              <p class="desc">
                This XML Sitemap contains <xsl:value-of select="count(s:urlset/s:url)"/> URLs. It is optimized for search engines to crawl and index ConvertOcean offline utility tools.
              </p>
              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <th width="70%">URL Location</th>
                      <th width="15%">Priority</th>
                      <th width="15%">Change Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="s:urlset/s:url">
                      <tr>
                        <td>
                          <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
                        </td>
                        <td>
                          <span class="badge"><xsl:value-of select="s:priority"/></span>
                        </td>
                        <td>
                          <xsl:value-of select="s:changefreq"/>
                          <xsl:if test="not(s:changefreq)">weekly</xsl:if>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </div>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
