import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const artifactArg=process.argv[2]||'';
let failures=[];

function fail(message){failures.push(message);}
function assert(condition,message){if(!condition)fail(message);}
function read(rel){return fs.readFileSync(path.join(root,rel),'utf8');}
function walk(dir){
  const results=[];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isSymbolicLink()){
      results.push({path:full,type:'symlink'});
    }else if(entry.isDirectory()){
      results.push(...walk(full));
    }else{
      results.push({path:full,type:'file'});
    }
  }
  return results;
}

function sourceChecks(){
  const html=read('khind/index.html');
  const script=read('khind/script.js');
  const workflow=read('.github/workflows/static.yml');

  const cspMatch=html.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)">/i);
  assert(Boolean(cspMatch),'KHIND page must define a CSP meta policy.');
  const csp=cspMatch?.[1]||'';
  for(const directive of [
    "default-src 'none'",
    "script-src 'self'",
    "script-src-attr 'none'",
    "style-src 'self'",
    "style-src-attr 'none'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "connect-src 'none'",
    "frame-src 'none'",
    "https://cdn.prod.website-files.com"
  ]){
    assert(csp.includes(directive),`CSP is missing required directive: ${directive}`);
  }

  assert(/<meta\s+name="referrer"\s+content="strict-origin-when-cross-origin">/i.test(html),
    'Explicit strict referrer policy is required.');

  assert(!/<script(?![^>]*\bsrc=)[^>]*>/i.test(html),
    'Inline script detected; strict CSP requires external scripts only.');
  assert(!/\sstyle="/i.test(html),'Inline style attribute detected in KHIND HTML.');
  assert(!/style="/i.test(script),'Generated inline style detected in KHIND JavaScript.');

  for(const tag of html.match(/<a\b[^>]*target="_blank"[^>]*>/gi)||[]){
    assert(/rel="[^"]*\bnoopener\b[^"]*"/i.test(tag),
      `target=_blank link is missing noopener: ${tag.slice(0,140)}`);
  }
  for(const line of script.split(/\r?\n/).filter(line=>line.includes('target="_blank"'))){
    assert(/rel="[^"]*\bnoopener\b/.test(line),
      `Generated target=_blank link is missing noopener near: ${line.slice(0,140)}`);
  }

  assert(!/\beval\s*\(/.test(script),'eval() is not allowed.');
  assert(!/new\s+Function\s*\(/.test(script),'new Function() is not allowed.');
  assert(!/document\.write\s*\(/.test(script),'document.write() is not allowed.');
  assert(script.includes('const escapeHTML ='),'Catalogue output escaping helper is missing.');
  assert(script.includes('function safeHttpsUrl'),'External URL allowlist helper is missing.');
  assert(script.includes('ALLOWED_IMAGE_HOSTS'),'Image-host allowlist is missing.');
  assert(script.includes('ALLOWED_SOURCE_HOSTS'),'Source-link allowlist is missing.');
  for(const requiredEscape of [
    'escapeHTML(p.name)',
    'escapeHTML(p.description)',
    'escapeHTML(p.benefits)',
    'escapeHTML(p.stock)',
    'escapeHTML(p.campaignSource)',
    'escapeHTML(p.verifiedDate)'
  ]){
    assert(script.includes(requiredEscape),`Expected output escaping is missing: ${requiredEscape}`);
  }

  const catalogue=read('khind/catalogue.js');
  const allowedImageHost='cdn.prod.website-files.com';
  const imageUrls=[...catalogue.matchAll(/"image":\s*"(https:\/\/[^"]+)"/g)].map(match=>match[1]);
  for(const url of imageUrls){
    const host=(url.match(/^https:\/\/([^/]+)/i)||[])[1]||'';
    assert(host===allowedImageHost,`Unexpected external image host in catalogue: ${host||url}`);
  }
  const allowedSourceHosts=new Set(['khindrto.com.my','www.khindrto.com.my','khind.com.my','www.khind.com.my']);
  const sourceUrls=[...catalogue.matchAll(/"source":\s*"(https:\/\/[^"]+)"/g)].map(match=>match[1]);
  for(const url of sourceUrls){
    const host=(url.match(/^https:\/\/([^/]+)/i)||[])[1]||'';
    assert(allowedSourceHosts.has(host),`Unexpected external source host in catalogue: ${host||url}`);
  }

  const externalHttp=[...html.matchAll(/(?:src|href)="(http:\/\/[^"]+)"/gi)].map(match=>match[1]);
  assert(externalHttp.length===0,`Insecure HTTP resource/link found: ${externalHttp.join(', ')}`);

  const uses=[...workflow.matchAll(/^\s*uses:\s*([^\s#]+).*$/gm)].map(match=>match[1]);
  assert(uses.length>0,'No GitHub Actions dependencies found to validate.');
  for(const use of uses){
    assert(/@[0-9a-f]{40}$/i.test(use),`GitHub Action is not pinned to a full commit SHA: ${use}`);
  }
  assert(/persist-credentials:\s*false/.test(workflow),
    'actions/checkout must set persist-credentials: false.');
  assert(/path:\s*['_"]?_site['"]?/.test(workflow),
    'Pages artifact must deploy the staged _site directory, not the whole repository.');

  const forbiddenNames=[
    /^\.env(?:\.|$)/i,/\.pem$/i,/\.key$/i,/\.p12$/i,/\.pfx$/i,/^id_rsa$/i,/^id_ed25519$/i
  ];
  const sourceEntries=walk(root).filter(item=>!item.path.includes(`${path.sep}.git${path.sep}`));
  for(const item of sourceEntries){
    if(item.type==='symlink'){
      fail(`Symlink is not allowed in the publish repository: ${path.relative(root,item.path)}`);
      continue;
    }
    const base=path.basename(item.path);
    if(forbiddenNames.some(pattern=>pattern.test(base))){
      fail(`Potential secret-bearing file detected: ${path.relative(root,item.path)}`);
    }
  }

  const textExtensions=new Set(['.html','.js','.mjs','.css','.json','.yml','.yaml','.md','.txt','.py','.xml']);
  const secretPatterns=[
    ['private key',/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
    ['AWS access key',/AKIA[0-9A-Z]{16}/],
    ['GitHub token',/gh[pousr]_[A-Za-z0-9_]{20,}/],
    ['Bearer token',/Bearer\s+[A-Za-z0-9._-]{24,}/i]
  ];
  for(const item of sourceEntries){
    if(item.type!=='file'||!textExtensions.has(path.extname(item.path).toLowerCase()))continue;
    if(fs.statSync(item.path).size>1024*1024)continue;
    const contents=fs.readFileSync(item.path,'utf8');
    for(const [name,pattern] of secretPatterns){
      if(pattern.test(contents))fail(`Potential ${name} detected in ${path.relative(root,item.path)}`);
    }
  }
}

function artifactChecks(artifactPath){
  const artifact=path.resolve(root,artifactPath);
  assert(fs.existsSync(artifact),`Staged artifact does not exist: ${artifactPath}`);
  if(!fs.existsSync(artifact))return;

  const required=['index.html','404.html','khind/index.html','khind/script.js','khind/catalogue.js','khind/style.css','khind/retail-2026.css'];
  for(const rel of required){
    assert(fs.existsSync(path.join(artifact,rel)),`Required public file missing from artifact: ${rel}`);
  }

  const entries=walk(artifact);
  for(const item of entries){
    const rel=path.relative(artifact,item.path).replaceAll(path.sep,'/');
    if(item.type==='symlink')fail(`Symlink found in deployment artifact: ${rel}`);
    if(rel.startsWith('.github/'))fail('Internal .github directory must not be published.');
    if(rel==='README.md'||rel==='test.html')fail(`Internal file must not be published: ${rel}`);
    if(/\.md$/i.test(rel))fail(`Markdown project documentation must not be published: ${rel}`);
    if(/\.py$/i.test(rel))fail(`Development Python helper must not be published: ${rel}`);
    if(/^khind\/[^/]+\.png$/i.test(rel))fail(`KHIND review screenshot must not be published: ${rel}`);
  }
}

if(artifactArg)artifactChecks(artifactArg);
else sourceChecks();

if(failures.length){
  console.error('\nSecurity checks failed:');
  for(const failure of failures)console.error(` - ${failure}`);
  process.exit(1);
}
console.log(artifactArg
  ? `Security artifact checks passed for ${artifactArg}.`
  : 'Security source checks passed.');
