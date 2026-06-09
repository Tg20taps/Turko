import type { Category, CategorySlug } from '../../types';

type Props = {
  categories: Category[];
  active: CategorySlug | 'todos';
  onChange: (slug: CategorySlug | 'todos') => void;
};

export function CategoryTabs({ categories, active, onChange }: Props) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Categorias de productos">
      <button
        className={`h-11 shrink-0 rounded-md px-4 text-sm font-bold transition ${
          active === 'todos' ? 'bg-flame text-ink shadow-glow' : 'bg-cream/8 text-cream ring-1 ring-cream/10 hover:bg-cream/14 hover:ring-flame/25'
        }`}
        onClick={() => onChange('todos')}
        type="button"
      >
        Todos
      </button>
      {categories.map((category) => (
        <button
          key={category.slug}
          className={`h-11 shrink-0 rounded-md px-4 text-sm font-bold transition ${
            active === category.slug ? 'bg-flame text-ink shadow-glow' : 'bg-cream/8 text-cream ring-1 ring-cream/10 hover:bg-cream/14 hover:ring-flame/25'
          }`}
          onClick={() => onChange(category.slug)}
          type="button"
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
