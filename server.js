const http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path");
const root = __dirname,
  port = Number(process.env.PORT || 3000),
  data = path.join(root, "data.json"),
  B = [
    "rice bowl",
    "pasta",
    "taco",
    "wrap",
    "noodle bowl",
    "flatbread",
    "salad",
    "soup",
    "curry",
    "stir-fry",
    "grain bowl",
    "sandwich",
  ],
  P = [
    "chickpea",
    "tofu",
    "chicken",
    "mushroom",
    "lentil",
    "egg",
    "paneer",
    "salmon",
    "black bean",
    "cauliflower",
  ],
  S = [
    "lemon herb",
    "smoky",
    "coconut",
    "garlic chilli",
    "tomato basil",
    "peanut lime",
    "ginger sesame",
    "mediterranean",
    "masala",
    "roasted",
  ],
  T = ["Quick", "Vegetarian", "High protein", "One-pan", "Vegan"],
  E = ["🥗", "🍝", "🌮", "🌯", "🍜", "🫓", "🥙", "🍲", "🍛", "🥘", "🍱", "🥪"],
  cap = (s) => s.replace(/\b\w/g, (x) => x.toUpperCase()),
  send = (r, s, b, t = "application/json; charset=utf-8") => {
    r.writeHead(s, { "Content-Type": t, "Cache-Control": "no-store" });
    r.end(typeof b === "string" ? b : JSON.stringify(b));
  },
  state = () => {
    try {
      return { saved: [], ...JSON.parse(fs.readFileSync(data, "utf8")) };
    } catch {
      return { saved: [] };
    }
  },
  meal = (id) => {
    id = Math.max(0, Math.min(99999, Number(id) || 0));
    let b = B[id % B.length],
      p = P[Math.floor(id / B.length) % P.length],
      s = S[Math.floor(id / (B.length * P.length)) % S.length];
    return {
      id,
      name: `${cap(s)} ${cap(p)} ${b}`,
      type: ["chicken", "salmon"].includes(p)
        ? "High protein"
        : ["paneer", "egg"].includes(p)
          ? "Vegetarian"
          : "Vegan",
      time: 12 + (id % 34),
      emoji: E[id % E.length],
      ingredients: [
        `1 cup ${b}`,
        `200g ${p}`,
        "2 cloves garlic, finely chopped",
        "1 tbsp olive oil",
        `1 ${s.split(" ")[0]} or lemon`,
        "A handful of fresh herbs",
        "Salt and black pepper",
      ],
      steps: [
        `Prepare the ${p} and heat olive oil in a pan.`,
        `Add garlic and cook for 30 seconds, then add the ${p}.`,
        `Cook the ${b} until tender.`,
        `Combine everything with ${s} flavours and a splash of cooking water.`,
        `Taste, season, and finish with fresh herbs.`,
      ],
      tip: "Prep every ingredient before the pan gets hot for a calmer cooking flow.",
    };
  },
  ideas = (a) => {
    let x = a.map((v) => v.trim()).filter(Boolean),
      p = x[0] || "seasonal vegetables",
      b = x[1] || "rice";
    return ["Crisp grain bowl", "Weeknight skillet", "Golden wrap"].map(
      (n, i) => ({
        name: `${p} ${n}`,
        time: 15 + i * 4,
        why: `A practical way to use ${x.length ? x.join(", ") : "your flexible pantry staples"}.`,
      }),
    );
  };
