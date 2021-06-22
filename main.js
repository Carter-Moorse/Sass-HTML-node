const { load } = require('cheerio');
const { render } = require('sass');
const { readFile, writeFile } = require('fs');

const arguments = process.argv.slice(2);

if (arguments.length === 2) {
  compile(addPath(arguments[0]), addPath(arguments[1]));
} else {
  console.log('Not enough arguments provided: {Sass filepath} {HTML filepath}');
}

function addPath(filepath) {
  return `${__dirname}/${filepath}`;
}

function compile(sassFile, htmlFile) {
  render({ file: sassFile }, (error, result) => {
    if (error) throw error;
    readFile(htmlFile, (error, data) => {
      if (error) throw error;
      const $ = load(data);
      $('style').first().text(result.css.toString());
      writeFile(htmlFile, $.html(), () => {
        console.log(`File compiled and saved: ${htmlFile}`);
      });
    })

  })
}