import { useI18n } from '~/composables/useI18n';

export interface NavItem {
  label: string;
  href: string;
  /** Route path prefixes that should mark this item as the current section. */
  match: string[];
}

/**
 * Single source of truth for primary navigation, shared by the desktop header
 * and the mobile bottom bar so labels, targets and "current page" logic never drift.
 */
export function useNavigation() {
  const route = useRoute();
  const { t } = useI18n();

  const items = computed<NavItem[]>(() => [
    { label: t('nav.surah'), href: '/', match: ['/', '/surah'] },
    { label: t('nav.juz'), href: '/juz/1', match: ['/juz'] },
    { label: t('nav.topics'), href: '/topics', match: ['/topics'] },
    { label: t('nav.search'), href: '/search', match: ['/search'] },
    { label: t('nav.tadabbur'), href: '/bookmark', match: ['/bookmark'] }
  ]);

  const isCurrent = (item: NavItem): boolean =>
    item.match.some((prefix) =>
      prefix === '/' ? route.path === '/' : route.path === prefix || route.path.startsWith(`${prefix}/`)
    );

  return { items, isCurrent };
}
