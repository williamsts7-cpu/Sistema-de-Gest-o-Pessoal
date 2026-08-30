const fs = require('fs');
const path = require('path');

const pages = [
  '/today', '/inbox', '/purpose', '/areas', '/goals', '/projects', '/routines', '/processes',
  '/tasks', '/habits', '/calendar', '/knowledge', '/studies', '/content',
  '/reviews/daily', '/reviews/weekly', '/reviews/monthly', '/ai', '/settings'
];

pages.forEach(p => {
  const dir = path.join(process.cwd(), 'app', p);
  fs.mkdirSync(dir, { recursive: true });
  
  const title = p.split('/').filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  
  const content = `export default function Page() {
  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto w-full">
      <h1 className="text-3xl font-bold tracking-tight">${title}</h1>
      <p className="text-muted-foreground">Página em construção para o módulo ${title}.</p>
      <div className="h-[400px] rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center">
        <span className="text-gray-500 text-sm font-medium uppercase tracking-widest">Em breve</span>
      </div>
    </div>
  )
}
`;

  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
});
console.log('Pages generated.');
