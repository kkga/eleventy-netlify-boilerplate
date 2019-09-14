const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-es");
const htmlmin = require("html-minifier");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight, {
    init: function({ Prism }) {
      Prism.languages.gdscript = {
        comment: /#.*/,
        string: {
          pattern: /@?(?:("|')(?:(?!\1)[^\n\\]|\\[\s\S])*\1(?!"|')|"""(?:[^\\]|\\[\s\S])*?""")/,
          greedy: true
        },
        "class-name": {
          // class_name Foo, extends Bar, class InnerClass
          // export(int) var baz, export(int, 0) var i
          // as Node
          // const FOO: int = 9, var bar: bool = true
          // func add(reference: Item, amount: int) -> Item:
          pattern: /(^(?:class_name|class|extends)[ \t]+|^export\([ \t]*|\bas[ \t]+|(?:\b(?:const|var)[ \t]|[,(])[ \t]*\w+[ \t]*:[ \t]*|->[ \t]*)[a-zA-Z_]\w*/m,
          lookbehind: true
        },
        keyword: /\b(?:and|as|assert|break|breakpoint|class|class_name|const|continue|elif|else|enum|export|extends|for|func|if|in|is|master|mastersync|match|not|null|onready|or|pass|preload|puppet|puppetsync|remote|remotesync|return|self|setget|signal|static|tool|var|while|yield)\b/,
        function: /[a-z_]\w*(?=[ \t]*\()/i,
        variable: /\$\w+/,
        number: [
          /\b0b[01_]+\b|\b0x[\da-fA-F_]+\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.[\d_]+)(?:e[+-]?[\d_]+)?\b/,
          /\b(?:INF|NAN|PI|TAU)\b/
        ],
        constant: /\b[A-Z][A-Z_\d]*\b/,
        boolean: /\b(?:false|true)\b/,
        operator: /->|:=|&&|\|\||<<|>>|[-+*/%&|!<>=]=?|[~^]/,
        punctuation: /[.:,;()[\]{}]/
      };
    }
  });

  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

  // Date formatting (human readable)
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
  });

  // Date formatting (machine readable)
  eleventyConfig.addFilter("machineDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
  });

  // Minify CSS
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Minify JS
  eleventyConfig.addFilter("jsmin", function(code) {
    let minified = UglifyJS.minify(code);
    if (minified.error) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }
    return minified.code;
  });

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (outputPath.indexOf(".html") > -1) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // only content in the `posts/` directory
  eleventyConfig.addCollection("posts", function(collection) {
    return collection.getAllSorted().filter(function(item) {
      return item.inputPath.match(/^\.\/posts\//) !== null;
    });
  });

  // drafts
  eleventyConfig.addCollection("drafts", function(collection) {
    return collection.getAllSorted().filter(function(item) {
      return item.inputPath.match(/^\.\/drafts\//) !== null;
    });
  });

  // set order for nav items
  eleventyConfig.addCollection("nav", function(collection) {
    return collection.getFilteredByTag("nav").sort(function(a, b) {
      return a.data.navorder - b.data.navorder;
    });
  });

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy("static/img");
  eleventyConfig.addPassthroughCopy("_includes/assets/");

  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let markdownItContainer = require("markdown-it-container")
  let options = {
    html: true,
    breaks: true,
    linkify: true,
    typographer: true
  };
  let markdownLib = markdownIt(options).use(markdownItContainer, "note");
  eleventyConfig.setLibrary("md", markdownLib);

  return {
    templateFormats: ["md", "njk", "html"],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