const enhance = (h) =>
  h.replace(
    "</html>",
    `<style>.filter-group{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:9px 0}.filter-label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.1px;color:#8a6e59;margin-right:4px}.filters button.multi{border-color:#c9d7c3;background:#f8fcf5}.filters button.multi.active{background:#2b4937;color:white;border-color:#2b4937}.cuisine-chip{font-size:11px}.active-summary{display:flex;justify-content:space-between;align-items:center;background:#fffdf9;border:1px solid #e9dece;border-radius:12px;padding:10px 12px;margin-bottom:12px;color:#705c4b;font-size:12px}.clear-filters{border:0;background:#f3e9db;border-radius:7px;padding:6px 9px;font:600 11px DM Sans;cursor:pointer;color:#624a38}</style><script>const cuisines=['Indian','Italian','Mexican','Japanese','Thai','Chinese','Korean','Greek','Lebanese','French','Spanish','Vietnamese','Turkish','Ethiopian','Brazilian','Caribbean','Moroccan','Indonesian','American','Middle Eastern'],diets=['Vegetarian','High protein','Vegan','Quick','One-pan'];meals.length=0;for(let i=0;i<100000;i++){let b=bases[i%bases.length],p=proteins[Math.floor(i/bases.length)%proteins.length],s=styles[Math.floor(i/(bases.length*proteins.length))%styles.length],c=cuisines[i%cuisines.length],tags=[diets[i%diets.length],diets[Math.floor(i/diets.length)%diets.length]];meals.push({id:i,name:c+' '+s.replace(/\\b\\w/g,x=>x.toUpperCase())+' '+p.replace(/\\b\\w/g,x=>x.toUpperCase())+' '+b,type:tags[0],tags,cuisine:c,time:12+i%34,emoji:emojis[i%emojis.length],desc:'A '+c+' inspired '+tags.join(' & ').toLowerCase()+' plate, designed for real weeknights.',items:[p,b,'garlic','olive oil',s.split(' ')[0]],bg:colors[i%colors.length]})}let selectedTags=new Set();filters.outerHTML='<div id="filterPanel"><div class="filter-group"><span class="filter-label">Diet & style</span>'+diets.map(x=>'<button class="multi" data-x="'+x+'">'+x+'</button>').join('')+'</div><div class="filter-group"><span class="filter-label">Cuisine</span>'+cuisines.map(x=>'<button class="multi cuisine-chip" data-x="'+x+'">'+x+'</button>').join('')+'</div><div class="active-summary"><span id="filterText">All cuisines · all styles</span><button id="clearFilters" class="clear-filters">Reset filters</button></div></div>';selected=()=>{let q=search.value.trim().toLowerCase(),active=[...selectedTags],ds=active.filter(x=>diets.includes(x)),cs=active.filter(x=>cuisines.includes(x));return meals.filter(m=>(!ds.length||ds.every(x=>m.tags.includes(x)))&&(!cs.length||cs.includes(m.cuisine))&&(!q||(m.name+' '+m.tags.join(' ')+' '+m.cuisine+' '+m.items.join(' ')).toLowerCase().includes(q)))};render=()=>{let all=selected(),show=all.slice(0,visible);results.textContent=all.length.toLocaleString()+' dishes matching your selections';grid.innerHTML=show.map(m=>'<article class="recipe"><div class="visual" style="--bg:'+m.bg+'">'+m.emoji+'</div><div class="meta">'+m.cuisine.toUpperCase()+' · '+m.time+' MIN</div><h3>'+m.name+'</h3><p>'+m.desc+'</p><div class="actions"><button class="'+(saved.includes(m.id)?'on':'')+'" data-save="'+m.id+'">'+(saved.includes(m.id)?'✓ Saved':'＋ Save')+'</button><button class="view" data-view="'+m.id+'">Recipe →</button></div></article>').join('');n.textContent=saved.length;more.style.display=visible>=all.length?'none':'block';document.querySelectorAll('[data-save]').forEach(b=>b.onclick=()=>{let id=+b.dataset.save;saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];save()});document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>location.href='/recipe.html?id='+b.dataset.view)};document.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{let x=b.dataset.x;selectedTags.has(x)?selectedTags.delete(x):selectedTags.add(x);b.classList.toggle('active',selectedTags.has(x));filterText.textContent=selectedTags.size?[...selectedTags].join(' + '):'All cuisines · all styles';visible=16;render()});clearFilters.onclick=()=>{selectedTags.clear();document.querySelectorAll('[data-x]').forEach(b=>b.classList.remove('active'));filterText.textContent='All cuisines · all styles';render()};render();</script></html>`,
  );
