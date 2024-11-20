#!/usr/bin/env node

import { HtmlDiffer } from '@markedjs/html-differ';
import * as logger from '@markedjs/html-differ/lib/logger.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const args = process.argv.slice(2);
const htmlDiffer = new HtmlDiffer({
  ignoreAttributes: ['id', 'style', 'row', 'col', 'colspan', 'rowspan'],
  ignoreWhitespaces: true,
  ignoreComments: true,
});

const loadHtmlContentFromPath = (anyPath) => {
  const htmlPath = path.resolve(__dirname, anyPath);
  return fs.readFileSync(htmlPath, 'utf8');
};

const getFilePathFromArgument = (side) => {
  const leftIndex = args.indexOf(side);
  if (leftIndex !== -1 && leftIndex + 1 < args.length) {
    return args[leftIndex + 1];
  }
  throw new Error(`Please provide a ${side} argument`);
};

const removeHeadFromHtml = (html) =>
  html.replace(/<head[\s\S]*?>[\s\S]*?<\/head>/gi, '');

const getHtmlString = (side) => {
  const filePath = getFilePathFromArgument(side);
  const fileLoadedContent = loadHtmlContentFromPath(filePath);
  return removeHeadFromHtml(fileLoadedContent);
};

const fileLeftLoadedContent = getHtmlString('--left');
const fileRightLoadedContent = getHtmlString('--right');

console.log('Computing diff...');
const diff = await htmlDiffer.diffHtml(fileLeftLoadedContent, fileRightLoadedContent);
console.log('Diff:\n');
logger.logDiffText(diff, { charsAroundDiff: 40 });
