const url = process.env.SMOKE_URL;

if (!url) {
  console.error("Missing SMOKE_URL env var");
  process.exit(1);
}

const targets = [
  "/",
  "/login"
];

async function check(path) {
  const res = await fetch(new URL(path, url), { redirect: "manual" });

  if (![200, 301, 302, 307, 308].includes(res.status)) {
    const text = await res.text().catch(() => "");
    throw new Error(`${path} -> ${res.status}\n${text.slice(0, 200)}`);
  }

  console.log(`✅ ${path} -> ${res.status}`);
}

(async () => {
  for (const p of targets) await check(p);
  console.log("✅ Smoke tests passed");
})().catch((e) => {
  console.error("❌ Smoke test failed:", e.message);
  process.exit(1);
});
