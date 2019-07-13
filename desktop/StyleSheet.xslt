<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:p="http://www.evolus.vn/Namespace/Pencil"
    xmlns:html="http://www.w3.org/1999/xhtml"
    xmlns="http://www.w3.org/1999/xhtml">
<xsl:output method="html"/>

    <xsl:template match="/">
        <html>
            <head>
                <title>
                    <xsl:value-of select="/p:Document/p:Properties/p:Property[@name='fileName']/text()"/>
                </title>
                <script type="text/javascript" src="Resources/Script.js"></script>
                <link rel="stylesheet" type="text/css" href="Resources/Style.css" />
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, maximum-scale=1.0" />
            </head>
            <body>
                <div style="display: none;" id="page">
                    <div id="content">
                        <h1 id="documentTitle"><span> <xsl:value-of select="/p:Document/p:Properties/p:Property[@name='fileName']/text()"/></span></h1>
                        <xsl:apply-templates select="/p:Document/p:Pages/p:Page" />
                        <div id="navigator">
                            <div class="NavLink" id="prevLink">
                                <div class="Wrapper">
                                    <a href="#">&#160;</a>
                                </div>
                            </div>
                            <div class="NavLink NavNextLink" id="nextLink">
                                <div class="Wrapper">
                                    <a href="#">&#160;</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="footer">
                    </div>
                </div>
            </body>
        </html>
    </xsl:template>
    <xsl:template match="p:Page">

        <div class="Page" id="{p:Properties/p:Property[@name='fid']/text()}_page">
            <div class="Texts">
                <h2 class="Title"><xsl:value-of select="p:Properties/p:Property[@name='name']/text()"/></h2>
                <xsl:if test="p:Note/node()">
                    <p class="Note">
                        <xsl:apply-templates select="p:Note/node()" mode="processing-notes"/>
                    </p>
                </xsl:if>
            </div>
            <div class="Image">
                <img src="{@rasterized}" width="{p:Properties/p:Property[@name='width']/text()}" height="{p:Properties/p:Property[@name='height']/text()}" usemap="#map_{p:Properties/p:Property[@name='fid']/text()}" id="{p:Properties/p:Property[@name='fid']/text()}_page_image"/>
                <div class="ImageFooter">&#160;</div>
                <xsl:if test="p:Links/p:Link">
                    <map name="map_{p:Properties/p:Property[@name='fid']/text()}">
                        <xsl:apply-templates select="p:Links/p:Link" />
                    </map>
                </xsl:if>
            </div>
        </div>

    </xsl:template>
    <xsl:template match="p:Link">
        <area shape="rect"
            coords="{@x},{@y},{@x+@w},{@y+@h}" href="#{@targetFid}_page" title="Go to page '{@targetName}'"/>
    </xsl:template>
    
    <xsl:template match="html:*" mode="processing-notes">
        <xsl:copy>
            <xsl:copy-of select="@*[local-name() != '_moz_dirty']"/>
            <xsl:apply-templates mode="processing-notes"/>
        </xsl:copy>
    </xsl:template>
    <xsl:template match="html:a[@page-fid]" mode="processing-notes">
        <a href="#{@page-fid}_page" title="Go tp page '{@page-name}'">
            <xsl:copy-of select="@class|@style"/>
            <xsl:apply-templates mode="processing-notes"/>
        </a>
    </xsl:template>
</xsl:stylesheet>