http
  .createServer((q, r) => {
    let u = new URL(q.url, `http://${q.headers.host}`),
      m = u.pathname.match(/^\/api\/meals\/(\d+)$/);
    if (q.method === "GET" && u.pathname.startsWith("/assets/")) {
      const assetPath = path.resolve(root, `.${u.pathname}`);
      if (!assetPath.startsWith(path.resolve(root, "assets") + path.sep))
        return send(r, 403, { error: "Forbidden" });
      return fs.readFile(assetPath, (e, d) => {
        if (e) return send(r, 404, { error: "Asset not found" });
        r.writeHead(200, {
          "Content-Type": u.pathname.toLowerCase().endsWith(".jpg")
            ? "image/jpeg"
            : "image/png",
          "Content-Length": d.length,
          "Cache-Control": "public, max-age=86400",
        });
        r.end(d);
      });
    }
    if (q.method === "GET" && m) return send(r, 200, meal(m[1]));
    if (q.method === "GET" && u.pathname === "/api/state")
      return send(r, 200, state());
    if (q.method === "PUT" && u.pathname === "/api/state") {
      let raw = "";
      q.on("data", (c) => (raw += c));
      return q.on("end", () => {
        try {
          let x = JSON.parse(raw);
          if (!Array.isArray(x.saved)) throw Error();
          fs.writeFileSync(data, JSON.stringify({ saved: x.saved }, null, 2));
          send(r, 200, { ok: true });
        } catch {
          send(r, 400, { error: "Expected a saved array." });
        }
      });
    }
    if (q.method === "POST" && u.pathname === "/api/ai-meal") {
      let raw = "";
      q.on("data", (c) => (raw += c));
      return q.on("end", () => {
        try {
          send(r, 200, {
            mode: "local-smart",
            ideas: ideas(JSON.parse(raw).ingredients || []),
          });
        } catch {
          send(r, 400, { error: "Send an ingredients array." });
        }
      });
    }
    if (
      q.method === "GET" &&
      ["/", "/index.html", "/recipe.html"].includes(u.pathname)
    ) {
      let f = u.pathname === "/recipe.html" ? "recipe.html" : "index.html";
      return fs.readFile(path.join(root, f), (e, d) => {
        if (e) return send(r, 404, "Page not found.", "text/plain");
        let page = d.toString();
        if (u.pathname !== "/recipe.html") {
          page = enhance(page);
          page = page.replace("</html>", `<script>
            (() => {
              const plantPattern = /\\b(chickpea|tofu|mushroom|lentil|paneer|egg|black bean|cauliflower)\\b/i;
              const vegAsset = 'assets/vegetarian-meals-v1.jpg';
              const kindOf = (title) => {
                const t = title.toLowerCase();
                if (t.includes('pasta')) return [0, 0];
                if (t.includes('noodle')) return [50, 0];
                if (t.includes('taco')) return [100, 0];
                if (t.includes('curry') || t.includes('rice bowl')) return [0, 100];
                if (t.includes('salad') || t.includes('grain bowl')) return [50, 100];
                if (t.includes('soup')) return [0, 100];
                return [100, 100];
              };
              if (typeof meals !== 'undefined') {
                meals.forEach((m, i) => {
                  const protein = m.name.match(/\\b(chickpea|tofu|mushroom|lentil|paneer|egg|black bean|cauliflower|chicken|salmon)\\b/i)?.[0]?.toLowerCase() || '';
                  const vegan = ['chickpea','tofu','mushroom','lentil','black bean','cauliflower'].includes(protein);
                  const vegetarian = vegan || ['paneer','egg'].includes(protein);
                  m.type = vegan ? 'Vegan' : vegetarian ? 'Vegetarian' : 'High protein';
                  m.tags = [...(vegetarian ? ['Vegetarian'] : []), ...(vegan ? ['Vegan'] : []), 'High protein', ...(i % 3 === 0 ? ['Quick'] : []), ...(i % 4 === 0 ? ['One-pan'] : [])];
                  m.desc = 'A ' + m.cuisine + ' inspired ' + m.tags.filter(x => x !== 'High protein').join(' & ').toLowerCase() + ' plate, designed for real weeknights.';
                });
                if (typeof render === 'function') render();
              }
              const paintPlantMeals = () => document.querySelectorAll('.recipe .visual').forEach(box => {
                const title = box.closest('.recipe')?.querySelector('h3')?.textContent || '';
                if (!plantPattern.test(title)) return;
                const [x, y] = kindOf(title);
                box.replaceChildren();
                box.style.setProperty('background-image', 'url("' + vegAsset + '")', 'important');
                box.style.setProperty('background-size', '300% 200%', 'important');
                box.style.setProperty('background-position', x + '% ' + y + '%', 'important');
                box.setAttribute('role', 'img');
                box.setAttribute('aria-label', title + ', plant-based food photo');
              });
              new MutationObserver(paintPlantMeals).observe(document.querySelector('#grid'), {childList:true});
              paintPlantMeals();
              const apiFetch = window.fetch.bind(window);
              const localMeal = id => {
                const bases=['rice bowl','pasta','taco','wrap','noodle bowl','flatbread','salad','soup','curry','stir-fry','grain bowl','sandwich'];
                const proteins=['chickpea','tofu','chicken','mushroom','lentil','egg','paneer','salmon','black bean','cauliflower'];
                const styles=['lemon herb','smoky','coconut','garlic chilli','tomato basil','peanut lime','ginger sesame','mediterranean','masala','roasted'];
                const cuisines=['Indian','Italian','Mexican','Japanese','Thai','Chinese','Korean','Greek','Lebanese','French','Spanish','Vietnamese','Turkish','Ethiopian','Brazilian','Caribbean','Moroccan','Indonesian','American','Middle Eastern'];
                const n=Math.max(0,Math.min(99999,Number(id)||0)),b=bases[n%bases.length],p=proteins[Math.floor(n/bases.length)%proteins.length],s=styles[Math.floor(n/(bases.length*proteins.length))%styles.length],c=cuisines[n%cuisines.length],cap=x=>x.replace(/\\b\\w/g,z=>z.toUpperCase()),vegan=['chickpea','tofu','mushroom','lentil','black bean','cauliflower'].includes(p),vegetarian=vegan||['paneer','egg'].includes(p),type=vegan?'Vegan':vegetarian?'Vegetarian':'High protein';
                return {id:n,name:c+' '+cap(s)+' '+cap(p)+' '+b,type,time:12+n%34,emoji:'🥗',ingredients:['1 cup '+b,'200g '+p,'2 cloves garlic, finely chopped','1 tbsp olive oil','1 '+s.split(' ')[0]+' or lemon','A handful of fresh herbs','Salt and black pepper'],steps:['Prepare the '+p+' and heat olive oil in a pan.','Add garlic and cook for 30 seconds, then add the '+p+'.','Cook the '+b+' until tender.','Combine everything with '+s+' flavours and a splash of cooking water.','Taste, season, and finish with fresh herbs.'],tip:'Prep every ingredient before the pan gets hot for a calmer cooking flow.'};
              };
              window.fetch = (input, options) => {
                const url = typeof input === 'string' ? input : input.url;
                const match = url.match(/\\/api\\/meals\\/(\\d+)/);
                if (match) return apiFetch(input, options).then(r => r.ok ? r : Promise.reject()).catch(() => new Response(JSON.stringify(localMeal(match[1])), {headers:{'Content-Type':'application/json'}}));
                if (url.includes('/api/ai-meal')) return apiFetch(input, options).then(r => r.ok ? r : Promise.reject()).catch(async () => {
                  const body = JSON.parse(options?.body || '{}'), items=(body.ingredients||[]).filter(Boolean), p=items[0]||'seasonal vegetables', b=items[1]||'rice';
                  return new Response(JSON.stringify({ideas:['Crisp grain bowl','Weeknight skillet','Golden wrap'].map((name,i)=>({name:p+' '+name,time:15+i*4,why:'A practical way to use '+(items.length?items.join(', '):'your flexible pantry staples')+'.'}))}), {headers:{'Content-Type':'application/json'}});
                });
                return apiFetch(input, options);
              };
            })();
          </script></html>`);
          page = page.replaceAll("'/assets/", "'assets/").replaceAll('"/assets/', '"assets/').replaceAll("'/recipe.html?id=", "'recipe.html?id=");
        }
        return send(r, 200, page, "text/html; charset=utf-8");
      });
    }
    send(r, 404, { error: "Not found" });
  })
  .listen(port, () =>
    console.log(`Meal Map API running at http://localhost:${port}`),
  );
